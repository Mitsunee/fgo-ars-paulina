import { basename } from "path";
import type {
  EntityAssets,
  EntityLevelUpMaterials
} from "@atlasacademy/api-connector/dist/Schema/Entity";
import type { ItemAmount } from "@atlasacademy/api-connector/dist/Schema/Item";
import { ItemType } from "@atlasacademy/api-connector/dist/Schema/Item";
import type { ServantWithLore } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type {
  EnhancementStage,
  ServantData,
  ServantMaterials
} from "~/data/servants";

function mapServantIcons(assets: EntityAssets) {
  const icons: ServantData["icons"] = {};
  if (assets.faces.ascension) Object.assign(icons, assets.faces.ascension);
  if (assets.faces.costume) Object.assign(icons, assets.faces.costume);
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
  return amounts.map(
    ({ amount, item }) => [item.id, amount] as Tuple<number, 2>
  );
}

function flattenEnhancementStage(stage: EntityLevelUpMaterials) {
  const flat: EnhancementStage = {
    items: flattenItemAmounts(stage.items),
    qp: stage.qp
  };

  return flat;
}

function getServantMats(servant: ServantWithLore) {
  const constumeEntries = Object.entries(servant.costumeMaterials);
  const mats: ServantMaterials = {
    skill: Object.values(servant.skillMaterials).map(stage =>
      flattenEnhancementStage(stage)
    )
  };

  if (
    // skip mash
    servant.id !== 800100 &&
    // peek check if stage 1 uses an event item, i.e. servant is welfare
    servant.ascensionMaterials["0"]?.items[0].item.type !== ItemType.EVENT_ITEM
  ) {
    mats.ascension = Object.values(servant.ascensionMaterials).map(stage =>
      flattenEnhancementStage(stage)
    );
  }

  if (constumeEntries.length > 0) {
    mats.costume = Object.fromEntries(
      constumeEntries.map(([key, stage]) => [
        key,
        flattenEnhancementStage(stage)
      ])
    );
  }

  return mats;
}

function mapServantCostumes(
  profile: ServantWithLore["profile"],
  profileNA?: ServantWithLore["profile"]
) {
  return Object.fromEntries(
    Object.entries(profile.costume).map(([key, details]) => {
      return [key, profileNA?.costume[key]?.name || details.name];
    })
  );
}

export function apiServantToServantData(
  servant: ServantWithLore,
  servantNA?: ServantWithLore
): ServantData {
  const servantData: ServantData = {
    id: servant.id,
    name: servantNA?.name || servant.name,
    rarity: servant.rarity,
    icons: mapServantIcons(servant.extraAssets),
    skills: getSkillIcons(servant.skills),
    mats: getServantMats(servant)
  };

  if (servantNA) {
    servantData.na = true;
    servantData.skillsNA = getSkillIcons(servantNA.skills);
  }

  if (Object.values(servant.profile.costume).length > 0) {
    servantData.costumes = mapServantCostumes(
      servant.profile,
      servantNA?.profile
    );
  }

  return servantData;
}
