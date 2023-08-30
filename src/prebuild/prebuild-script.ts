import { ApiConnector, Language, Region } from "@atlasacademy/api-connector";
import { EntityType } from "@atlasacademy/api-connector/dist/Schema/Entity";
import type { Info } from "@atlasacademy/api-connector/dist/Schema/Info";
import type { ServantWithLore } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { BuildInfo } from "~/data/buildInfo";
import { buildInfo } from "~/data/buildInfo";
import { materialsData } from "~/data/materials";
import { getServantNameOverridesFile } from "~/data/servantNameOverrides";
import { servantsData } from "~/data/servants";
import { arrayToDataMap } from "~/util/arrayToDataMap";
import { apiItemToMaterial, getItemsFromNiceServant } from "./items";
import { generateServantNameList } from "./servantNames";
import { apiServantToServantData } from "./servants";

const api = {
  JP: new ApiConnector({ region: Region.JP, language: Language.ENGLISH }),
  NA: new ApiConnector({ region: Region.NA, language: Language.ENGLISH })
};

export async function getApiInfo(): Promise<{ NA: Info; JP: Info }> {
  const res = await fetch("https://api.atlasacademy.io/info");
  if (!res.ok) throw new Error("Could not fetch API info");

  return res.json();
}

function filterServantList(list: ServantWithLore[]) {
  return list.filter(
    servant => servant.type == EntityType.NORMAL || servant.id == 800100
  );
}

(async function main() {
  const [niceServant, niceServantNA, servantNameOverrides, apiInfo] =
    await Promise.all([
      api.JP.servantListNiceWithLore().then(filterServantList),
      api.NA.servantListNiceWithLore().then(filterServantList),
      getServantNameOverridesFile(),
      getApiInfo()
    ]);

  // get materials
  const niceItem = getItemsFromNiceServant(niceServant);
  const niceItemNA = getItemsFromNiceServant(niceServantNA);
  const materials = arrayToDataMap(
    niceItem
      .map(item => {
        const itemNA = niceItemNA.find(itemNA => itemNA.id == item.id);
        const material = apiItemToMaterial(itemNA || item);
        return material;
      })
      .concat({
        id: 7999,
        name: "Holy Grail",
        icon: "https://static.atlasacademy.io/NA/Items/7999.png",
        priority: 400,
        rarity: "gold",
        na: true
      })
  );

  // get servant names
  const servantNamesMap = await generateServantNameList(
    niceServant,
    niceServantNA,
    servantNameOverrides
  );

  // get servants
  const servants = arrayToDataMap(
    niceServant
      .sort((a, b) => a.collectionNo - b.collectionNo)
      .map(servant => {
        const servantNA = niceServantNA.find(
          servantNA => servantNA.id == servant.id
        );
        const data = apiServantToServantData(
          servant,
          servantNA,
          servantNamesMap[servant.id]
        );
        return data;
      })
  );

  // format info
  const info: BuildInfo = {
    dataVer: "0.1.3",
    date: Date.now(),
    JP: apiInfo.JP.timestamp,
    NA: apiInfo.NA.timestamp
  };

  // write bundles
  const results = await Promise.allSettled([
    materialsData.write(materials),
    servantsData.write(servants),
    buildInfo.write(info)
  ]);
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
