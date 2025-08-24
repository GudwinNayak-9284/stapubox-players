import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const IST_TZ = "Asia/Kolkata";

export function toIST(iso?: string | null) {
  if (!iso) return null;
  return dayjs.utc(iso).tz(IST_TZ);
}

export function fmtDateRange(startISO: string, endISO?: string | null) {
  const s = toIST(startISO);
  if (!s) return "";

  const e = endISO ? toIST(endISO) : null;
  if (!e) return s.format("DD MMM YYYY");

  if (s.isSame(e, "day")) {
    return s.format("DD MMM YYYY");
  }
  return `${s.format("DD MMM YYYY")} - ${e.format("DD MMM YYYY")}`;
}

export function fmtTimeIST(iso?: string | null) {
  if (!iso) return "";
  const date = toIST(iso);
  if (!date) return "";
  return date.format("hh:mm A");
}

export function ymd(iso: string) {
  const date = toIST(iso);
  if (!date) return "";
  return date.format("YYYY-MM-DD");
}
