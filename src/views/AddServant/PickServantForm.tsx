import { Searcher } from "fast-fuzzy";
import type { Dispatch } from "preact/hooks";
import { useMemo, useReducer, useState } from "preact/hooks";
import { returnHome } from "~/client/router";
import { ArrowButton } from "~/components/ArrowButton";
import { ButtonField } from "~/components/ButtonField";
import { ClassSelector } from "~/components/ClassSelector";
import { InputRadio } from "~/components/InputRadio";
import { ServantClass } from "~/data/ServantClass";
import type { ServantData } from "~/data/servants";
import { getServantIconUrl } from "~/util/urls";
import styles from "./PickServantForm.module.css";

export interface FiltersState {
  menu: boolean;
  classes: Record<ServantClass, boolean>;
  rarity: number | null;
  naOnly: boolean;
}

export type FiltersAction =
  | { type: "menu"; value: boolean }
  | { type: "classes"; value: ServantClass }
  | { type: "rarity"; value: number | null }
  | { type: "naOnly"; value: boolean };

function filtersReducer(state: FiltersState, action: FiltersAction) {
  // skip useless rerender
  if (state[action.type] == action.value) return state;

  // deepClone state
  const newState: FiltersState = { ...state, classes: { ...state.classes } };
  switch (action.type) {
    case "classes":
      newState.classes[action.value] = !newState.classes[action.value];
      break;
    default:
      newState[action.type] = action.value as unknown as never; // copy value from action directly
  }

  return newState;
}

const reducerDefaults = {
  menu: false,
  rarity: null,
  naOnly: false,
  classes: {
    [ServantClass.SABER]: false,
    [ServantClass.ARCHER]: false,
    [ServantClass.LANCER]: false,
    [ServantClass.RIDER]: false,
    [ServantClass.CASTER]: false,
    [ServantClass.ASSASSIN]: false,
    [ServantClass.BERSERKER]: false,
    [ServantClass.EXTRA]: false
  }
} satisfies FiltersState;

export function useFilters() {
  return useReducer(filtersReducer, reducerDefaults);
}

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
      const hasClassFilter = Object.values(filters.classes).some(v => v);
      servantList = servantList.filter(
        servant =>
          !(
            (filters.naOnly && !servant.na) ||
            (filters.rarity !== null && servant.rarity != filters.rarity) ||
            (hasClassFilter && !filters.classes[servant.className])
          )
      );
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
    <form onSubmit={ev => ev.preventDefault()}>
      <ButtonField>
        <input
          type="search"
          name="servant-search"
          value={query}
          onChange={ev => setQuery(ev.currentTarget.value)}
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
        <>
          <ClassSelector
            state={filters.classes}
            set={value => setFilters({ type: "classes", value })}
          />
          <fieldset>
            <legend>Rarity</legend>
            <InputRadio
              name="rarity"
              value="0"
              onClick={() => setFilters({ type: "rarity", value: null })}
              defaultChecked={filters.rarity === null}>
              *
            </InputRadio>
            <InputRadio
              name="rarity"
              value="1"
              onClick={() => setFilters({ type: "rarity", value: 1 })}
              defaultChecked={filters.rarity === 1}>
              1
            </InputRadio>
            <InputRadio
              name="rarity"
              value="2"
              onClick={() => setFilters({ type: "rarity", value: 2 })}
              defaultChecked={filters.rarity === 2}>
              2
            </InputRadio>
            <InputRadio
              name="rarity"
              value="3"
              onClick={() => setFilters({ type: "rarity", value: 3 })}
              defaultChecked={filters.rarity === 3}>
              3
            </InputRadio>
            <InputRadio
              name="rarity"
              value="4"
              onClick={() => setFilters({ type: "rarity", value: 4 })}
              defaultChecked={filters.rarity === 4}>
              4
            </InputRadio>
            <InputRadio
              name="rarity"
              value="5"
              onClick={() => setFilters({ type: "rarity", value: 5 })}
              defaultChecked={filters.rarity === 5}>
              5
            </InputRadio>
          </fieldset>
          <fieldset>
            <legend>Region</legend>
            <InputRadio
              name="region"
              value="na"
              onClick={() => setFilters({ type: "naOnly", value: true })}
              defaultChecked={filters.naOnly}>
              EN
            </InputRadio>
            <InputRadio
              name="region"
              value="jp"
              onClick={() => setFilters({ type: "naOnly", value: false })}
              defaultChecked={!filters.naOnly}>
              JP
            </InputRadio>
          </fieldset>
        </>
      )}
      <div className={styles.list}>
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
    </form>
  );
}
