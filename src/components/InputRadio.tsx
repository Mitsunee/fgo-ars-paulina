import type { ElementProps, WithCC } from "./jsx";
import { cc } from "./jsx";

interface InputRadioProps extends WithCC<ElementProps<"label">> {
  name: string;
  value: string;
}

type ControlledChangeHandler = NonNullable<
  ElementProps<"input">["onChange"] & ElementProps<"label">["onClick"]
>;

interface InputRadioControlledProps extends Omit<InputRadioProps, "onChange"> {
  onClick: ControlledChangeHandler;
  checked: boolean;
}

export function InputRadioControlled({
  children,
  className,
  name,
  value,
  checked,
  ...props
}: InputRadioControlledProps) {
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
        className="button"
      />
      <label {...props} className={cc([className])} htmlFor={id}>
        {children}
      </label>
    </>
  );
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
        value={value}
        id={id}
        defaultChecked={defaultChecked}
        className={"button"}
      />
      <label {...props} className={cc([className])} htmlFor={id}>
        {children}
      </label>
    </>
  );
}
