import { createContext, useContext } from "react";
import type { BuildInfo } from "~/data/buildInfo";
import type { MaterialData } from "~/data/materials";

export interface DataContext {
  materials: DataMap<MaterialData>;
  info: BuildInfo;
}

export const dataContext = createContext<DataContext>({
  materials: {},
  info: { dataVer: "error", date: 0, JP: 0, NA: 0 }
});

export function useMaterialList() {
  const data = useContext(dataContext);
  return data.materials;
}

export function useBuildInfo() {
  const data = useContext(dataContext);
  return data.info;
}
