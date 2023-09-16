import { useReducer } from "preact/hooks";
import { ServantClass } from "~/data/ServantClass";
import type { ServantData } from "~/data/servants";

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
