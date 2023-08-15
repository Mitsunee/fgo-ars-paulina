import type { Class } from "classcat";
import cc from "classcat";

export { cc };
export type CC = { className?: Class };
export type WithCC<T> = Omit<T, "className"> & CC;
