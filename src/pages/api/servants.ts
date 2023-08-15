import type { NextApiRequest, NextApiResponse } from "next";
import type { ServantData } from "~/data/servants";
import { servantsData } from "~/data/servants";
import buildInfo from "../../../data/info.json";

const lastMod = new Date(buildInfo.date).toUTCString();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataMap<ServantData>>
) {
  if (req.headers["if-modified-since"] == lastMod) {
    res.status(304).end();
    return;
  }

  res.setHeader("Last-Modified", lastMod);
  res.setHeader("Cache-Control", "max-age=900, must-revalidate");
  const data = await servantsData.read();
  res.status(200).json(data);
}
