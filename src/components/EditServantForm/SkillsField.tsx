import type { StatProps } from "~/hooks/useStat";
import { getSkillIconUrl } from "~/util/urls";
import { StatField } from "./StatField";

interface SkillsFieldProps {
  skills: StatProps[];
  icons: string[];
  append?: boolean;
  owned: boolean;
}

export function SkillsField({
  skills,
  icons,
  append,
  owned
}: SkillsFieldProps) {
  return (
    <>
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
    </>
  );
}
