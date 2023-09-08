import { useMemo } from "preact/hooks";
import { getAccountServantIcon, useAccount } from "~/client/account";
import { useMaterialList, useServantsData } from "~/client/context";
import { returnHome } from "~/client/router";
import { BorderedIcon } from "~/components/BorderedIcon";
import { ButtonRow } from "~/components/ButtonField";
import { flattenMaterialUsage } from "~/util/flattenMaterialUsage";
import styles from "./InventoryView.module.css";

export function InventoryView() {
  const user = useAccount()!; // TODO: error handling
  const materialsData = useMaterialList();
  const servantsData = useServantsData();

  const usages = flattenMaterialUsage(
    user.servants,
    servantsData,
    materialsData
  );

  const materials = useMemo(
    () =>
      Object.values(materialsData)
        .sort((a, b) => a.priority - b.priority)
        .map(mat => ({
          mat,
          usage: usages.find(need => need.material.id == mat.id)
        })),
    [materialsData, usages]
  );

  return (
    <>
      <section className="section">
        <h1>Inventory</h1>
        <form className={styles.wrapper} onSubmit={ev => ev.preventDefault()}>
          <section className={`${styles.grid} ${styles.titles}`}>
            <span style={{ gridArea: "title" }}>Item</span>
            <span style={{ gridArea: "owned" }}>Owned</span>
            <span style={{ gridArea: "needed" }}>Needed</span>
            <span style={{ gridArea: "delta" }}>Delta</span>
            <span style={{ gridArea: "extra" }}>Needed by</span>
          </section>

          {materials.map(({ mat, usage }) => {
            const owned = user.materials[mat.id] ?? 0;
            const needed = usage?.total ?? 0;
            const delta = Math.max(0, needed - owned);

            return (
              <section key={mat.id} className={styles.grid}>
                <span className={styles.title}>{mat.name}</span>
                <img
                  src={mat.icon}
                  alt=""
                  title={mat.name}
                  width={64}
                  height={64}
                  loading="lazy"
                  className={styles.icon}
                />

                <fieldset style={{ gridArea: "owned" }}>
                  <legend>Owned</legend>
                  <input type="number" min="0" value={owned} />
                </fieldset>
                <fieldset style={{ gridArea: "needed" }}>
                  <legend>Needed</legend>
                  <output value={needed} />
                </fieldset>
                <fieldset style={{ gridArea: "delta" }}>
                  <legend>Delta</legend>
                  <output value={delta} />
                </fieldset>

                {usage && (
                  <ul className={styles.extra}>
                    {Object.entries(usage.byServant).map(([idx, amount]) => {
                      const servant = user.servants[+idx];
                      const servantData = servantsData[servant.id];
                      return (
                        <li key={idx}>
                          <BorderedIcon
                            src={getAccountServantIcon(
                              servant,
                              servantData.icons
                            )}
                            border={servantData.rarity}
                            title={servantData.name}>
                            x{amount}
                          </BorderedIcon>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </form>
        <ButtonRow>
          <button type="button" onClick={() => returnHome()}>
            Back
          </button>
        </ButtonRow>
      </section>
    </>
  );
}
