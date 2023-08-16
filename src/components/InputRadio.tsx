import type { WithCC } from "./classcat";
import { cc } from "./classcat";
import styles from "./InputRadio.module.css";

interface InputRadioProps extends WithCC<React.ComponentProps<"label">> {
  name: string;
  value: string;
  defaultChecked?: boolean;
}

export function InputRadio({
  children,
  className,
  name,
  value,
  defaultChecked,
  ...props
}: InputRadioProps) {
  const id = `${name}-${value}`;

  return (
    <>
      <input
        type="radio"
        name={name}
        defaultValue={value}
        id={id}
        className={styles.input}
        defaultChecked={defaultChecked}
      />
      <label
        {...props}
        className={cc([styles.label, className, "button"])}
        htmlFor={id}>
        {children}
      </label>
    </>
  );
}
