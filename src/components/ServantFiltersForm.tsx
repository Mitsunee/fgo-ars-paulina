import type { Dispatch } from "preact/hooks";
import { useReducer } from "preact/hooks";
import { ServantClass } from "~/data/ServantClass";
import type { ServantData } from "~/data/servants";
import { ArrowButton } from "./ArrowButton";
import { ButtonField } from "./ButtonField";
import { ClassSelector } from "./ClassSelector";
import { InputRadio } from "./InputRadio";
import { cc, type ElementProps, type WithCC } from "./jsx";

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

interface ServantFiltersFormProps extends WithCC<ElementProps<"form">> {
  query: string;
  setQuery: Dispatch<string>;
  filters: FiltersState;
  setFilters: Dispatch<FiltersAction>;
}

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

export function createFilterCheck(filters: FiltersState) {
  const hasClassFilters = Object.values(filters.classes).some(v => v);

  return function checkFilters(servant: ServantData): boolean {
    if (filters.naOnly && !servant.na) return false;
    if (filters.rarity !== null && servant.rarity != filters.rarity) {
      return false;
    }
    if (hasClassFilters && !filters.classes[servant.className]) return false;
    return true;
  };
}

export function ServantFiltersForm({
  children,
  className,
  query,
  setQuery,
  filters,
  setFilters,
  ...props
}: ServantFiltersFormProps) {
  return (
    <form
      className={cc(className)}
      {...props}
      onSubmit={ev => ev.preventDefault()}>
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
      {children}
    </form>
  );
}
