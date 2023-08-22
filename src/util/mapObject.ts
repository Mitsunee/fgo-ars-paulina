export function mapObject<T extends object, V>(
  obj: T,
  each: (value: T[KeyOf<T>], key: KeyOf<T>, self: T) => V,
  filter?: (value: T[KeyOf<T>], key: KeyOf<T>, self: T) => boolean
) {
  let keys = Object.keys(obj) as KeyOf<T>[];
  if (filter) keys = keys.filter(key => filter(obj[key], key, obj));
  return Object.fromEntries(
    keys.map(key => [key, each(obj[key], key, obj)])
  ) as Record<KeyOf<T>, V>;
}
