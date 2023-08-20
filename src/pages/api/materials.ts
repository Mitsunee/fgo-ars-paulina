import { readFile } from "fs/promises";
import path from "path";
import type { APIRoute } from "astro";
import buildInfo from "../../../data/info.json";

const lastMod = new Date(buildInfo.date).toUTCString();

export const get: APIRoute = async function ({ request }) {
  try {
    if (request.headers.get("if-modified-since") == lastMod) {
      return new Response(null, { status: 304 });
    }

    const data = await readFile(
      path.join(process.cwd(), "data/materials.json")
    );

    return new Response(data.toString(), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Last-Modified": lastMod,
        "Cache-Control": "max-age=900, must-revalidate"
      }
    });
  } catch {
    return new Response(null, { status: 500 });
  }
};
