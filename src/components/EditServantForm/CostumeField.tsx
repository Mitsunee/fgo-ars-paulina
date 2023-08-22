import { InputRadioControlled } from "~/components/InputRadio";
import { cc } from "~/components/jsx";
import type { CostumeDispatch, CostumeState } from "~/hooks/useCostumes";
import { getServantIconUrl } from "~/util/urls";
import styles from "./styles";

interface CostumeFieldProps {
  name: string;
  icon: string;
  state: CostumeState;
  set: CostumeDispatch;
  owned: boolean;
}

export function CostumeField({
  name,
  icon,
  state,
  set,
  owned
}: CostumeFieldProps) {
  const inputName = `costume-${state.id}`;
  const handleClick = (value: null | boolean) => set({ id: state.id, value });
  return (
    <fieldset className={cc([styles.field, styles.radio])}>
      <legend>{name}</legend>
      <img
        src={getServantIconUrl(icon, true)}
        alt={name}
        width={48}
        height={48}
        loading="lazy"
      />
      <InputRadioControlled
        name={inputName}
        value="skipped"
        checked={state.state === null || !owned}
        onClick={() => handleClick(null)}
        readOnly={!owned}>
        Skipped
      </InputRadioControlled>
      {owned && (
        <>
          <InputRadioControlled
            name={inputName}
            value="planned"
            checked={state.state === false}
            onClick={() => handleClick(false)}>
            Planned
          </InputRadioControlled>
          <InputRadioControlled
            name={inputName}
            value="done"
            checked={state.state == true}
            onClick={() => handleClick(true)}>
            Done
          </InputRadioControlled>
        </>
      )}
    </fieldset>
  );
}
