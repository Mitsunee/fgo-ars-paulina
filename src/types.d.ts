type IdKey = `${number}` | number;
type DataMap<T> = Record<IdKey, T>;
type PartialDataMap<T> = Partial<DataMap<T>>;
type Tuple<T, L extends number> = T[] & { 0: T; length: L };

type Rarity = "black" | "bronze" | "silver" | "gold";
