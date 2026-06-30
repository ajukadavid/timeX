/** Returns YYYY-MM-DD in the given IANA timezone (e.g. "Europe/London"). */
export function getDateInTimezone(timestampMs: number, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(timestampMs));
  } catch {
    return new Date(timestampMs).toISOString().slice(0, 10);
  }
}

/**
 * Returns true if the entry time (in ms) is after the sign-in deadline,
 * evaluated in the org's local timezone.
 */
export function isLateEntry(
  entryTimeMs: number,
  defaultSignInTime: string,
  timezone = "UTC"
): boolean {
  const [hoursStr, minutesStr] = defaultSignInTime.split(":");
  const deadlineHours = Number(hoursStr);
  const deadlineMins = Number(minutesStr);
  if (Number.isNaN(deadlineHours) || Number.isNaN(deadlineMins)) return false;

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date(entryTimeMs));

    const entryHour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
    const entryMin = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

    return entryHour * 60 + entryMin > deadlineHours * 60 + deadlineMins;
  } catch {
    // Fallback: compare UTC
    const deadline = new Date(entryTimeMs);
    deadline.setUTCHours(deadlineHours, deadlineMins, 0, 0);
    return entryTimeMs > deadline.getTime();
  }
}

/**
 * Converts a local date/time string pair to UTC milliseconds for a given timezone.
 * Iterates twice to handle DST transitions correctly.
 */
export function localDateTimeToUTC(
  dateStr: string,
  timeStr: string,
  timezone: string
): number {
  const [yearS, monthS, dayS] = dateStr.split("-");
  const [hourS, minS] = timeStr.split(":");
  const year = Number(yearS);
  const month = Number(monthS);
  const day = Number(dayS);
  const hour = Number(hourS);
  const min = Number(minS);

  if (
    Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day) ||
    Number.isNaN(hour) || Number.isNaN(min)
  ) {
    return Date.now();
  }

  let guess = Date.UTC(year, month - 1, day, hour, min, 0, 0);

  for (let i = 0; i < 2; i++) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date(guess));

    const p = (type: string) => Number(fmt.find((f) => f.type === type)?.value ?? 0);
    const tzMs = Date.UTC(p("year"), p("month") - 1, p("day"), p("hour"), p("minute"), 0, 0);
    const targetMs = Date.UTC(year, month - 1, day, hour, min, 0, 0);
    guess += targetMs - tzMs;
  }

  return guess;
}
