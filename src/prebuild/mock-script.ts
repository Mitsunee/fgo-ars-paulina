import type { BuildInfo } from "~/data/buildInfo";
import { buildInfo } from "~/data/buildInfo";

(async function main() {
  // generate info
  const info: BuildInfo = {
    dataVer: "MOCK_DATA",
    date: Date.now(),
    JP: 0,
    NA: 0
  };

  // write bundles
  const results = await Promise.allSettled([buildInfo.write(info)]);
  const failed = results.filter(
    (result): result is PromiseRejectedResult => result.status == "rejected"
  );

  if (failed.length > 0) {
    failed.forEach(result => {
      console.error(result.reason);
    });
    process.exit(1);
  }

  process.exit(0);
})();
