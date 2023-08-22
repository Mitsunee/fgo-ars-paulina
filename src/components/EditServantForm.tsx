import { useState } from "preact/hooks";
import type { AccountServant } from "~/client/account";
import { useAccount } from "~/client/account";
import { useServantsData } from "~/client/context";
import type { StatProps } from "~/hooks/useStat";
import { useStats } from "~/hooks/useStat";
import { getSkillIconUrl } from "~/util/urls";
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
}

interface EditServantFormProps extends WithCC<ElementProps<"form">> {
  servant: AccountServant;
}

function StatField({ current, target, icon, title, id }: StatFieldProps) {
  return (
    <fieldset className={styles.field}>
      <legend>{title}</legend>
      <img src={icon} alt="" width={48} height={48} loading="lazy" />
      <input
        {...current}
        name={`${id}-current`}
        title={`Current ${title} Stage`}
      />
      <input {...target} name={`${id}-target`} title={`${title} Target`} />
    </fieldset>
  );
}

function SkillsField({
  skills,
  icons,
  append
}: {
  skills: StatProps[];
  icons: string[];
  append?: boolean;
}) {
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
          />
        );
      })}
    </div>
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
  const user = useAccount()!;
  const [owned, setOwned] = useState(oldServant.owned ?? oldServant.id === 1);
  const { ascension, skills, appends } = useStats(owned, oldServant);
  const servantData = servantsData[oldServant.id];
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
      <fieldset style={{ flexBasis: "100%" }}>
        <legend>DEBUG</legend>
        <span>{JSON.stringify(oldServant)}</span>
      </fieldset>
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
      />
      <SkillsField skills={skills} icons={skillIcons} />
      <SkillsField skills={appends} icons={appendIcons} append />
      <ButtonField>{children}</ButtonField>
    </form>
  );
}
