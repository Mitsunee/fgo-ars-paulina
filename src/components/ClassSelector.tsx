import { ServantClass } from "~/data/ServantClass";
import { cc } from "./classcat";
import styles from "./ClassSelector.module.css";

interface ClassSelectorProps {
  /**
   * Record of `ServantClass` that contains boolean for whether the class is selected
   */
  state: Record<ServantClass, boolean>;
  /**
   * Callback for setting state
   * @param v Class to be toggled
   */
  set: (v: ServantClass) => void;
}

export function ClassSelector({ state, set }: ClassSelectorProps) {
  return (
    <fieldset className={styles.field}>
      <legend>Class</legend>
      <button
        type="button"
        onClick={() => set(ServantClass.SABER)}
        title="Saber"
        className={cc([!state[ServantClass.SABER] && styles.off])}>
        <img src="/assets/classes/saber_g.png" alt="Saber" />
      </button>
      <button
        type="button"
        onClick={() => set(ServantClass.ARCHER)}
        title="Archer"
        className={cc([!state[ServantClass.ARCHER] && styles.off])}>
        <img src="/assets/classes/archer_g.png" alt="Archer" />
      </button>
      <button
        type="button"
        onClick={() => set(ServantClass.LANCER)}
        title="Lancer"
        className={cc([!state[ServantClass.LANCER] && styles.off])}>
        <img src="/assets/classes/lancer_g.png" alt="Lancer" />
      </button>
      <button
        type="button"
        onClick={() => set(ServantClass.RIDER)}
        title="Rider"
        className={cc([!state[ServantClass.RIDER] && styles.off])}>
        <img src="/assets/classes/rider_g.png" alt="Rider" />
      </button>
      <button
        type="button"
        onClick={() => set(ServantClass.CASTER)}
        title="Caster"
        className={cc([!state[ServantClass.CASTER] && styles.off])}>
        <img src="/assets/classes/caster_g.png" alt="Caster" />
      </button>
      <button
        type="button"
        onClick={() => set(ServantClass.ASSASSIN)}
        title="Assassin"
        className={cc([!state[ServantClass.ASSASSIN] && styles.off])}>
        <img src="/assets/classes/assassin_g.png" alt="Assassin" />
      </button>
      <button
        type="button"
        onClick={() => set(ServantClass.BERSERKER)}
        title="Berserker"
        className={cc([!state[ServantClass.BERSERKER] && styles.off])}>
        <img src="/assets/classes/berserker_g.png" alt="Berserker" />
      </button>
      <button
        type="button"
        onClick={() => set(ServantClass.EXTRA)}
        title="Extra"
        className={cc([!state[ServantClass.EXTRA] && styles.off])}>
        <img src="/assets/classes/extra.png" alt="Extra" />
      </button>
    </fieldset>
  );
}
