import { basename } from "path";
import ClassName from "@atlasacademy/api-connector/dist/Enum/ClassName.js";
import type {
  EntityAssets,
  EntityLevelUpMaterials
} from "@atlasacademy/api-connector/dist/Schema/Entity";
import type { ItemAmount } from "@atlasacademy/api-connector/dist/Schema/Item";
import { ItemType } from "@atlasacademy/api-connector/dist/Schema/Item";
import type { ServantWithLore } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { ServantClass } from "~/data/ServantClass";
import type {
  EnhancementStage,
  ServantData,
  ServantMaterials
} from "~/data/servants";
import { mapObject } from "~/util/mapObject";

function mapServantClass(className: ClassName) {
  switch (className) {
    case ClassName.SABER:
      return ServantClass.SABER;
    case ClassName.ARCHER:
      return ServantClass.ARCHER;
    case ClassName.LANCER:
      return ServantClass.LANCER;
    case ClassName.RIDER:
      return ServantClass.RIDER;
    case ClassName.CASTER:
      return ServantClass.CASTER;
    case ClassName.ASSASSIN:
      return ServantClass.ASSASSIN;
    case ClassName.BERSERKER:
      return ServantClass.BERSERKER;
    default:
      return ServantClass.EXTRA;
  }
}

function mapServantIcons(assets: EntityAssets) {
  const icons: ServantData["icons"] = {};

  if (assets.faces.ascension) {
    Object.entries(assets.faces.ascension).forEach(
      ([key, url]) => (icons[key as `${number}`] = basename(url))
    );
  }

  if (assets.faces.costume) {
    Object.entries(assets.faces.costume).forEach(
      ([key, url]) => (icons[key as `${number}`] = basename(url))
    );
  }

  return icons;
}

function getSkillIcons(skills: ServantWithLore["skills"]) {
  function getSkillIconByNum(num: number) {
    const [skill] = skills
      .filter(skill => skill.num == num)
      .sort((a, b) => b.id - a.id);
    return skill?.icon ? basename(skill.icon) : "/assets/icon_unknown.png";
  }

  const skillIcons: ServantData["skills"] = [
    getSkillIconByNum(1),
    getSkillIconByNum(2),
    getSkillIconByNum(3)
  ];

  return skillIcons;
}

function flattenItemAmounts(amounts: ItemAmount[]) {
  return amounts
    .filter(({ item }) => item.type !== ItemType.EVENT_ITEM)
    .map(({ amount, item }) => [item.id, amount] as Tuple<number, 2>);
}

function flattenEnhancementStage(stage: EntityLevelUpMaterials) {
  const flat: EnhancementStage = {
    items: flattenItemAmounts(stage.items),
    qp: stage.qp
  };

  return flat;
}

function getServantMats(servant: ServantWithLore) {
  const mats: ServantMaterials = {
    skill: Object.values(servant.skillMaterials).map(stage =>
      flattenEnhancementStage(stage)
    ),
    append: Object.values(servant.appendSkillMaterials).map(stage =>
      flattenEnhancementStage(stage)
    )
  };

  // skip mash
  if (servant.id !== 800100) {
    mats.ascension = Object.values(servant.ascensionMaterials).map(stage =>
      flattenEnhancementStage(stage)
    );
  }

  if (Object.values(servant.costumeMaterials).length > 0) {
    mats.costume = mapObject(servant.costumeMaterials, flattenEnhancementStage);
  }

  return mats;
}

function mapServantCostumes(
  profile: ServantWithLore["profile"],
  profileNA?: ServantWithLore["profile"]
) {
  return mapObject(
    profile.costume,
    (costume, key) => profileNA?.costume[key]?.name || costume.name
  );
}

export function apiServantToServantData(
  servant: ServantWithLore,
  servantNA?: ServantWithLore,
  name?: string
): ServantData {
  const skills = getSkillIcons(servant.skills);
  const servantData: ServantData = {
    id: servant.collectionNo,
    name: name || servantNA?.name || servant.name,
    rarity: servant.rarity,
    className: mapServantClass(servant.className),
    icons: mapServantIcons(servant.extraAssets),
    mats: getServantMats(servant),
    skills
  };

  if (servantNA) {
    servantData.na = true;
    const skillsNA = getSkillIcons(servantNA.skills);
    // only include NA skills if different
    if (skills.toString() != skillsNA.toString()) {
      servantData.skillsNA = getSkillIcons(servantNA.skills);
    }
  }

  if (Object.values(servant.profile.costume).length > 0) {
    servantData.costumes = mapServantCostumes(
      servant.profile,
      servantNA?.profile
    );
  }

  return servantData;
}
