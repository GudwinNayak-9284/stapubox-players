import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Api, USE_DEV, getJSON } from "../api/client";
import type { GroupedTournamentResponse, SportsId, Tournament } from "../types";
import { ymd } from "../utils/date";
import dayjs from "dayjs";

type MapByDate = Record<string, Tournament[]>;

export function useTournamentData(sportsId: SportsId | "ALL", displayedMonth: string) {
  const [all, setAll] = useState<MapByDate>({});
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const acRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    acRef.current?.abort();
    const ac = new AbortController();
    acRef.current = ac;
    setLoading(true);

    try {
      const url = USE_DEV ? Api.devTournaments : Api.tournaments;
      const resp = await getJSON<GroupedTournamentResponse>(url, ac.signal);
      const byDate: MapByDate = {};

      const selectedId = sportsId === "ALL" ? "ALL" : Number(sportsId);

      for (const grp of resp.data) {
        const grpId = grp.sport_id !== undefined ? Number(grp.sport_id) : NaN;

        if (selectedId === "ALL" || grpId === selectedId) {
          for (const t of grp.tournaments) {
            const key = ymd(t.start_date);
            if (!byDate[key]) byDate[key] = [];
            byDate[key].push({ ...t, sport_name: grp.sport_name });
          }
        }
      }

      setAll(byDate);
    } catch {
      setAll({});
      setActiveDate(null);
    } finally {
      setLoading(false);
    }
  }, [sportsId]);

  useEffect(() => {
    load();
    return () => acRef.current?.abort();
  }, [load]);

  const calendarDates = useMemo(() => new Set(Object.keys(all)), [all]);

  const tournamentsForSelectedDate = useMemo<Tournament[]>(() => {
    if (displayedMonth < "2025-08" || displayedMonth > "2025-10") return [];

    if (activeDate) {
      return all[activeDate] ?? [];
    }

    return Object.entries(all).flatMap(([date, items]) => {
      const tournamentMonth = dayjs(date).format("YYYY-MM");
      return tournamentMonth === displayedMonth ? items : [];
    });
  }, [all, activeDate, displayedMonth]);

  return {
    loading,
    calendarDates,
    tournamentsForSelectedDate,
    activeDate,
    displayedMonth,
    setActiveDate,
  };
}
