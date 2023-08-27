import type { CSSProperties, ElementProps, WithCC } from "./jsx";
import { cc } from "./jsx";
import styles from "./ArrowButton.module.css";

interface ArrowProps {
  side: "left" | "right";
  active: boolean;
}

interface ArrowButtonProps extends WithCC<ElementProps<"button">> {
  state: boolean;
  set: (v: boolean) => void;
  children?: string;
  side?: "left" | "right";
}

function Arrow({ side, active }: ArrowProps) {
  const rot = `${active ? 180 : side == "left" ? 270 : 90}deg`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={cc(["svg", styles.arrow])}
      style={{ "--rot": rot } as CSSProperties}>
      <path d="M12 3l12 18h-24z" />
    </svg>
  );
}

export function ArrowButton({
  children,
  className,
  state,
  set,
  side = "left",
  ...props
}: ArrowButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={cc([className])}
      onClick={() => set(!state)}>
      {side == "left" && <Arrow active={state} side="left" />}
      {children && <span>{children}</span>}
      {side == "right" && <Arrow active={state} side="right" />}
    </button>
  );
}
