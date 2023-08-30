import type { AccountServant } from "~/client/account";
import { ServantStat } from "~/client/account";
import type { MaterialData } from "~/data/materials";
import type { EnhancementStage, ServantData } from "~/data/servants";

interface MaterialUsage {
  servant: AccountServant;
  idx: number;
  amount: number;
}

/**
 * Counts Material usage across array of servants
 * @param mat data of materials
 * @param servants array of user's servants to check
 * @param servantsData data of servants
 * @returns Array of Objects containing servants' IDs and the amount they each use
 */
export function flattenMaterialUsage(
  mat: MaterialData,
  servants: AccountServant[],
  servantsData: DataMap<ServantData>
) {
  const usage = new Array<MaterialUsage>();

  function countStage(stage: EnhancementStage) {
    return stage.items.find(([id]) => id == mat.id)?.[1] ?? 0;
  }

  function countStages(
    from: EnhancementStage[],
    current: number,
    target: number
  ) {
    let total = 0;
    for (let i = current; i < target; i++) {
      total += countStage(from[i]);
    }
    return total;
  }

  for (let idx = 0; idx < servants.length; idx++) {
    const servant = servants[idx];
    const servantData = servantsData[servant.id];

    // Special case for holy grail
    if (mat.id == 7999) {
      const amount =
        servant.stats[ServantStat.GRAIL_TARGET] -
        servant.stats[ServantStat.GRAIL_CURRENT];
      if (amount > 0) usage.push({ servant, idx, amount });
      continue;
    }

    let amount =
      // count skill stages
      countStages(
        servantData.mats.skill,
        servant.stats[ServantStat.SKILL1_CURRENT] - 1,
        servant.stats[ServantStat.SKILL1_TARGET] - 1
      ) +
      countStages(
        servantData.mats.skill,
        servant.stats[ServantStat.SKILL2_CURRENT] - 1,
        servant.stats[ServantStat.SKILL2_TARGET] - 1
      ) +
      countStages(
        servantData.mats.skill,
        servant.stats[ServantStat.SKILL3_CURRENT] - 1,
        servant.stats[ServantStat.SKILL3_TARGET] - 1
      ) +
      // count append stages
      countStages(
        servantData.mats.append,
        servant.stats[ServantStat.APPEND1_CURRENT] - 1,
        servant.stats[ServantStat.APPEND1_TARGET] - 1
      ) +
      countStages(
        servantData.mats.append,
        servant.stats[ServantStat.APPEND2_CURRENT] - 1,
        servant.stats[ServantStat.APPEND2_TARGET] - 1
      ) +
      countStages(
        servantData.mats.append,
        servant.stats[ServantStat.APPEND3_CURRENT] - 1,
        servant.stats[ServantStat.APPEND3_TARGET] - 1
      );

    // count ascension stages
    if (servantData.mats.ascension) {
      amount += countStages(
        servantData.mats.ascension,
        servant.stats[ServantStat.ASCENSION_CURRENT],
        servant.stats[ServantStat.ASCENSION_TARGET]
      );
    }

    // count costumes
    if (servantData.mats.costume && servant.costume) {
      const keys = Object.keys(servant.costume) as IdKey[];
      for (const key of keys) {
        if (servant.costume[key] === false) {
          amount += countStage(servantData.mats.costume[key]);
        }
      }
    }

    if (amount >= 1) {
      usage.push({ servant, idx, amount });
    }
  }

  // sort by servant
  usage.sort((a, b) => a.servant.id - b.servant.id);

  return usage;
}
