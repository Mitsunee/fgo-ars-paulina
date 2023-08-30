import { ApiConnector } from "@atlasacademy/api-connector";
import type { GrailCostInfoMap } from "@atlasacademy/api-connector/dist/Schema/Servant";

function formatGrailConstant(constant: GrailCostInfoMap) {
  return Object.entries(constant).map(it => {
    const val = it[1]!;
    const levels = Object.entries(val).sort((a, b) => +a[0] - +b[0]);
    const cap = 120 - levels[levels.length - 1][1]!.addLvMax;
    const stages = levels.map(entry => {
      const info = entry[1]!;
      return { qp: info.qp, add: info.addLvMax };
    });

    return { cap, stages };
  });
}

const api = new ApiConnector();

async function main() {
  const grailConstantRaw = await api.grailConstant();
  const grailConstantFormatted = formatGrailConstant(grailConstantRaw);
  console.log(JSON.stringify(grailConstantFormatted, null, 2));
}

main();
