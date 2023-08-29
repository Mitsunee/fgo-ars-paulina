import type { ElementProps, WithCC } from "../jsx";
import { cc } from "../jsx";
import { IconDelete } from "./IconDelete";
import { IconEdit } from "./IconEdit";
import { IconLeft } from "./IconLeft";
import { IconLess } from "./IconLess";
import { IconMore } from "./IconMore";
import { IconRight } from "./IconRight";
import styles from "./IconButton.module.css";

const icons = {
  delete: IconDelete,
  edit: IconEdit,
  left: IconLeft,
  less: IconLess,
  more: IconMore,
  right: IconRight
} as const;

interface IconButtonProps extends WithCC<ElementProps<"button">> {
  icon: Extract<keyof typeof icons, string>;
  side?: "left" | "right";
  onClick: NonNullable<ElementProps<"button">["onClick"]>;
}

export function IconButton({
  children,
  icon,
  side = "left",
  className,
  ...props
}: IconButtonProps) {
  const IconComponent = icons[icon];

  return (
    <button
      type="button"
      {...props}
      className={cc([styles.button, !children && styles.round, className])}>
      {side == "left" && <IconComponent />}
      {children && <span>{children}</span>}
      {side == "right" && <IconComponent />}
    </button>
  );
}
