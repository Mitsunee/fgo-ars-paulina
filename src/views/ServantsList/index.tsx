import { useState } from "preact/hooks";
import { useAccount } from "~/client/account";
//import { useServantsData } from "~/client/context";
import { changeRoute, Routes } from "~/client/router";
import { ButtonRow } from "~/components/ButtonField";
import { ServantCard } from "./ServantCard";
import styles from "./ServantList.module.css";

export function ServantListView() {
  const user = useAccount();
  const [selected, setSelected] = useState<number | undefined>();

  if (!user) return null;

  return (
    <section className="section">
      <h1>Servants</h1>
      <ul className={styles.list}>
        {user.servants.map((servant, idx) => (
          <ServantCard
            key={`${servant.id}-${idx}`}
            servant={servant}
            idx={idx}
            expanded={selected == idx}
            set={setSelected}
          />
        ))}
      </ul>
      <ButtonRow>
        <button
          className="primary"
          onClick={() => changeRoute(Routes.SERVANTS_ADD)}>
          Add Servant
        </button>
        <button>Sample Text</button>
      </ButtonRow>
    </section>
  );
}
