import type { WithCC } from "./classcat";
import { cc } from "./classcat";

interface InputRadioProps extends WithCC<React.ComponentProps<"label">> {
  name: string;
  value: string;
}

interface InputRadioControlledProps extends Omit<InputRadioProps, "onChange"> {
  onClick: () => void;
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
