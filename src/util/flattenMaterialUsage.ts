import type { AccountServant } from "~/client/account";
import { ServantStat } from "~/client/account";
import type { MaterialData } from "~/data/materials";
import type { EnhancementStage, ServantData } from "~/data/servants";

interface MaterialUsage {
  total: number;
  byServant: Record<IdKey, number>;
  material: MaterialData;
}

const cache = new WeakMap<AccountServant[], MaterialUsage[]>();

export function flattenMaterialUsage(
  servants: AccountServant[],
  servantsData: DataMap<ServantData>,
  materialsData: DataMap<MaterialData>
) {
  const cached = cache.get(servants);
  if (cached) return cached;
  const map = new Map<number, MaterialUsage>();
  const res = new Array<MaterialUsage>();

  function addAmount(itemId: number, amount: number, servantIdx: number) {
    if (amount < 1) return;
    const usage = map.get(itemId);
    if (usage) {
      usage.total += amount;
      usage.byServant[servantIdx] = (usage.byServant[servantIdx] || 0) + amount;
      return;
    }

    const newUsage: MaterialUsage = {
      total: amount,
      byServant: { [servantIdx]: amount },
      material: materialsData[itemId]
    };

    map.set(itemId, newUsage);
    res.push(newUsage);
  }

  function addStage(stage: EnhancementStage, servantIdx: number) {
    if (!stage) return;
    stage.items.forEach(([item, amount]) =>
      addAmount(item, amount, servantIdx)
    );
  }

  function addStages(
    from: EnhancementStage[],
    servantIdx: number,
    current: number,
    target: number
  ) {
    for (let i = Math.max(0, current); i < Math.min(target, from.length); i++) {
      addStage(from[i], servantIdx);
    }
  }

  for (let idx = 0; idx < servants.length; idx++) {
    const servant = servants[idx];
    const servantData = servantsData[servant.id];

    // count skill stages
    addStages(
      servantData.mats.skill,
      idx,
      servant.stats[ServantStat.SKILL1_CURRENT] - 1,
      servant.stats[ServantStat.SKILL1_TARGET] - 1
    );
    addStages(
      servantData.mats.skill,
      idx,
      servant.stats[ServantStat.SKILL2_CURRENT] - 1,
      servant.stats[ServantStat.SKILL2_TARGET] - 1
    );
    addStages(
      servantData.mats.skill,
      idx,
      servant.stats[ServantStat.SKILL3_CURRENT] - 1,
      servant.stats[ServantStat.SKILL3_TARGET] - 1
    );

    // count append stages
    addStages(
      servantData.mats.append,
      idx,
      servant.stats[ServantStat.APPEND1_CURRENT] - 1,
      servant.stats[ServantStat.APPEND1_TARGET] - 1
    );
    addStages(
      servantData.mats.append,
      idx,
      servant.stats[ServantStat.APPEND2_CURRENT] - 1,
      servant.stats[ServantStat.APPEND2_TARGET] - 1
    );
    addStages(
      servantData.mats.append,
      idx,
      servant.stats[ServantStat.APPEND3_CURRENT] - 1,
      servant.stats[ServantStat.APPEND3_TARGET] - 1
    );

    if (servantData.mats.ascension) {
      addStages(
        servantData.mats.ascension,
        idx,
        servant.stats[ServantStat.ASCENSION_CURRENT],
        servant.stats[ServantStat.ASCENSION_TARGET]
      );
    }

    // count costumes
    if (servantData.mats.costume && servant.costume) {
      const keys = Object.keys(servant.costume) as IdKey[];
      for (const key of keys) {
        if (servant.costume[key] === false) {
          addStage(servantData.mats.costume[key], idx);
        }
      }
    }

    // count grails
    if (servant.stats[ServantStat.GRAIL_TARGET] > 0) {
      const amount =
        servant.stats[ServantStat.GRAIL_TARGET] -
        servant.stats[ServantStat.GRAIL_CURRENT];
      addAmount(7999, amount, idx);
    }
  }

  res.sort((a, b) => a.material.priority - b.material.priority);

  cache.set(servants, res);
  return res;
}
