import { Searcher, sortKind } from "fast-fuzzy";
import { useMemo, useState } from "preact/hooks";
import {
  getAccountServantIcon,
  setMaterialAmount,
  useAccount
} from "~/client/account";
import { useMaterialList, useServantsData } from "~/client/context";
import { returnHome } from "~/client/router";
import { ArrowButton } from "~/components/ArrowButton";
import { BorderedIcon } from "~/components/BorderedIcon";
import { ButtonField, ButtonRow } from "~/components/ButtonField";
import { InputRadio } from "~/components/InputRadio";
import { NoAccountError } from "~/components/NoAccountError";
import { flattenMaterialUsage } from "~/util/flattenMaterialUsage";
import { useFilters } from "./filters";
import styles from "./InventoryView.module.css";

export function InventoryView() {
  const user = useAccount();
  const materialsData = useMaterialList();
  const servantsData = useServantsData();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useFilters();

  const usages = useMemo(
    () =>
      user
        ? flattenMaterialUsage(user.servants, servantsData, materialsData)
        : [],
    [materialsData, servantsData, user]
  );

  const [materials, searcher] = useMemo(() => {
    const materials = Object.values(materialsData)
      .sort((a, b) => a.priority - b.priority)
      .map(mat => ({
        mat,
        usage: usages.find(need => need.material.id == mat.id)
      }));
    const searcher = new Searcher(materials, {
      keySelector: candidate => candidate.mat.name,
      sortBy: sortKind.insertOrder,
      threshold: 0.85
    });

    return [materials, searcher] as const;
  }, [materialsData, usages]);

  if (!user) return <NoAccountError />;

  const results = query ? searcher.search(query) : materials;

  return (
    <>
      <section className="section">
        <h1>Inventory</h1>
        <form className={styles.wrapper} onSubmit={ev => ev.preventDefault()}>
          <ButtonField>
            <input
              type="search"
              name="servant-search"
              value={query}
              onInput={ev => setQuery(ev.currentTarget.value)}
              placeholder="Search"
            />
            <ArrowButton
              state={filters.menu}
              side="right"
              set={value => setFilters({ type: "menu", value })}>
              Filters
            </ArrowButton>
          </ButtonField>
          {filters.menu && (
            <div className={styles.fieldgroup}>
              <fieldset>
                <legend>Hide completed</legend>
                <InputRadio
                  name="hide-completed"
                  value="true"
                  onClick={() =>
                    setFilters({ type: "hideCompleted", value: true })
                  }
                  defaultChecked={filters.hideCompleted}>
                  Yes
                </InputRadio>
                <InputRadio
                  name="hide-completed"
                  value="false"
                  onClick={() =>
                    setFilters({ type: "hideCompleted", value: false })
                  }
                  defaultChecked={!filters.hideCompleted}>
                  No
                </InputRadio>
              </fieldset>
              <fieldset>
                <legend>Hide Gems</legend>
                <InputRadio
                  name="hide-gems"
                  value="true"
                  onClick={() => setFilters({ type: "hideGems", value: true })}
                  defaultChecked={filters.hideGems}>
                  Yes
                </InputRadio>
                <InputRadio
                  name="hide-gems"
                  value="false"
                  onClick={() => setFilters({ type: "hideGems", value: false })}
                  defaultChecked={!filters.hideGems}>
                  No
                </InputRadio>
              </fieldset>
              <fieldset>
                <legend>Hide Statues</legend>
                <InputRadio
                  name="hide-statues"
                  value="true"
                  onClick={() =>
                    setFilters({ type: "hideStatues", value: true })
                  }
                  defaultChecked={filters.hideStatues}>
                  Yes
                </InputRadio>
                <InputRadio
                  name="hide-statues"
                  value="false"
                  onClick={() =>
                    setFilters({ type: "hideStatues", value: false })
                  }
                  defaultChecked={!filters.hideStatues}>
                  No
                </InputRadio>
              </fieldset>
            </div>
          )}

          <section className={`${styles.grid} ${styles.titles}`}>
            <span style={{ gridArea: "title" }}>Item</span>
            <span className={styles.owned}>Owned</span>
            <span className={styles.needed}>Needed</span>
            <span className={styles.delta}>Delta</span>
            <span style={{ gridArea: "extra" }}>Needed by</span>
          </section>

          {results.map(({ mat, usage }) => {
            const owned = user.materials[mat.id] ?? 0;
            const needed = usage?.total ?? 0;
            const delta = Math.max(0, needed - owned);
            if (
              filters.menu &&
              ((delta < 1 && filters.hideCompleted) ||
                (filters.hideGems && /^((Secret|Magic) )?Gem/.test(mat.name)) ||
                (filters.hideStatues && / (Piece|Monument)$/.test(mat.name)))
            ) {
              return null;
            }

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

                <fieldset className={styles.owned}>
                  <legend>Owned</legend>
                  <input
                    type="number"
                    min="0"
                    value={owned}
                    onChange={ev =>
                      setMaterialAmount(mat.id, ev.currentTarget.valueAsNumber)
                    }
                  />
                </fieldset>
                <fieldset className={styles.needed}>
                  <legend>Needed</legend>
                  <output value={needed} />
                </fieldset>
                <fieldset className={styles.delta}>
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
