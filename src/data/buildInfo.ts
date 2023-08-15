import path from "path";
import { DataFile } from "./DataFile";

export interface BuildInfo {
  dataVer: string;
  date: number;
  JP: number;
  NA: number;
}

export const buildInfo = new DataFile<BuildInfo>(
  path.join(process.cwd(), "data/info.json")
);
