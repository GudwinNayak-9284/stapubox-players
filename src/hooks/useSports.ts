import { useEffect, useRef, useState } from "react";
import { Api, USE_DEV, getJSON } from "../api/client";
import type { Sport } from "../types";

export function useSports() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedId, setSelectedId] = useState<"ALL" | number>("ALL");
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    const url = USE_DEV ? Api.devSports : Api.sports;

    getJSON<{ data: any[] }>(url, controller.signal)
      .then((res) => {
        const list = (res.data ?? []).map(
          (item) =>
            ({
              id: Number(item.sport_id),
              name: item.sport_name,
            } as Sport)
        );
        setSports(list);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { sports, selectedId, setSelectedId, loading };
}
