import type { AccountServant } from "~/client/account";
import { ServantStat } from "~/client/account";
import type { MaterialData } from "~/data/materials";
import type { EnhancementStage, ServantData } from "~/data/servants";

interface MaterialAmount {
  id: number;
  amount: number;
}

export function flattenServantNeeds(
  servant: AccountServant,
  servantData: ServantData,
  materialsData: DataMap<MaterialData>
) {
  const stages = new Array<EnhancementStage>();

  function addStages(
    from: EnhancementStage[],
    current: number,
    target: number
  ) {
    for (let i = current; i < target; i++) {
      stages.push(from[i]);
    }
  }

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
    const keys = Object.keys(servant.costume) as `${number}`[];
    for (const key of keys) {
      if (servant.costume[key] === false) {
        stages.push(servantData.mats.costume[key]);
      }
    }
  }

  // reduce stages
  const map = new Map<number, { id: number; amount: number }>();
  const res = stages.reduce(
    (total, stage) => {
      for (const [id, amount] of stage.items) {
        const mat = map.get(id);
        if (!mat) {
          const newMat: MaterialAmount = { id, amount };
          map.set(id, newMat);
          total.mats.push(newMat);
          continue;
        }
        mat.amount += amount;
        // no map set needed I think?
      }
      total.qp += stage.qp;
      return total;
    },
    { qp: 0, mats: new Array<MaterialAmount>() }
  );

  // sort
  res.mats.sort((a, b) => {
    const itemA = materialsData[a.id];
    const itemB = materialsData[b.id];

    return itemA.priority - itemB.priority;
  });

  return res;
}
