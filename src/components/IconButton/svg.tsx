import type { ElementProps, WithCC } from "../jsx";
import { cc } from "../jsx";

export function SVG({
  children,
  className,
  ...props
}: WithCC<ElementProps<"svg">>) {
  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cc(["svg", className])}>
      {children}
    </svg>
  );
}
