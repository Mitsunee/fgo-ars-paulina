import type { ElementProps } from "~/components/jsx";
import styles from "./EditServantForm.module.css";

interface StatFieldProps {
  current: ElementProps<"input">;
  target: ElementProps<"input">;
  icon: string;
  title: string;
  id: string;
  owned: boolean;
}

export function StatField({
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
