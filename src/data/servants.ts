import path from "path";
import { DataFile } from "./DataFile";
import type { ServantClass } from "./ServantClass";

export interface EnhancementStage {
  qp: number;
  items: Tuple<number, 2>[];
}

export interface ServantMaterials {
  skill: EnhancementStage[];
  append: EnhancementStage[];
  ascension?: EnhancementStage[];
  costume?: PartialDataMap<EnhancementStage>;
}

export interface ServantData {
  id: number;
  name: string;
  rarity: number;
  className: ServantClass;
  icons: DataMap<string>;
  skills: Tuple<string, 3>;
  skillsNA?: Tuple<string, 3>;
  mats: ServantMaterials;
  costumes?: DataMap<string>;
  na?: true;
}

export const servantsData = new DataFile<DataMap<ServantData>>(
  path.join(process.cwd(), "data/servants.json")
);
