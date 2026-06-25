export const BRIEFING_TIMEZONE = "America/Los_Angeles";
export const DEFAULT_BRIEFING_TIME = "10:00";

export function getBriefingHourInTimezone(
  date: Date,
  timeZone: string = BRIEFING_TIMEZONE,
): number {
  const hourPart = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hour12: false,
  })
    .formatToParts(date)
    .find((part) => part.type === "hour");

  return parseInt(hourPart?.value ?? "", 10);
}

export function parseBriefingHour(briefingTime: string): number | null {
  const hour = parseInt(briefingTime.split(":")[0], 10);
  return Number.isNaN(hour) ? null : hour;
}

export function briefingTimeMatchesNow(
  briefingTime: string,
  date: Date = new Date(),
  timeZone: string = BRIEFING_TIMEZONE,
): boolean {
  const configuredHour = parseBriefingHour(briefingTime);
  if (configuredHour === null) {
    return false;
  }

  return configuredHour === getBriefingHourInTimezone(date, timeZone);
}

export function formatNowInTimezone(
  date: Date = new Date(),
  timeZone: string = BRIEFING_TIMEZONE,
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function buildNowContextBlock(
  date: Date = new Date(),
  timeZone: string = BRIEFING_TIMEZONE,
): string {
  const nowLabel = formatNowInTimezone(date, timeZone);
  const iso = date.toISOString();

  return `\n\nCURRENT DATE AND TIME: ${nowLabel} (${iso} UTC).
Treat this as "now" for every deadline, email recency check, calendar conflict, and urgency calculation.`;
}
