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

async function canvasFetch(canvasDomain, path) {
  return fetch(`https://${canvasDomain}${path}`, {
    credentials: "include",
  });
}

async function fetchCourses(canvasDomain) {
  console.log("[Iris] Fetching dashboard courses from", canvasDomain);
  const response = await canvasFetch(
    canvasDomain,
    "/api/v1/dashboard/dashboard_cards",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Canvas dashboard courses");
  }

  const data = await response.json();
  console.log("[Iris] Fetched", data.length, "dashboard courses");
  console.log("[Iris] First course raw:", JSON.stringify(data[0]));

  const sixMonthsAgo = Date.now() - 180 * 24 * 60 * 60 * 1000;

  return data
    .filter((course) => {
      const endAt = course.term?.endAt;
      if (!endAt) return true; // no end date, keep it
      return new Date(endAt).getTime() > sixMonthsAgo;
    })
    .map((course) => ({
      id: String(course.id),
      name: course.shortName || course.originalName || course.courseCode,
      course_code: course.courseCode,
    }));
}

async function fetchAllPages(canvasDomain, path) {
  let url = `https://${canvasDomain}${path}`;
  const results = [];
  while (url) {
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) break;
    const data = await response.json();
    results.push(...data);
    const link = response.headers.get("Link") || "";
    const next = link.match(/<([^>]+)>;\s*rel="next"/);
    url = next ? next[1] : null;
  }
  return results;
}

async function fetchAssignments(canvasDomain, courses) {
  const results = await Promise.all(
    courses.map(async (course) => {
      try {
        const data = await fetchAllPages(
          canvasDomain,
          `/api/v1/courses/${course.id}/assignments?per_page=50`,
        );

        return data
          .filter((assignment) => assignment.due_at)
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

async function fetchAnnouncements(canvasDomain, courses) {
  if (courses.length === 0) {
    return [];
  }

  const params = courses
    .map((course) => `context_codes[]=course_${course.id}`)
    .join("&");

  const response = await canvasFetch(
    canvasDomain,
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
    console.log("[Iris] Starting sync for domain:", canvasDomain);
    const courses = await fetchCourses(canvasDomain);
    const assignments = await fetchAssignments(canvasDomain, courses);
    const announcements = await fetchAnnouncements(canvasDomain, courses);
    console.log("[Iris] Sync data:", { courses: courses.length, assignments: assignments.length, announcements: announcements.length });

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
