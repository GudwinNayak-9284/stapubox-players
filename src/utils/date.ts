import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const IST_TZ = "Asia/Kolkata";

export function toIST(iso?: string | null) {
  if (!iso) return null;

  // If it ends with Z or has timezone offset, trust it
  if (iso.endsWith("Z") || /[+-]\d\d:?\d\d$/.test(iso)) {
    return dayjs(iso).tz(IST_TZ);
  }

  // ✅ Treat as UTC explicitly
  return dayjs.utc(iso, "YYYY-MM-DDTHH:mm:ss").tz(IST_TZ);
}

/** Format date range nicely */
export function fmtDateRange(startISO: string, endISO?: string | null) {
  const s = toIST(startISO);
  if (!s) return "TBD";

  const e = endISO ? toIST(endISO) : null;
  if (!e) return s.format("DD MMM YYYY");

  if (s.isSame(e, "day")) {
    return s.format("DD MMM YYYY");
  }
  return `${s.format("DD MMM YYYY")} - ${e.format("DD MMM YYYY")}`;
}

/** Format a single time in IST */
export function fmtTimeIST(iso?: string | null) {
  if (!iso) return "TBD";
  const date = toIST(iso);
  if (!date || !date.isValid()) return "TBD";
  return date.format("hh:mm A");
}

/** Return YYYY-MM-DD */
export function ymd(iso: string) {
  const date = toIST(iso);
  if (!date || !date.isValid()) return "";
  return date.format("YYYY-MM-DD");
}
