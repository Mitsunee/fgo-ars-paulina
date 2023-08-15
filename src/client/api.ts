import { useEffect, useState } from "react";
import type { ServantData } from "~/data/servants";

type ServantsDataState =
  | { state: "loading" | "error"; data?: undefined }
  | { state: "success"; data: DataMap<ServantData> };

export function useServantsDataApi() {
  const [state, setState] = useState<ServantsDataState>({ state: "loading" });

  useEffect(() => {
    if (typeof window == "undefined") return;
    const controller = new AbortController();

    fetch("/api/servants", { cache: "default", signal: controller.signal })
      .then(res => res.json())
      .then(data => setState({ state: "success", data }))
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ state: "error" });
      });

    return () => controller.abort();
  }, []);

  return state;
}
