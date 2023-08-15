import path from "path";
import { DataFile } from "./DataFile";

export interface EnhancementStage {
  qp: number;
  items: Tuple<number, 2>[];
}

export interface ServantMaterials {
  skill: EnhancementStage[];
  ascension?: EnhancementStage[];
  costume?: PartialDataMap<EnhancementStage>;
}

export interface ServantData {
  id: number;
  name: string;
  rarity: number;
  icons: DataMap<string>;
  skills: Tuple<string, 3>;
  skillsNA?: Tuple<string, 3>;
  mats: ServantMaterials;
  costumes?: PartialDataMap<string>;
  na?: true;
}

export const servantsData = new DataFile<DataMap<ServantData>>(
  path.join(process.cwd(), "data/servants.json")
);
