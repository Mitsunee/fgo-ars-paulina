import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { BuildInfo } from "~/data/buildInfo";
import type { MaterialData } from "~/data/materials";
import type { ServantData } from "~/data/servants";

export const infoContext = createContext<BuildInfo>({
  dataVer: "error",
  date: 0,
  JP: 0,
  NA: 0
});

export function useBuildInfo() {
  return useContext(infoContext);
}

export const servantsContext = createContext<DataMap<ServantData>>({});
export function useServantsData() {
  return useContext(servantsContext);
}

export const materialsContext = createContext<DataMap<MaterialData>>({});
export function useMaterialList() {
  return useContext(materialsContext);
}
