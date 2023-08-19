import type { ElementProps, WithCC } from "./jsx";
import { cc } from "./jsx";
import styles from "./ButtonField.module.css";

export function ButtonField({
  children,
  className,
  ...props
}: WithCC<ElementProps<"fieldset">>) {
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
}: WithCC<ElementProps<"div">>) {
  return (
    <div {...props} className={cc([styles.field, className])}>
      {children}
    </div>
  );
}
