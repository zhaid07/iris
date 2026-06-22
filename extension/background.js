import { IRIS_EXTENSION_SECRET, SYNC_API_URL } from "./config.js";

const ALARM_NAME = "canvas-sync";
const DAILY_MINUTES = 24 * 60;

function normalizeCanvasDomain(domain) {
  return domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    title,
    message,
  });
}

async function scheduleDailySync() {
  await chrome.alarms.clear(ALARM_NAME);
  await chrome.alarms.create(ALARM_NAME, { periodInMinutes: DAILY_MINUTES });
}

async function canvasFetch(canvasDomain, cookieValue, path) {
  return fetch(`https://${canvasDomain}${path}`, {
    headers: {
      Cookie: `canvas_session=${cookieValue}`,
    },
  });
}

async function fetchCourses(canvasDomain, cookieValue) {
  const response = await canvasFetch(
    canvasDomain,
    cookieValue,
    "/api/v1/courses?enrollment_state=active&per_page=50",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Canvas courses");
  }

  const data = await response.json();

  return data.map((course) => ({
    id: String(course.id),
    name: course.name,
    course_code: course.course_code,
  }));
}

async function fetchAssignments(canvasDomain, cookieValue, courses) {
  const now = Date.now();
  const fourteenDaysFromNow = now + 14 * 24 * 60 * 60 * 1000;

  const results = await Promise.all(
    courses.map(async (course) => {
      try {
        const response = await canvasFetch(
          canvasDomain,
          cookieValue,
          `/api/v1/courses/${course.id}/assignments?per_page=50`,
        );

        if (!response.ok) {
          return [];
        }

        const data = await response.json();

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
            due_at: assignment.due_at,
            points_possible: assignment.points_possible ?? 0,
            course_id: course.id,
          }));
      } catch {
        return [];
      }
    }),
  );

  return results.flat();
}

async function fetchAnnouncements(canvasDomain, cookieValue, courses) {
  if (courses.length === 0) {
    return [];
  }

  const params = courses
    .map((course) => `context_codes[]=course_${course.id}`)
    .join("&");

  const response = await canvasFetch(
    canvasDomain,
    cookieValue,
    `/api/v1/announcements?${params}`,
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  return data.map((announcement) => ({
    title: announcement.title,
    message: stripHtml(announcement.message),
    posted_at: announcement.posted_at,
  }));
}

async function syncCanvas() {
  const { canvasDomain: storedDomain, userId } = await chrome.storage.local.get([
    "canvasDomain",
    "userId",
  ]);

  if (!storedDomain || !userId) {
    showNotification(
      "Iris setup required",
      "Open the Iris extension to finish setup",
    );
    return;
  }

  const canvasDomain = normalizeCanvasDomain(storedDomain);

  const cookie = await chrome.cookies.get({
    url: `https://${canvasDomain}`,
    name: "canvas_session",
  });

  if (!cookie?.value) {
    showNotification(
      "Canvas login required",
      "Please log into Canvas to sync Iris",
    );
    return;
  }

  try {
    const courses = await fetchCourses(canvasDomain, cookie.value);
    const assignments = await fetchAssignments(
      canvasDomain,
      cookie.value,
      courses,
    );
    const announcements = await fetchAnnouncements(
      canvasDomain,
      cookie.value,
      courses,
    );

    const data = { courses, assignments, announcements };

    const response = await fetch(SYNC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-iris-secret": IRIS_EXTENSION_SECRET,
      },
      body: JSON.stringify({ data, userId, canvasDomain }),
    });

    if (!response.ok) {
      throw new Error(`Sync failed with status ${response.status}`);
    }

    await chrome.storage.local.set({
      status: "synced",
      lastSync: Date.now(),
    });

    await scheduleDailySync();
    showNotification("Iris sync complete", "Iris synced your Canvas ✓");
  } catch (error) {
    console.error("Canvas sync failed:", error);
    await chrome.storage.local.set({ status: "error" });
    showNotification("Iris sync failed", "Iris failed to sync Canvas");
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await scheduleDailySync();
  chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    syncCanvas();
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "sync-now") {
    syncCanvas();
  }
});
