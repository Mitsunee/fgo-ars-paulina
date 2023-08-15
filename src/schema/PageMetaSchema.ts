import type { z } from "zod";
import { object, string } from "zod";

export const PageMetaSchema = object({
  meta: object({
    title: string().default("FGO Manager"),
    description: string().default(
      "This page should not be publically accessible"
    )
  }).default({})
});

export type PageMeta = z.infer<typeof PageMetaSchema>;
