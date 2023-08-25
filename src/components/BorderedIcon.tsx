import type { ElementProps, WithCC } from "./jsx";
import { cc } from "./jsx";
import styles from "./BorderedIcon.module.css";

type BorderColor = Rarity | "blue";

interface BorderedIconProps extends WithCC<ElementProps<"figure">> {
  border: number | BorderColor;
  title: string;
  src: string;
}

function borderToColor(border: BorderedIconProps["border"]): BorderColor {
  switch (border) {
    case "black":
    case 0:
      return "black";
    case "bronze":
    case 1:
    case 2:
      return "bronze";
    case "silver":
    case 3:
      return "silver";
    case "blue":
      return "blue";
    case "gold":
    case 4:
    case 5:
    default:
      return "gold";
  }
}

export function BorderedIcon({
  children,
  className,
  border,
  title,
  src,
  ...props
}: BorderedIconProps) {
  const borderColor = borderToColor(border);

  return (
    <figure
      {...props}
      className={cc([styles.icon, styles[borderColor], className])}>
      <img
        src={src}
        alt={title}
        title={title}
        width={48}
        height={48}
        loading="lazy"
      />
      {children && <figcaption>{children}</figcaption>}
    </figure>
  );
}
