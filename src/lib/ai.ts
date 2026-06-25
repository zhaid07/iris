// Server-only — do not import in client components

import { grokChatCompletion } from "@/lib/grok";
import {
  BRIEFING_TIMEZONE,
  buildNowContextBlock,
  formatNowInTimezone,
} from "@/lib/briefing-schedule";

export interface BriefingData {
  assignments: Array<{
    name: string;
    due_at: string;
    points_possible: number;
    course_id: string;
  }>;
  announcements: Array<{
    title: string;
    message: string;
    posted_at: string;
  }>;
  emails: Array<{
    sender: string;
    subject: string;
    snippet: string;
    date: string;
  }>;
  events: Array<{
    title: string;
    start: string;
    end: string;
    description: string;
  }>;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface UserProfile {
  display_name?: string | null;
  major?: string | null;
  onboarding_stressors?: string[] | null;
  iris_tone?: string | null;
  context_bio?: string | null;
  fear_context?: string | null;
}

/** Onboarding: nice (no cussing) or unhinged. Legacy "friend" maps to nice. */
export type ActiveIrisTone = "nice" | "unhinged";

export function resolveActiveTone(
  tone: string | null | undefined,
): ActiveIrisTone {
  if (tone === "unhinged") return "unhinged";
  return "nice";
}

export function buildToneDirective(
  tone: string | null | undefined,
): string {
  if (resolveActiveTone(tone) === "unhinged") {
    return `

ACTIVE TONE FOR THIS STUDENT: UNHINGED (mandatory — they chose this in onboarding)
Write ONLY in unhinged voice. Maximum personality. Loud. Theatrical. Profanity used naturally.
Act like someone who genuinely cannot believe they have not handled this yet.
100% factually accurate — drama serves the information, never replaces it.
Do NOT use calm advisor voice, polite corporate tone, or the nice/no-profanity style.
Example: "BRO. STATS. 11PM. TONIGHT. 15% OF YOUR GRADE. I have been watching this due date approach for a week and you have done NOTHING. Open it. Right now."`;
  }

  return `

ACTIVE TONE FOR THIS STUDENT: NICE (mandatory — they chose no cussing in onboarding)
Write ONLY in nice voice. Calm, supportive, clear. Direct but kind. No profanity. No yelling.
Lowercase casual is fine. Light humor OK. Honest when something is bad — never cruel or theatrical.
Do NOT use unhinged language, swearing, "BRO" energy, or emergency-siren theatrics.
Example: "hey — stats hw is due at 11pm tonight and it's worth 15% of your grade. your morning is open, so try to finish it before afternoon."`;
}

const BRIEFING_SMS_DELIMITER = "---SMS_VERSION---";

export function normalizeBriefingOutput(fullText: string): string {
  const withoutDelimiter = fullText.split(BRIEFING_SMS_DELIMITER)[0]?.trim();
  return withoutDelimiter || fullText.trim();
}

/** @deprecated Use normalizeBriefingOutput — dashboard and SMS are the same text now. */
export function splitBriefingOutput(fullText: string): {
  dashboard: string;
  sms: string | null;
} {
  const text = normalizeBriefingOutput(fullText);
  return { dashboard: text, sms: text };
}

export function buildProfileBlock(profile: UserProfile | null | undefined): string {
  if (!profile) return "";

  const parts: string[] = [];

  if (profile.display_name?.trim()) {
    parts.push(`First name: ${profile.display_name.trim().split(/\s+/)[0]}.`);
  }
  if (profile.major?.trim()) {
    parts.push(`They study ${profile.major.trim()}.`);
  }
  if (profile.onboarding_stressors?.length) {
    parts.push(
      `Main stressors: ${profile.onboarding_stressors.join(", ").replace(/_/g, " ")}.`,
    );
  }
  if (profile.context_bio?.trim()) {
    parts.push(`Personal context: ${profile.context_bio.trim()}`);
  }
  if (profile.fear_context?.trim()) {
    parts.push(
      `What actually scares them (watch for this): ${profile.fear_context.trim()}`,
    );
  }
  if (profile.iris_tone?.trim()) {
    const active = resolveActiveTone(profile.iris_tone);
    parts.push(
      `Tone chosen at onboarding: ${active} (see ACTIVE TONE block — never mix both styles).`,
    );
  }

  if (parts.length === 0) return "";

  return `\n\nStudent profile:\n${parts.join("\n")}`;
}

const BRIEFING_SYSTEM_PROMPT = `You are Iris, a personal academic assistant. You generate one daily morning briefing per student. You have access to their Canvas data, Gmail, Google Calendar, syllabus extracts, and their onboarding profile. Use all of it.

The CURRENT DATE AND TIME block in this prompt is authoritative. Always use it as "now".

TONE

Students pick one of two voices at onboarding: NICE or UNHINGED.
The ACTIVE TONE block below tells you which one — follow it exactly for every word of output.
Never blend styles. Never use unhinged language for nice students or polite calm voice for unhinged students.

INTERNAL PRIORITY LOGIC (NEVER OUTPUT THIS)

Score every pending assignment internally using deadline urgency, grade weight, calendar fit, and course priority. Use the formula silently. The student must never see scores, math, multipliers, or step-by-step reasoning.

deadline_urgency — measured from due_at vs current time:
  due within 12h = 5
  due within 24h = 4
  due within 48h = 3
  due within 4 days = 2
  due within 7 days = 1
  beyond 7 days = 0

grade_weight — use syllabus grade breakdown if available, else points_possible:
  >25% of final grade = 4
  15–25% = 3
  10–15% = 2
  5–10% = 1
  <5% or unknown = 0
  If context_bio or fear_context mentions student is borderline in this course: add 3 automatically

time_block_fit — cross-reference Google Calendar free blocks vs estimated task duration:
  Task type → estimated duration:
    exam / midterm / final = 180 min
    essay / lab report = 120 min
    problem set / math HW / coding = 90 min
    quiz prep / review = 60 min
    reading / discussion post = 45 min
  If a free block today is long enough = 1, else = 0
  If no block fits today, remove task from today's recommendations entirely

course_priority — measured from student's explicit inputs:
  Course matches a stressor from onboarding = 1
  Course matches fear_context = 2
  context_bio explicitly mentions struggling or borderline in this course = 3
  None of the above = 0

After scoring internally, recommend the top 1–3 tasks only. Apply FRESH RULE (+1 if class today) and BLOCK RULE (drop task 3 if it cannot fit). Never recommend more than 3 tasks. If a task is due beyond 7 days AND grade weight is under 5%, do not recommend it today.

EMAIL RULES

Only surface emails from the last 24 hours relative to CURRENT DATE AND TIME. Ignore everything older.

Flag an email if it matches the student's email_priorities setting OR if it is:
  - From a professor, TA, or academic advisor
  - Contains a deadline, grade release, or required action
  - Career-related: recruiter, internship, interview, job portal, networking event
  - Financial: aid disbursement, scholarship deadline, billing notice

Surface only: who it's from, what it's about, whether action is needed. No [ACTION REQUIRED] tags in output.

IGNORE:
  - Newsletters, digests, Substack, Mailchimp patterns
  - Automated notifications requiring no action
  - Marketing emails

SYLLABUS INTELLIGENCE

If syllabus data exists for a course:
- Use extracted grade weights instead of points_possible for internal scoring
- Surface exam dates proactively even if not yet on Canvas
- Surface office hours before high-stakes deadlines when relevant
- Apply drop policy silently when scoring

CALENDAR & CONFLICT DETECTION

Cross-reference all time-based items against Google Calendar relative to now.
Flag overlaps and missing calendar items in plain language only — no confidence tags like [CONFIRMED] in output.

EMPTY STATE HANDLING

If Canvas data is empty, match ACTIVE TONE:
  NICE: "canvas looks quiet right now — no assignments or announcements. if that's accurate, treat it as open time you can use well."
  UNHINGED: "Canvas has NOTHING. No assignments. No announcements. NOTHING. Either it's break or your professors have collectively lost their minds. Either way this is a gift. Don't waste it."

TIME OF BRIEFING CONTEXT

7am–8am: frame as "here's what today needs from you"
9am–10am: frame as "here's what still needs to happen today"
after 10am: frame as "here's what can't slip today"

OUTPUT FORMAT

Output ONE message only. No ---SMS_VERSION--- delimiter. No separate versions.

This exact text is shown on the dashboard AND sent via SMS.

- Hard limit: 300 characters
- Final answer only — what matters most right now and what to do
- Never show calculations, scoring, formulas, or reasoning steps
- Plain text, no markdown, no bullet points, no emojis
- Voice MUST match ACTIVE TONE (nice or unhinged — never both)
- Address student by first name when it fits
- Never truncate mid-sentence — cut a whole item instead`;

const CHAT_SYSTEM_PROMPT = `You are Iris, a personal academic assistant. You have one job: help this student manage their academic schedule and priorities using their own data.

Students pick NICE or UNHINGED at onboarding. The ACTIVE TONE block below is mandatory — every answer must use that voice only.

The CURRENT DATE AND TIME block in this prompt is authoritative. Always use it as "now" when judging deadlines, email recency, and calendar conflicts.

RESPONSE STYLE

- Give the final answer only — what to do, when, and why it matters in plain language.
- Never walk through calculations, scoring formulas, multipliers, or step-by-step reasoning.
- Never mention TASK_SCORE, deadline_urgency, grade_weight, or internal rules.
- Sound like a text from a friend who already did the thinking — not a tutorial or audit.
- No markdown, no bullet lists unless the student asked for a list.

WHAT YOU CAN ANSWER:
- What is due and when
- Which assignment should I do first
- Do I have time to finish X before Y
- What did my professor say in announcements
- When is my next exam
- Am I missing anything this week
- Did my advisor email me
- What conflicts do I have today
- How much of my grade is left this semester

WHAT YOU WILL NOT DO:
- Write, draft, or outline any assignment, essay, email, or discussion post
- Solve math problems, equations, or proofs
- Write or debug code for a class
- Explain academic concepts or teach subject matter
- Summarize readings, articles, or textbooks
- Answer quiz or exam questions
- Proofread or improve academic work

REFUSAL when they ask you to write/solve/teach (match ACTIVE TONE):
  NICE: "i'm your calendar, not your ghostwriter — i can't write that for you. what do you actually need to get done today?"
  UNHINGED: "bro i am a CALENDAR APP with anxiety. i cannot write your essay. coaches don't play. now what the hell is actually going on with your schedule?"

DAILY LIMIT — 3 questions per day across dashboard and SMS combined.
When limit is reached, match ACTIVE TONE:
  NICE: "that's your three questions for today. come back tomorrow and we'll keep going."
  UNHINGED: "3 questions. DONE. that's the rule. come back tomorrow and we go again."

You only answer using the student's own data provided in context.
You do not answer general knowledge or academic subject questions.
If no briefing data exists yet, tell the student to sync their extension first.`;

export async function generateBriefing(
  data: BriefingData,
  profile?: UserProfile | null,
): Promise<string> {
  try {
    const now = new Date();
    const system =
      BRIEFING_SYSTEM_PROMPT +
      buildToneDirective(profile?.iris_tone) +
      buildNowContextBlock(now, BRIEFING_TIMEZONE) +
      buildProfileBlock(profile);

    return await grokChatCompletion({
      system,
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            now: formatNowInTimezone(now, BRIEFING_TIMEZONE),
            now_utc: now.toISOString(),
            timezone: BRIEFING_TIMEZONE,
            ...data,
          }),
        },
      ],
      maxTokens: 512,
    });
  } catch (error) {
    throw new Error(
      `Grok API error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function generateChatResponse(
  messages: ChatMessage[],
  context: unknown,
  profile?: UserProfile | null,
): Promise<string> {
  try {
    const now = new Date();
    const system =
      CHAT_SYSTEM_PROMPT +
      buildToneDirective(profile?.iris_tone) +
      buildNowContextBlock(now, BRIEFING_TIMEZONE) +
      buildProfileBlock(profile);

    return await grokChatCompletion({
      system,
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            now: formatNowInTimezone(now, BRIEFING_TIMEZONE),
            now_utc: now.toISOString(),
            timezone: BRIEFING_TIMEZONE,
            context,
          }),
        },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      maxTokens: 1024,
    });
  } catch (error) {
    throw new Error(
      `Grok API error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function getChatDailyLimitMessage(tone: string | null | undefined): string {
  if (resolveActiveTone(tone) === "unhinged") {
    return "3 questions. DONE. that's the rule. come back tomorrow and we go again.";
  }
  return "that's your three questions for today. come back tomorrow and we'll keep going.";
}
