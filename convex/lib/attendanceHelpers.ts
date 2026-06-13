/** Returns true if entry is after the employer's default sign-in time (HH:mm). */
export function isLateEntry(entryTimeMs: number, defaultSignInTime: string): boolean {
  const entry = new Date(entryTimeMs);
  const [hoursStr, minutesStr] = defaultSignInTime.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;

  const deadline = new Date(entry);
  deadline.setHours(hours, minutes, 0, 0);
  return entry.getTime() > deadline.getTime();
}
