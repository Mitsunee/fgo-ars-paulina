import { useState } from "preact/hooks";
import type { AccountServant } from "~/client/account";
import { useAccount } from "~/client/account";
import { useServantsData } from "~/client/context";
import { ButtonField } from "~/components/ButtonField";
import { InputRadioControlled } from "~/components/InputRadio";
import { InputRadioIcon } from "~/components/InputRadioIcon";
import type { ElementProps, WithCC } from "~/components/jsx";
import { cc } from "~/components/jsx";
import { useCostumes } from "~/hooks/useCostumes";
import { useStats } from "~/hooks/useStat";
import { getServantIconUrl } from "~/util/urls";
import { CostumesField } from "./CostumesField";
import { SkillsField } from "./SkillsField";
import { StatField } from "./StatField";
import styles from "./styles";
import { validateIconChoice } from "./validateIconChoice";

interface EditServantFormProps extends WithCC<ElementProps<"form">> {
  servant: AccountServant;
}

const appendIcons = ["skill_00301.png", "skill_00601.png", "skill_00300.png"];

export function EditServantForm({
  children,
  className,
  servant: oldServant,
  ...props
}: EditServantFormProps) {
  const servantsData = useServantsData();
  const servantData = servantsData[oldServant.id];
  const costumesData = servantData.costumes; // need to extract this to help typescript's bad short term memory in the JSX lol
  const user = useAccount()!;
  const [owned, setOwned] = useState(oldServant.owned ?? oldServant.id === 1);
  const { ascension, skills, appends } = useStats(oldServant);
  const currentAsc = +(ascension.current.value ?? 0);
  const [costumeIds, costumes, setCostume] = useCostumes(
    costumesData,
    oldServant.costume
  );
  const [selectedIcon, setSelectedIcon] = useState<undefined | string>(
    oldServant.icon
  );
  const activeIcon = validateIconChoice(selectedIcon, currentAsc, costumes);
  const skillIcons =
    user.region == "na"
      ? servantData.skillsNA || servantData.skills
      : servantData.skills;
  const possibleToOwn =
    oldServant.id == 1 || servantData.na || user.region == "jp" || owned;

  return (
    <form
      onSubmit={ev => ev.preventDefault()}
      {...props}
      className={cc([className])}>
      {/* <h2>Debug</h2>
      <fieldset className="wide">
        <legend>Old Servant</legend>
        <span>{JSON.stringify(oldServant)}</span>
      </fieldset> */}
      <fieldset>
        <legend>Owned</legend>
        {possibleToOwn && (
          <InputRadioControlled
            name="owned"
            value="true"
            onClick={() => setOwned(true)}
            checked={owned}>
            Yes
          </InputRadioControlled>
        )}
        {oldServant.id != 1 && (
          <InputRadioControlled
            name="owned"
            value="false"
            onClick={() => setOwned(false)}
            checked={!owned}
            disabled={!possibleToOwn}>
            No
          </InputRadioControlled>
        )}
      </fieldset>
      <StatField
        {...ascension}
        icon="https://static.atlasacademy.io/NA/Items/40.png"
        title="Ascension"
        id="ascension"
        owned={owned}
      />
      {/* TODO: implement priority system here */}
      <h2>Skills</h2>
      <div className={styles.fieldgroup}>
        <SkillsField skills={skills} icons={skillIcons} owned={owned} />
        <SkillsField
          skills={appends}
          icons={appendIcons}
          owned={owned}
          append
        />
      </div>
      {costumes && costumesData && (
        <>
          <h2>Costumes</h2>
          <CostumesField
            ids={costumeIds}
            costumes={costumes}
            data={costumesData}
            icons={servantData.icons}
            set={setCostume}
            unlockable={owned && currentAsc == 4}
          />
        </>
      )}
      <h2>Icon</h2>
      <ButtonField>
        <InputRadioControlled
          name="selected-icon"
          value=""
          checked={activeIcon === undefined}
          onClick={() => setSelectedIcon(undefined)}>
          Match Ascension Stage
        </InputRadioControlled>
      </ButtonField>
      <fieldset className="icon-list">
        <InputRadioIcon
          name="selected-icon"
          value="1"
          checked={activeIcon === "1"}
          src={getServantIconUrl(servantData.icons["1"], true)}
          title="Stage 1"
          onClick={() => setSelectedIcon("1")}
        />
        {currentAsc >= 1 && (
          <InputRadioIcon
            name="selected-icon"
            value="2"
            checked={activeIcon === "2"}
            src={getServantIconUrl(servantData.icons["2"], true)}
            title="Stage 2"
            onClick={() => setSelectedIcon("2")}
          />
        )}
        {currentAsc >= 3 && (
          <InputRadioIcon
            name="selected-icon"
            value="3"
            checked={activeIcon === "3"}
            src={getServantIconUrl(servantData.icons["3"], true)}
            title="Stage 3"
            onClick={() => setSelectedIcon("3")}
          />
        )}
        {currentAsc == 4 && (
          <>
            <InputRadioIcon
              name="selected-icon"
              value="4"
              checked={activeIcon === "4"}
              src={getServantIconUrl(servantData.icons["4"], true)}
              title="Final Ascension"
              onClick={() => setSelectedIcon("4")}
            />
            {costumeIds.map(id => {
              if (!costumes?.[id].state) return null;
              return (
                <InputRadioIcon
                  key={id}
                  name="selected-icon"
                  value={id}
                  checked={activeIcon == id}
                  src={getServantIconUrl(servantData.icons[id], true)}
                  title={servantData.costumes![id]}
                  onClick={() => setSelectedIcon(id)}
                />
              );
            })}
          </>
        )}
      </fieldset>
      <ButtonField>{children}</ButtonField>
    </form>
  );
}
