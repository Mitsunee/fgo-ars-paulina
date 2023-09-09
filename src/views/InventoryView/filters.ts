import { useReducer } from "preact/hooks";

interface FilterState {
  menu: boolean;
  hideGems: boolean;
  hideStatues: boolean;
  hideCompleted: boolean;
}

interface FilterAction {
  type: Extract<keyof FilterState, string>;
  value?: boolean;
}

function reducer(state: FilterState, action: FilterAction) {
  if (state[action.type] == action.value) return state;

  return {
    ...state,
    [action.type]: action.value ?? !state[action.type]
  };
}

const initialState: FilterState = {
  menu: false,
  hideGems: false,
  hideStatues: false,
  hideCompleted: false
};

export function useFilters() {
  return useReducer(reducer, initialState);
}
