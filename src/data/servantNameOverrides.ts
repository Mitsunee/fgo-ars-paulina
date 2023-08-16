import path from "path";
import { ParsedFile } from "@foxkit/node-util/fs-extra";
import YAML from "yaml";
import { z } from "zod";

export const servantNamesFilePath = path.join(
  process.cwd(),
  "src/data/servantNameOverrides.yml"
);

export const ServantNameOverridesSchema = z.record(
  z
    .string()
    .regex(/^\d+$/)
    .transform(val => Number(val)),
  z.string()
);

export type ServantNameOverrides = z.output<typeof ServantNameOverridesSchema>;

export const ServantNameOverridesFile = new ParsedFile({
  parse: value => {
    try {
      const content = YAML.parse(value);
      const parsed = ServantNameOverridesSchema.parse(content);
      return parsed;
    } catch (e) {
      console.error("Could not parse Servant Name Overrides");
      throw e;
    }
  }
});

export async function getServantNameOverridesFile() {
  const res = await ServantNameOverridesFile.readFile(servantNamesFilePath);
  if (!res.success) throw res.error;
  return res.data;
}
