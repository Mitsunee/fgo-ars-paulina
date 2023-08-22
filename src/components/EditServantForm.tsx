import { useState } from "preact/hooks";
import type { AccountServant } from "~/client/account";
import { useAccount } from "~/client/account";
import { useServantsData } from "~/client/context";
import type { CostumeDispatch, CostumeState } from "~/hooks/useCostumes";
import { useCostumes } from "~/hooks/useCostumes";
import type { StatProps } from "~/hooks/useStat";
import { useStats } from "~/hooks/useStat";
import { getServantIconUrl, getSkillIconUrl } from "~/util/urls";
import { ButtonField } from "./ButtonField";
import { InputRadioControlled } from "./InputRadio";
import type { ElementProps, WithCC } from "./jsx";
import { cc } from "./jsx";
import styles from "./EditServantForm.module.css";

interface StatFieldProps {
  current: ElementProps<"input">;
  target: ElementProps<"input">;
  icon: string;
  title: string;
  id: string;
  owned: boolean;
}

interface EditServantFormProps extends WithCC<ElementProps<"form">> {
  servant: AccountServant;
}

function StatField({
  current,
  target,
  icon,
  title,
  id,
  owned
}: StatFieldProps) {
  return (
    <fieldset className={styles.field}>
      <legend>{title}</legend>
      <img src={icon} alt="" width={48} height={48} loading="lazy" />
      <input
        {...current}
        value={owned ? current.value : current.min}
        readOnly={!owned}
        name={`${id}-current`}
        title={`Current ${title} Stage`}
      />
      <input {...target} name={`${id}-target`} title={`${title} Target`} />
    </fieldset>
  );
}

interface SkillsFieldProps {
  skills: StatProps[];
  icons: string[];
  append?: boolean;
  owned: boolean;
}

function SkillsField({ skills, icons, append, owned }: SkillsFieldProps) {
  return (
    <div className={styles.fieldgroup}>
      {skills.map((skill, idx) => {
        const icon = getSkillIconUrl(icons[idx]);
        const num = idx + 1;
        return (
          <StatField
            key={idx}
            current={skill.current}
            target={skill.target}
            icon={icon}
            title={`${append ? "Append " : ""}Skill ${num}`}
            id={`${append ? "append" : "skill"}-${idx}`}
            owned={owned}
          />
        );
      })}
    </div>
  );
}

interface CostumeFieldProps {
  name: string;
  icon: string;
  state: CostumeState;
  set: CostumeDispatch;
  owned: boolean;
}

function CostumeField({ name, icon, state, set, owned }: CostumeFieldProps) {
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
  const [costumeIds, costumes, setCostume] = useCostumes(
    costumesData,
    oldServant.costume
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
            checked={!owned}>
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
      <SkillsField skills={skills} icons={skillIcons} owned={owned} />
      <SkillsField skills={appends} icons={appendIcons} owned={owned} append />
      {costumes && costumesData && (
        <>
          <h2>Costumes</h2>
          {costumeIds.map(id => (
            <CostumeField
              key={id}
              name={costumesData[id]}
              icon={servantData.icons[id]}
              state={costumes[id]}
              set={setCostume}
              owned={owned}
            />
          ))}
        </>
      )}
      <ButtonField>{children}</ButtonField>
    </form>
  );
}
