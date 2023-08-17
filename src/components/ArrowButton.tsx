import type { WithCC } from "./classcat";
import { cc } from "./classcat";
import styles from "./ArrowButton.module.css";

interface ArrowProps {
  side: "left" | "right";
  active: boolean;
}

interface ArrowButtonProps extends WithCC<React.ComponentProps<"button">> {
  state: boolean;
  set: (v: boolean) => void;
  children: string;
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
      className={styles.arrow}
      style={{ "--rot": rot } as React.CSSProperties}>
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
      <span>{children}</span>
      {side == "right" && <Arrow active={state} side="right" />}
    </button>
  );
}