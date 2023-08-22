import type { Dispatch } from "preact/hooks";
import { useMemo, useReducer } from "preact/hooks";
import type { AccountServant } from "~/client/account";
import type { ServantData } from "~/data/servants";
import { mapObject } from "~/util/mapObject";

export interface CostumeState {
  id: `${number}`;
  name: string;
  state: null | boolean;
}

type Costumes = [`${number}`[], undefined | Record<`${number}`, CostumeState>];
type CostumeAction = { id: `${number}`; value: null | boolean };
export type CostumeDispatch = Dispatch<CostumeAction>;

function reducer(state: Costumes[1], action: CostumeAction) {
  if (!state) return;
  const newState: NonNullable<Costumes[1]> = { ...state };
  newState[action.id] = {
    ...newState[action.id],
    state: action.value
  };
  return newState;
}

export function useCostumes(
  data: ServantData["costumes"],
  initial: AccountServant["costume"]
) {
  const [ids, initialState] = useMemo((): Costumes => {
    if (!data) return [[], undefined];
    const initialState = mapObject(data, (name, id): CostumeState => {
      return { id, name, state: initial?.[id] ?? null };
    });
    const ids = Object.keys(data) as `${number}`[];
    return [ids, initialState];
  }, [data, initial]);
  const [state, setState] = useReducer(reducer, initialState);

  return [ids, state, setState] as const;
}
