import type { Dispatch } from "preact/hooks";
import type { CostumeState } from "~/hooks/useCostumes";
import { getServantIconUrl } from "~/util/urls";
import { ButtonField } from "../ButtonField";
import { InputRadioControlled } from "../InputRadio";
import { InputRadioIcon } from "../InputRadioIcon";
import { validateIconChoice } from "./validateIconChoice";

interface IconsFieldProps {
  /**
   * currently selected icon or undefined to match ascension
   */
  selected: string | undefined;
  /**
   * Map of servant icon urls i.e. servantData.icons
   */
  icons: DataMap<string>;
  ascension: number;
  costumeIds: `${number}`[];
  /**
   * Map of costume names i.e. servantData.costumes
   */
  costumesData: DataMap<string>;
  /**
   * Map of CostumeStates from useCostumes
   */
  costumes: DataMap<CostumeState> | undefined;
  set: Dispatch<string | undefined>;
}

export function IconsField({
  selected,
  icons,
  ascension,
  costumeIds,
  costumesData,
  costumes,
  set
}: IconsFieldProps) {
  const active = validateIconChoice(selected, ascension, costumes);

  return (
    <>
      <ButtonField>
        <InputRadioControlled
          name="selected-icon"
          value=""
          checked={active === undefined}
          onClick={() => set(undefined)}>
          Match Ascension Stage
        </InputRadioControlled>
      </ButtonField>
      <fieldset className="icon-list">
        <InputRadioIcon
          name="selected-icon"
          value="1"
          checked={active === "1"}
          src={getServantIconUrl(icons["1"], true)}
          title="Stage 1"
          onClick={() => set("1")}
        />
        {ascension >= 1 && (
          <InputRadioIcon
            name="selected-icon"
            value="2"
            checked={active === "2"}
            src={getServantIconUrl(icons["2"], true)}
            title="Stage 2"
            onClick={() => set("2")}
          />
        )}
        {ascension >= 3 && (
          <InputRadioIcon
            name="selected-icon"
            value="3"
            checked={active === "3"}
            src={getServantIconUrl(icons["3"], true)}
            title="Stage 3"
            onClick={() => set("3")}
          />
        )}
        {ascension == 4 && (
          <>
            <InputRadioIcon
              name="selected-icon"
              value="4"
              checked={active === "4"}
              src={getServantIconUrl(icons["4"], true)}
              title="Final Ascension"
              onClick={() => set("4")}
            />
            {costumeIds.map(id => {
              if (!costumes?.[id].state) return null;
              return (
                <InputRadioIcon
                  key={id}
                  name="selected-icon"
                  value={id}
                  checked={active == id}
                  src={getServantIconUrl(icons[id], true)}
                  title={costumesData[id]}
                  onClick={() => set(id)}
                />
              );
            })}
          </>
        )}
      </fieldset>
    </>
  );
}
