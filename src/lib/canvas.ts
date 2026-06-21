// Server-only — do not import in client components

import { decrypt } from "@/lib/encryption";

export interface CanvasIntegration {
  canvas_token: string | null;
  canvas_domain: string | null;
}

export interface CanvasCourse {
  id: string;
  name: string;
  course_code: string;
}

export interface CanvasAssignment {
  name: string;
  due_at: string;
  points_possible: number;
  course_id: string;
}

export interface CanvasAnnouncement {
  title: string;
  message: string;
  posted_at: string;
}

export interface CanvasData {
  courses: CanvasCourse[];
  assignments: CanvasAssignment[];
  announcements: CanvasAnnouncement[];
}

const EMPTY_RESULT: CanvasData = {
  courses: [],
  assignments: [],
  announcements: [],
};

function normalizeCanvasDomain(domain: string): string {
  return domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export async function fetchCanvasData(
  integration: CanvasIntegration,
): Promise<CanvasData> {
  if (!integration.canvas_token || !integration.canvas_domain) {
    return EMPTY_RESULT;
  }

  let token: string;
  try {
    token = decrypt(integration.canvas_token);
  } catch {
    console.error("Canvas token decryption failed");
    return EMPTY_RESULT;
  }

  const domain = normalizeCanvasDomain(integration.canvas_domain);

  async function canvasFetch(path: string): Promise<Response> {
    return fetch(`https://${domain}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let courses: CanvasCourse[] = [];

  try {
    const response = await canvasFetch(
      "/api/v1/courses?enrollment_state=active&per_page=50",
    );

    if (response.ok) {
      const data = (await response.json()) as Array<{
        id: number;
        name: string;
        course_code: string;
      }>;

      courses = data.map((course) => ({
        id: String(course.id),
        name: course.name,
        course_code: course.course_code,
      }));
    } else {
      console.error("Canvas courses fetch failed");
    }
  } catch {
    console.error("Canvas courses fetch failed");
  }

  let assignments: CanvasAssignment[] = [];

  if (courses.length > 0) {
    try {
      const now = Date.now();
      const fourteenDaysFromNow = now + 14 * 24 * 60 * 60 * 1000;

      const assignmentResults = await Promise.all(
        courses.map(async (course) => {
          try {
            const response = await canvasFetch(
              `/api/v1/courses/${course.id}/assignments?per_page=50`,
            );

            if (!response.ok) {
              return [];
            }

            const data = (await response.json()) as Array<{
              name: string;
              due_at: string | null;
              points_possible: number | null;
            }>;

            return data
              .filter((assignment) => {
                if (!assignment.due_at) {
                  return false;
                }

                const dueTime = new Date(assignment.due_at).getTime();
                return dueTime >= now && dueTime <= fourteenDaysFromNow;
              })
              .map((assignment) => ({
                name: assignment.name,
                due_at: assignment.due_at as string,
                points_possible: assignment.points_possible ?? 0,
                course_id: course.id,
              }));
          } catch {
            return [];
          }
        }),
      );

      assignments = assignmentResults.flat();
    } catch {
      console.error("Canvas assignments fetch failed");
    }
  }

  let announcements: CanvasAnnouncement[] = [];

  if (courses.length > 0) {
    try {
      const params = courses
        .map((course) => `context_codes[]=course_${course.id}`)
        .join("&");
      const response = await canvasFetch(`/api/v1/announcements?${params}`);

      if (response.ok) {
        const data = (await response.json()) as Array<{
          title: string;
          message: string;
          posted_at: string;
        }>;

        announcements = data.map((announcement) => ({
          title: announcement.title,
          message: stripHtml(announcement.message),
          posted_at: announcement.posted_at,
        }));
      } else {
        console.error("Canvas announcements fetch failed");
      }
    } catch {
      console.error("Canvas announcements fetch failed");
    }
  }

  return { courses, assignments, announcements };
}
