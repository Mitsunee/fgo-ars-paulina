import { useState } from "preact/hooks";
import { useAccount } from "~/client/account";
import { changeRoute } from "~/client/router";
import { ButtonRow } from "~/components/ButtonField";
import { MaterialOverview } from "./MaterialOverview";
import { ServantCard } from "./ServantCard";
import styles from "./ServantList.module.css";

export function ServantListView() {
  const user = useAccount();
  const [selected, setSelected] = useState<number | undefined>();

  if (!user) return null; // TODO: error handling

  return (
    <>
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
            onClick={() => changeRoute({ path: "add-servant" })}>
            Add Servant
          </button>
          <button onClick={() => changeRoute({ path: "inventory" })}>
            Inventory
          </button>
        </ButtonRow>
      </section>
      <MaterialOverview setServant={setSelected} />
    </>
  );
}
