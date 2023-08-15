import { useStore } from "@nanostores/react";
import { atom, onMount } from "nanostores";
import type { ServantData } from "~/data/servants";

type DataAtom<T> =
  | { state: "loading" | "error"; data?: undefined }
  | { state: "success"; data: T };
type ServantsDataAtom = DataAtom<DataMap<ServantData>>;
const servantsDataStore = atom<ServantsDataAtom>({ state: "loading" });

onMount(servantsDataStore, () => {
  if (typeof window == "undefined") return;
  fetch("/api/servants", { cache: "default" })
    .then(res => res.json())
    .then(data => servantsDataStore.set({ state: "success", data }))
    .catch(() => servantsDataStore.set({ state: "error" }));
});

export function useServantsData() {
  return useStore(servantsDataStore);
}
