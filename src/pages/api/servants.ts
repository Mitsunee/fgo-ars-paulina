import type { APIRoute } from "astro";
//import type { ServantData } from "~/data/servants";
import { servantsData } from "~/data/servants";
import buildInfo from "../../../data/info.json";

const lastMod = new Date(buildInfo.date).toUTCString();

export const get: APIRoute = async function ({ request }) {
  if (request.headers.get("if-modified-since") == lastMod) {
    return new Response(null, { status: 304 });
  }

  const data = await servantsData.read();

  return new Response(
    JSON.stringify(data), // TODO: do fs read to avoid needing to re-stringify here
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Last-Modified": lastMod,
        "Cache-Control": "max-age=900, must-revalidate"
      }
    }
  );
};
