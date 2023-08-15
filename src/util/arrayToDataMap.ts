export function arrayToDataMap<T extends { id: number }>(arr: T[]) {
  const map: DataMap<T> = {};
  arr.forEach(el => (map[el.id] = el));
  return map;
}
