import { Searcher } from "fast-fuzzy";
import type { Dispatch } from "preact/hooks";
import { useMemo, useState } from "preact/hooks";
import { returnHome } from "~/client/router";
import {
  createFilterCheck,
  type FiltersAction,
  type FiltersState
} from "~/client/servantsFilter";
import { ButtonField } from "~/components/ButtonField";
import { ServantFiltersForm } from "~/components/ServantFiltersForm";
import type { ServantData } from "~/data/servants";
import { getServantIconUrl } from "~/util/urls";

interface PickServantFormProps {
  data: DataMap<ServantData>;
  set: (id: IdKey | null) => void;
  filters: FiltersState;
  setFilters: Dispatch<FiltersAction>;
}

export function PickServantForm({
  data: servantsData,
  set: pickServant,
  filters,
  setFilters
}: PickServantFormProps) {
  const [query, setQuery] = useState("");
  const [searcher, servantList] = useMemo(() => {
    let servantList = Object.values(servantsData);

    if (filters.menu) {
      const checkFilters = createFilterCheck(filters);
      servantList = servantList.filter(checkFilters);
    }

    return [
      new Searcher(servantList, {
        threshold: 0.8,
        keySelector: candidate => candidate.name
      }),
      servantList
    ] as const;
  }, [servantsData, filters]);

  const result = query ? searcher.search(query) : servantList;

  return (
    <ServantFiltersForm
      query={query}
      setQuery={setQuery}
      filters={filters}
      setFilters={setFilters}>
      <div className="icon-list">
        {result.map(servant => {
          if (servant.id == 1) return null;
          const icon = getServantIconUrl(servant.icons["1"], true);
          return (
            <button
              key={servant.id}
              type="button"
              onClick={() => pickServant(servant.id)}>
              <img
                src={icon}
                alt={servant.name}
                title={servant.name}
                width={142}
                height={155}
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
      <ButtonField>
        <button type="button" onClick={() => returnHome()}>
          Cancel
        </button>
      </ButtonField>
    </ServantFiltersForm>
  );
}
