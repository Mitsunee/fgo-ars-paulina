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

    fetch(url, { cache: "default", signal: controller.signal })
      .then(res => res.json())
      .then(data => setState({ status: "success", data }))
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ status: "error" });
      });
  }, [url]);

  return state;
}

export function useServantsDataApi() {
  return useApiEndpoint<DataMap<ServantData>>("/api/servants");
}

export function useMaterialsDataApi() {
  return useApiEndpoint<DataMap<MaterialData>>("/api/materials");
}
