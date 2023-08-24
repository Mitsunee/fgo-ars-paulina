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
  unlockable: boolean;
}

interface CostumesFieldProps
  extends Pick<CostumeFieldProps, "set" | "unlockable"> {
  ids: `${number}`[];
  /**
   * Map of CostumeStates from useCostumes
   */
  costumes: DataMap<CostumeState>;
  /**
   * Map of costume names i.e. servantData.costumes
   */
  data: DataMap<string>;
  /**
   * Map of servant icon urls i.e. servantData.icons
   */
  icons: DataMap<string>;
}

function CostumeField({
  name,
  icon,
  state,
  set,
  unlockable
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
        checked={state.state === null}
        onClick={() => handleClick(null)}>
        Skipped
      </InputRadioControlled>
      <InputRadioControlled
        name={inputName}
        value="planned"
        checked={state.state === false || (!unlockable && state.state == true)}
        onClick={() => handleClick(false)}>
        Planned
      </InputRadioControlled>
      {unlockable && (
        <InputRadioControlled
          name={inputName}
          value="done"
          checked={state.state == true}
          onClick={() => handleClick(true)}>
          Done
        </InputRadioControlled>
      )}
    </fieldset>
  );
}

export function CostumesField({
  ids,
  data,
  icons,
  costumes,
  set,
  unlockable
}: CostumesFieldProps) {
  return (
    <div className={styles.fieldgroup}>
      {ids.map(id => (
        <CostumeField
          key={id}
          name={data[id]}
          icon={icons[id]}
          state={costumes[id]}
          set={set}
          unlockable={unlockable}
        />
      ))}
    </div>
  );
}
