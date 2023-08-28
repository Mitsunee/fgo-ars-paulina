import { useState } from "preact/hooks";
import type { AccountServant } from "~/client/account";
import { useAccount } from "~/client/account";
import { useServantsData } from "~/client/context";
import { ButtonField } from "~/components/ButtonField";
import { InputRadioControlled } from "~/components/InputRadio";
import type { ElementProps, WithCC } from "~/components/jsx";
import { cc } from "~/components/jsx";
import { appendIcons } from "~/data/appendIcons";
import { useCostumes } from "~/hooks/useCostumes";
import { useStats } from "~/hooks/useStat";
import { CostumesField } from "./CostumesField";
import { IconsField } from "./IconsField";
import { SkillsField } from "./SkillsField";
import { StatField } from "./StatField";
import styles from "./styles";

interface EditServantFormProps extends WithCC<ElementProps<"form">> {
  servant: AccountServant;
}

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
      <IconsField
        selected={selectedIcon}
        icons={servantData.icons}
        ascension={owned ? currentAsc : 0}
        costumeIds={costumeIds}
        costumesData={servantData.costumes!}
        costumes={costumes}
        set={setSelectedIcon}
      />
      <ButtonField>{children}</ButtonField>
    </form>
  );
}
