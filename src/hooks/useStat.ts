import { clamp } from "@foxkit/util/clamp";
import { useState } from "preact/hooks";
import type { AccountServant } from "~/client/account";
import { ServantStat } from "~/client/account";
import type { ElementProps } from "~/components/jsx";
import { getGrailConstantByRarity } from "~/data/grailConstant";
import type { ServantData } from "~/data/servants";

export interface StatProps {
  current: ElementProps<"input">;
  target: ElementProps<"input">;
  stat: [number, number];
}

type InputChangeEvent = NonNullable<ElementProps<"input">["onChange"]>;

export function useStat(min: number, max: number, initial: [number, number]) {
  const [stat, setStat] = useState(initial);

  const setCurrent: InputChangeEvent = ev => {
    let target = stat[1];
    const value = isNaN(ev.currentTarget.valueAsNumber)
      ? min
      : Math.trunc(ev.currentTarget.valueAsNumber);
    const current = clamp({ min, max, value });
    if (current > target) target = current;
    setStat([current, target]);
  };

  const setTarget: InputChangeEvent = ev => {
    let current = stat[0];
    const value = isNaN(ev.currentTarget.valueAsNumber)
      ? max
      : Math.trunc(ev.currentTarget.valueAsNumber);
    const target = clamp({ min, max, value });
    if (target < current) current = target;
    setStat([current, target]);
  };

  const props: StatProps = {
    current: { type: "number", value: stat[0], min, max, onChange: setCurrent },
    target: { type: "number", value: stat[1], min, max, onChange: setTarget },
    stat
  };

  return props;
}

export function useStats(oldServant: AccountServant) {
  const ascension = useStat(0, 4, [
    oldServant.stats[ServantStat.ASCENSION_CURRENT],
    oldServant.stats[ServantStat.ASCENSION_TARGET]
  ]);
  const skills = [
    useStat(1, 10, [
      oldServant.stats[ServantStat.SKILL1_CURRENT],
      oldServant.stats[ServantStat.SKILL1_TARGET]
    ]),
    useStat(1, 10, [
      oldServant.stats[ServantStat.SKILL2_CURRENT],
      oldServant.stats[ServantStat.SKILL2_TARGET]
    ]),
    useStat(1, 10, [
      oldServant.stats[ServantStat.SKILL3_CURRENT],
      oldServant.stats[ServantStat.SKILL3_TARGET]
    ])
  ];
  const appends = [
    useStat(0, 10, [
      oldServant.stats[ServantStat.APPEND1_CURRENT],
      oldServant.stats[ServantStat.APPEND1_TARGET]
    ]),
    useStat(0, 10, [
      oldServant.stats[ServantStat.APPEND2_CURRENT],
      oldServant.stats[ServantStat.APPEND2_TARGET]
    ]),
    useStat(0, 10, [
      oldServant.stats[ServantStat.APPEND3_CURRENT],
      oldServant.stats[ServantStat.APPEND3_TARGET]
    ])
  ];

  return { ascension, skills, appends };
}

export function useGrails(
  oldServant: AccountServant,
  servantData: ServantData
) {
  const grailsData = getGrailConstantByRarity(servantData.rarity);
  const max = servantData.id == 1 ? 0 : grailsData.stages.length;
  const grails = useStat(0, max, [
    oldServant.stats[ServantStat.GRAIL_CURRENT],
    oldServant.stats[ServantStat.GRAIL_TARGET]
  ]);

  const currentCap =
    grailsData.cap +
    (grails.stat[0] > 0 ? grailsData.stages[grails.stat[0] - 1].add : 0);
  const targetCap =
    grailsData.cap +
    (grails.stat[1] > 0 ? grailsData.stages[grails.stat[1] - 1].add : 0);

  return { grails, cap: [currentCap, targetCap] as const };
}
