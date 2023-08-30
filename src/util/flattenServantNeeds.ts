import type { AccountServant } from "~/client/account";
import { ServantStat } from "~/client/account";
import type { MaterialData } from "~/data/materials";
import type { EnhancementStage, ServantData } from "~/data/servants";

interface MaterialAmount {
  id: number;
  amount: number;
}

/**
 * Flattens materials needed by user's servants and counts QP needed
 * @param servants User's Servants
 * @param servantsData data of servants
 * @param materialsData data of materials
 * @returns Object counting amount of QP needed and Array of Object's containing materials' IDs and the amount needed
 */
export function flattenServantsNeeds(
  servants: AccountServant[],
  servantsData: DataMap<ServantData>,
  materialsData: DataMap<MaterialData>
) {
  const map = new Map<number, MaterialAmount>();
  const res = { qp: 0, mats: new Array<MaterialAmount>() };

  function addStage(stage: EnhancementStage) {
    res.qp += stage.qp;
    for (const [id, amount] of stage.items) {
      const mat = map.get(id);
      if (!mat) {
        const newMat: MaterialAmount = { id, amount };
        map.set(id, newMat);
        res.mats.push(newMat);
        continue;
      }
      mat.amount += amount;
    }
  }

  function addStages(
    from: EnhancementStage[],
    current: number,
    target: number
  ) {
    for (let i = current; i < target; i++) {
      const stage = from[i];
      addStage(stage);
    }
  }

  for (const servant of servants) {
    const servantData = servantsData[servant.id];

    // add skill stages
    addStages(
      servantData.mats.skill,
      servant.stats[ServantStat.SKILL1_CURRENT] - 1,
      servant.stats[ServantStat.SKILL1_TARGET] - 1
    );
    addStages(
      servantData.mats.skill,
      servant.stats[ServantStat.SKILL2_CURRENT] - 1,
      servant.stats[ServantStat.SKILL2_TARGET] - 1
    );
    addStages(
      servantData.mats.skill,
      servant.stats[ServantStat.SKILL3_CURRENT] - 1,
      servant.stats[ServantStat.SKILL3_TARGET] - 1
    );

    // add append stages
    addStages(
      servantData.mats.append,
      Math.max(servant.stats[ServantStat.APPEND1_CURRENT] - 1, 0),
      Math.max(servant.stats[ServantStat.APPEND1_TARGET] - 1, 0)
    );
    addStages(
      servantData.mats.append,
      Math.max(servant.stats[ServantStat.APPEND2_CURRENT] - 1, 0),
      Math.max(servant.stats[ServantStat.APPEND2_TARGET] - 1, 0)
    );
    addStages(
      servantData.mats.append,
      Math.max(servant.stats[ServantStat.APPEND3_CURRENT] - 1, 0),
      Math.max(servant.stats[ServantStat.APPEND3_TARGET] - 1, 0)
    );

    // add ascension stages
    if (servantData.mats.ascension) {
      addStages(
        servantData.mats.ascension,
        servant.stats[ServantStat.ASCENSION_CURRENT],
        servant.stats[ServantStat.ASCENSION_TARGET]
      );
    }

    // add costumes
    if (servantData.mats.costume && servant.costume) {
      const keys = Object.keys(servant.costume) as IdKey[];
      for (const key of keys) {
        if (servant.costume[key] === false) {
          addStage(servantData.mats.costume[key]);
        }
      }
    }
  }

  // sort
  res.mats.sort((a, b) => {
    const itemA = materialsData[a.id];
    const itemB = materialsData[b.id];

    return itemA.priority - itemB.priority;
  });

  return res;
}

/**
 * Flattens materials needed by user's servant and counts QP needed
 * @param servant User Servant
 * @param servantData data of servant
 * @param materialsData data of materials
 * @returns Object counting amount of QP needed and Array of Object's containing materials' IDs and the amount needed
 */
export function flattenServantNeeds(
  servant: AccountServant,
  servantData: ServantData,
  materialsData: DataMap<MaterialData>
) {
  return flattenServantsNeeds(
    [servant],
    { [servant.id]: servantData },
    materialsData
  );
}
