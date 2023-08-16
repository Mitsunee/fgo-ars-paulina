import type { WithCC } from "./classcat";
import { cc } from "./classcat";
import styles from "./ButtonField.module.css";

export function ButtonField({
  children,
  className,
  ...props
}: WithCC<React.ComponentProps<"fieldset">>) {
  return (
    <fieldset {...props} className={cc([styles.field, className])}>
      {children}
    </fieldset>
  );
}

export function ButtonRow({
  children,
  className,
  ...props
}: WithCC<React.ComponentProps<"div">>) {
  return (
    <div {...props} className={cc([styles.field, className])}>
      {children}
    </div>
  );
}
