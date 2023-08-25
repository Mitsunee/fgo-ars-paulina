import { clamp } from "@foxkit/util/clamp";
import type { AccountServant } from "~/client/account";
import type { ServantData } from "~/data/servants";
import type { ElementRef } from "../jsx";

/**
 * Gets player servant data from edit form
 * @param servantData Game data object of servant
 * @param form reference to the form
 * @returns new AccountServant
 */
export function getEditedServant(
  servantData: ServantData,
  { elements }: ElementRef<"form">
) {
  const servant: AccountServant = {
    id: servantData.id,
    stats: [0, 4, 1, 10, 1, 10, 1, 10, 1, 1, 1, 1, 1, 1]
  };
  let temp: null | RadioNodeList | HTMLInputElement;

  // determine whether the servant is owned
  temp = elements.namedItem("owned") as RadioNodeList;
  const owned = temp.value == "true";

  /**
   * Gets the current value of a StatField
   * @param name
   * @returns Tuple containing current and target stats clamped and truncated
   */
  function getStatsFields(name: string) {
    const targetEl = elements.namedItem(`${name}-target`) as HTMLInputElement;
    const target = clamp({
      value: targetEl.valueAsNumber,
      min: +targetEl.min,
      max: +targetEl.max
    });

    const currentEl = elements.namedItem(`${name}-current`) as HTMLInputElement;
    const current = owned
      ? clamp({
          value: currentEl.valueAsNumber,
          min: +currentEl.min,
          max: target
        })
      : +currentEl.min;

    return [Math.trunc(current), Math.trunc(target)] as const;
  }

  // get ascension and skill stats
  const ascension = getStatsFields("ascension");
  const skills = [
    getStatsFields("skill-0"),
    getStatsFields("skill-1"),
    getStatsFields("skill-2")
  ];
  const appends = [
    getStatsFields("append-0"),
    getStatsFields("append-1"),
    getStatsFields("append-2")
  ];

  // get selected icon
  temp = elements.namedItem("selected-icon") as RadioNodeList;
  const icon = temp.value == "auto" ? undefined : temp.value;

  // get costume status
  let hasCostumes = false;
  const costumes: NonNullable<AccountServant["costume"]> = {};
  if (servantData.costumes) {
    const costumeIds = Object.keys(servantData.costumes);
    for (const costumeId of costumeIds) {
      temp = elements.namedItem(`costume-${costumeId}`) as RadioNodeList | null;
      switch (temp?.value) {
        case "planned":
          costumes[+costumeId] = false;
          hasCostumes = true;
          break;
        case "done":
          costumes[+costumeId] = true;
          hasCostumes = true;
          break;
      }
    }
  }

  // apply stats
  if (owned) servant.owned = true;
  servant.stats = [...ascension, ...skills.flat(), ...appends.flat()] as Tuple<
    number,
    14
  >;
  if (icon !== "auto") servant.icon = icon;
  if (hasCostumes) servant.costume = costumes;

  return servant;
}
