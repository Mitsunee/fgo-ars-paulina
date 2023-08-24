import type { ElementProps, WithCC } from "./jsx";
import { cc } from "./jsx";
import styles from "./InputRadioIcon.module.css";

type ControlledChangeHandler = NonNullable<
  ElementProps<"input">["onChange"] & ElementProps<"label">["onClick"]
>;

interface InputRadioIconProps extends WithCC<ElementProps<"label">> {
  name: string;
  value: string;
  /**
   * used as alt for img
   */
  title: string;
  /**
   * Image source
   */
  src: string;
  onClick: ControlledChangeHandler;
  checked: boolean;
  children?: undefined;
}

export function InputRadioIcon({
  className,
  name,
  value,
  title,
  src,
  checked,
  ...props
}: InputRadioIconProps) {
  const id = `${name}-${value}`;

  return (
    <>
      <input
        type="radio"
        name={name}
        value={value}
        id={id}
        onChange={props.onClick}
        checked={checked}
        className={styles.input}
      />
      <label {...props} className={cc([className])} htmlFor={id}>
        <img
          src={src}
          alt={title}
          title={title}
          width={142}
          height={155}
          loading="lazy"
        />
      </label>
    </>
  );
}
