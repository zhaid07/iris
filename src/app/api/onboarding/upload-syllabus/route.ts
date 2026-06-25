import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { getGrokModel, grokChatCompletion } from "@/lib/grok";
import { extractPdfText } from "@/lib/pdf";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const MAX_PDF_BYTES = 10 * 1024 * 1024;
const MAX_SYLLABUS_TEXT_CHARS = 50_000;

const EXTRACT_PROMPT = `Extract the following from this course syllabus as JSON:
{
  grade_weights: [{ category: string, percentage: number }],
  exam_dates: [{ name: string, date: string }],
  office_hours: string,
  drop_policy: string | null,
  professor_name: string | null,
  professor_email: string | null
}
Return only valid JSON, no explanation.`;

interface ParsedSyllabus {
  grade_weights?: unknown;
  exam_dates?: unknown;
  office_hours?: string | null;
  drop_policy?: string | null;
  professor_name?: string | null;
  professor_email?: string | null;
}

function parseSyllabusJson(text: string): ParsedSyllabus | null {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed) as ParsedSyllabus;
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      try {
        return JSON.parse(fenced[1].trim()) as ParsedSyllabus;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const courseNameRaw = formData.get("courseName");
    const courseName =
      typeof courseNameRaw === "string" ? courseNameRaw.trim().slice(0, 60) : "";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "PDF file is required" },
        { status: 400 },
      );
    }

    if (!courseName) {
      return NextResponse.json(
        { success: false, error: "Course name is required" },
        { status: 400 },
      );
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { success: false, error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { success: false, error: "PDF file is too large" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let parsed: ParsedSyllabus | null = null;

    try {
      const syllabusText = (await extractPdfText(buffer)).slice(
        0,
        MAX_SYLLABUS_TEXT_CHARS,
      );

      if (syllabusText) {
        const text = await grokChatCompletion({
          messages: [
            {
              role: "user",
              content: `${EXTRACT_PROMPT}\n\nSYLLABUS TEXT:\n${syllabusText}`,
            },
          ],
          maxTokens: 1024,
          model: getGrokModel("fast"),
        });

        parsed = parseSyllabusJson(text);
      }
    } catch (error) {
      console.error("Syllabus extraction failed:", error);
    }

    const { error: insertError } = await supabase.from("syllabi").insert({
      user_id: user.id,
      course_name: courseName,
      grade_weights: parsed?.grade_weights ?? null,
      exam_dates: parsed?.exam_dates ?? null,
      office_hours: parsed?.office_hours ?? null,
      drop_policy: parsed?.drop_policy ?? null,
      professor_name: parsed?.professor_name ?? null,
      professor_email: parsed?.professor_email ?? null,
    });

    if (insertError) {
      console.error("Failed to save syllabus:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to save syllabus" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, courseName });
  } catch (error) {
    console.error("Upload syllabus error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload syllabus" },
      { status: 500 },
    );
  }
}
