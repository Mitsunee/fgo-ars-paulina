import { Searcher, sortKind } from "fast-fuzzy";
import { useMemo, useState } from "preact/hooks";
import { useAccount } from "~/client/account";
import { useServantsData } from "~/client/context";
import { changeRoute } from "~/client/router";
import { ButtonRow } from "~/components/ButtonField";
import { NoAccountError } from "~/components/NoAccountError";
import {
  createFilterCheck,
  ServantFiltersForm,
  useFilters
} from "~/components/ServantFiltersForm";
import { MaterialOverview } from "./MaterialOverview";
import { ServantCard } from "./ServantCard";
import styles from "./ServantList.module.css";

export function ServantListView() {
  const user = useAccount();
  const servantsData = useServantsData();
  const [selected, setSelected] = useState<number | undefined>();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useFilters();
  const [searcher, userServants] = useMemo(() => {
    let servantList =
      user?.servants.map((servant, idx) => ({
        servant,
        data: servantsData[servant.id],
        idx
      })) || [];

    if (filters.menu) {
      const checkFilters = createFilterCheck(filters);
      servantList = servantList.filter(({ data }) => checkFilters(data));
    }

    return [
      new Searcher(servantList, {
        threshold: 0.8,
        keySelector: candidate => candidate.data.name,
        sortBy: sortKind.insertOrder
      }),
      servantList
    ] as const;
  }, [filters, servantsData, user?.servants]);

  if (!user) return <NoAccountError />;

  const result = query ? searcher.search(query) : userServants;

  return (
    <>
      <section className="section">
        <h1>Servants</h1>
        <ServantFiltersForm
          query={query}
          setQuery={setQuery}
          filters={filters}
          setFilters={setFilters}
        />
        <ul className={styles.list}>
          {result.map(({ servant, idx }) => (
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
