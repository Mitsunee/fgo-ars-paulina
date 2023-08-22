import { useEffect, useState } from "preact/hooks";
import type { MaterialData } from "~/data/materials";
import type { ServantData } from "~/data/servants";

type DataState<T> =
  | { status: "loading" | "error"; data?: undefined }
  | { status: "success"; data: T };

function useApiEndpoint<T>(url: string) {
  const [state, setState] = useState<DataState<T>>({ status: "loading" });

  useEffect(() => {
    if (typeof window == "undefined") return;
    const controller = new AbortController();
    let retries = 3;

    (async () => {
      while (retries-- && !controller.signal.aborted) {
        const res = await fetch(url, { cache: "default" });
        if (!res.ok) continue;
        if (!controller.signal.aborted) {
          setState({ status: "success", data: await res.json() });
        }
        return;
      }

      setState({ status: "error" });
    })();

    return () => controller.abort();
  }, [url]);

  return state;
}

export function useServantsDataApi() {
  return useApiEndpoint<DataMap<ServantData>>("/api/servants");
}

export function useMaterialsDataApi() {
  return useApiEndpoint<DataMap<MaterialData>>("/api/materials");
}
