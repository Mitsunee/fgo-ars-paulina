import grailConstant from "./grailConstant.json";

export function getGrailConstantByRarity(rarity: number) {
  return grailConstant[rarity];
}
