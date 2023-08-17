import { useState } from "react";
import { clamp } from "@foxkit/util/clamp";
import type { AccountServant } from "~/client/account";
import { ServantStat, useAccount } from "~/client/account";
import { useServantsData } from "~/client/context";
import { getSkillIconUrl } from "~/util/urls";
import { ButtonField } from "./ButtonField";
import type { WithCC } from "./classcat";
import { cc } from "./classcat";
import { InputRadio } from "./InputRadio";
import styles from "./EditServantForm.module.css";

interface EditServantFormProps extends WithCC<React.ComponentProps<"form">> {
  servant: AccountServant;
}

interface StatProps {
  current: React.ComponentProps<"input">;
  target: React.ComponentProps<"input">;
}

type InputChangeEvent = NonNullable<React.ComponentProps<"input">["onChange"]>;

function useStat(min: number, max: number, initial: [number, number]) {
  const [stat, setStat] = useState(initial);

  const setCurrent: InputChangeEvent = ev => {
    let target = stat[1];
    const value = ev.currentTarget.valueAsNumber;
    const current = clamp({ min, max, value });
    if (current > target) target = current;
    setStat([current, target]);
  };

  const setTarget: InputChangeEvent = ev => {
    let current = stat[0];
    const value = ev.currentTarget.valueAsNumber;
    const target = clamp({ min, max, value });
    if (target < current) current = target;
    setStat([current, target]);
  };

  const props: StatProps = {
    current: { type: "number", value: stat[0], min, max, onChange: setCurrent },
    target: { type: "number", value: stat[1], min, max, onChange: setTarget }
  };

  return props;
}

interface StatFieldProps {
  current: React.ComponentProps<"input">;
  target: React.ComponentProps<"input">;
  icon: string;
  title: string;
  id: string;
}

function StatField({ current, target, icon, title, id }: StatFieldProps) {
  return (
    <fieldset className={styles.field}>
      <legend>{title}</legend>
      <img src={icon} alt="" width={48} height={48} />
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
  servant,
  ...props
}: EditServantFormProps) {
  const servantsData = useServantsData();
  const user = useAccount()!;
  const [owned, setOwned] = useState(servant.owned ?? servant.id === 1);
  const ascension = useStat(0, 4, [
    servant.stats[ServantStat.ASCENSION_CURRENT],
    servant.stats[ServantStat.ASCENSION_TARGET]
  ]);
  const skills = [
    useStat(1, 10, [
      servant.stats[ServantStat.SKILL1_CURRENT],
      servant.stats[ServantStat.SKILL1_TARGET]
    ]),
    useStat(1, 10, [
      servant.stats[ServantStat.SKILL2_CURRENT],
      servant.stats[ServantStat.SKILL2_TARGET]
    ]),
    useStat(1, 10, [
      servant.stats[ServantStat.SKILL3_CURRENT],
      servant.stats[ServantStat.SKILL3_TARGET]
    ])
  ];
  const appends = [
    useStat(1, 10, [
      servant.stats[ServantStat.APPEND1_CURRENT],
      servant.stats[ServantStat.APPEND1_TARGET]
    ]),
    useStat(1, 10, [
      servant.stats[ServantStat.APPEND2_CURRENT],
      servant.stats[ServantStat.APPEND2_TARGET]
    ]),
    useStat(1, 10, [
      servant.stats[ServantStat.APPEND3_CURRENT],
      servant.stats[ServantStat.APPEND3_TARGET]
    ])
  ];
  const servantData = servantsData[servant.id];
  const skillIcons =
    user.region == "na"
      ? servantData.skillsNA || servantData.skills
      : servantData.skills;

  return (
    <form
      onSubmit={ev => ev.preventDefault()}
      {...props}
      className={cc([className])}>
      <fieldset style={{ flexBasis: "100%" }}>
        <legend>DEBUG</legend>
        <span>{JSON.stringify(servant)}</span>
      </fieldset>
      <fieldset>
        <legend>Owned</legend>
        <InputRadio
          name="owned"
          value="true"
          onClick={() => setOwned(true)}
          defaultChecked={owned}>
          Yes
        </InputRadio>
        {servant.id != 1 && (
          <InputRadio
            name="owned"
            value="false"
            onClick={() => setOwned(false)}
            defaultChecked={!owned}>
            No
          </InputRadio>
        )}
      </fieldset>
      <StatField {...ascension} icon="" title="Ascension" id="ascension" />
      <SkillsField skills={skills} icons={skillIcons} />
      <SkillsField skills={appends} icons={appendIcons} append />
      <ButtonField>{children}</ButtonField>
    </form>
  );
}
