import path from "path";
import { DataFile } from "./DataFile";

export interface MaterialData {
  id: number;
  name: string;
  icon: string;
  rarity: Rarity;
  priority: number;
  na?: true;
}

export const materialsData = new DataFile<DataMap<MaterialData>>(
  path.join(process.cwd(), "data/materials.json")
);
