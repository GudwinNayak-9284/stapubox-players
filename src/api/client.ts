const STAPUBOX_BASE = "https://stapubox.com";
const MOCK_BASE = "https://mockly.me/custom";

export const Api = {
  sports: `${STAPUBOX_BASE}/sportslist`,
  tournaments: `${STAPUBOX_BASE}/tournament/demo`,
  devSports: `${MOCK_BASE}/sportslist`,
  devTournaments: `${MOCK_BASE}/tournament/demo`
};

export const USE_DEV = false;
export async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}
