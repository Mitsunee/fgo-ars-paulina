import type { Class } from "classcat";
import cc from "classcat";
import type { ComponentChildren, ComponentProps } from "preact";
import type { JSX } from "preact/jsx-runtime";

type HTMLTag = keyof JSX.IntrinsicElements;
export { cc };
export type CC = { className?: Class };
export type WithCC<T> = Omit<T, "className"> & CC;
export type ElementProps<T extends HTMLTag> = ComponentProps<T>;
export type ElementRef<T extends HTMLTag> =
  JSX.IntrinsicElements[T] extends JSX.HTMLAttributes<infer R> ? R : never;
export type WithChildren = { children?: ComponentChildren };
export type CSSProperties = JSX.CSSProperties;
