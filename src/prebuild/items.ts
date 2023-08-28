import type { EntityLevelUpMaterials } from "@atlasacademy/api-connector/dist/Schema/Entity";
import { EntityType } from "@atlasacademy/api-connector/dist/Schema/Entity";
import type { Item } from "@atlasacademy/api-connector/dist/Schema/Item";
import {
  ItemBackgroundType,
  ItemType
} from "@atlasacademy/api-connector/dist/Schema/Item";
import type { ServantWithLore } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { MaterialData } from "~/data/materials";

function parseMaterialRarity(item: Item): Rarity {
  switch (item.background) {
    case ItemBackgroundType.BRONZE:
      return "bronze";
    case ItemBackgroundType.SILVER:
      return "silver";
    case ItemBackgroundType.GOLD:
      return "gold";
    default:
      return "black";
  }
}

export function apiItemToMaterial(item: Item, na?: true) {
  const material: MaterialData = {
    id: item.id,
    name: item.name,
    icon: item.icon,
    priority: item.priority,
    rarity: parseMaterialRarity(item)
  };

  if (na) material.na = true;

  return material;
}

export function getItemsFromNiceServant(servantList: ServantWithLore[]) {
  const known = new Set<number>();
  const items = new Array<Item>();

  function getItems(it: EntityLevelUpMaterials) {
    it.items.forEach(({ item }) => {
      if (item.type == ItemType.EVENT_ITEM) return;
      if (known.has(item.id)) return;
      items.push(item);
      known.add(item.id);
    });
  }

  servantList.forEach(servant => {
    if (servant.type !== EntityType.NORMAL && servant.id !== 800100) return;
    Object.values(servant.ascensionMaterials).forEach(getItems);
    Object.values(servant.skillMaterials).forEach(getItems);
    Object.values(servant.appendSkillMaterials).forEach(getItems);
    Object.values(servant.costumeMaterials).forEach(getItems);
  });

  return items;
}
