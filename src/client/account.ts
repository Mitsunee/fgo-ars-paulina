import { useStore } from "@nanostores/preact";
import { atom, onMount } from "nanostores";
import type { ServantData } from "~/data/servants";

export const accountDataVer = "0.0.1"; // will be used in the future to migrate accounts to new data versions

export const enum ServantStat {
  ASCENSION_CURRENT,
  ASCENSION_TARGET,
  SKILL1_CURRENT,
  SKILL1_TARGET,
  SKILL2_CURRENT,
  SKILL2_TARGET,
  SKILL3_CURRENT,
  SKILL3_TARGET,
  APPEND1_CURRENT,
  APPEND1_TARGET,
  APPEND2_CURRENT,
  APPEND2_TARGET,
  APPEND3_CURRENT,
  APPEND3_TARGET
}

export const enum LocalStorageKeys {
  ACCOUNT_LIST = "fgoman:accounts",
  ACCOUNT_PREFIX = "fgoman:account:",
  ACCOUNT_SELECTED = "fgoman:selected"
}

export interface AccountServant {
  id: number;
  /**
   * Tuple containing current and target levels for ascension, skills and append skills. See `ServantStat` for indices
   */
  stats: Tuple<number, 14>;
  /**
   * Maps costume id to state where `null` means costume is not wanted, `true` means costume is aquired and `false` means costume is wanted but not unlocked
   */
  costume?: PartialDataMap<boolean | null>;
  owned?: boolean;
}

export interface AccountData {
  name: string;
  region: "na" | "jp";
  fc: string;
  servants: AccountServant[];
  materials: Partial<DataMap<number>>;
}

/**
 * Store set to `undefined` during loading, `null` if no accounts exist or `AccountData`
 */
const accountStore = atom<null | undefined | AccountData>();

export function getAccountList() {
  const str = localStorage.getItem(LocalStorageKeys.ACCOUNT_LIST);
  if (!str) return [];

  try {
    const data: unknown = JSON.parse(str);
    if (!Array.isArray(data)) return [];
    return data.filter((id): id is string => /(na|jp)(-\d{4}){3}/.test(id));
  } catch {
    return [];
  }
}

export function saveAccountList(list: string[]) {
  localStorage.setItem(LocalStorageKeys.ACCOUNT_LIST, JSON.stringify(list));
}

export function getAccount(id: string) {
  const str = localStorage.getItem(`${LocalStorageKeys.ACCOUNT_PREFIX}${id}`);
  if (!str) return;

  try {
    const data: AccountData = JSON.parse(str);
    return data;
  } catch {
    return;
  }
}

export function getAccountId(account: AccountData) {
  return `${account.region}-${account.fc}`;
}

export function saveAccount(data: AccountData) {
  const id = getAccountId(data);
  const accountList = getAccountList();
  if (!accountList.includes(id)) {
    accountList.push(id);
    saveAccountList(accountList);
  }

  localStorage.setItem(
    `${LocalStorageKeys.ACCOUNT_PREFIX}${id}`,
    JSON.stringify(data)
  );
}

export function createServant(data: ServantData): AccountServant {
  const servant: AccountServant = {
    id: data.id,
    stats: [0, 4, 1, 10, 1, 10, 1, 10, 1, 1, 1, 1, 1, 1]
  };

  if (data.na) {
    servant.owned = true;
  } else {
    const acc = accountStore.get();
    if (acc?.region == "jp") servant.owned = true;
  }

  return servant;
}

export function createAccount(name: string, region: "na" | "jp", fc: string) {
  const account: AccountData = {
    name,
    region,
    fc,
    materials: {},
    servants: [
      {
        id: 1,
        stats: [1, 4, 1, 10, 1, 10, 1, 10, 1, 1, 1, 1, 1, 1],
        owned: true
      }
    ]
  };

  return account;
}

export function selectAccount(id: string) {
  const account = getAccount(id);
  if (!account) return false;
  accountStore.set(account);
  localStorage.setItem(LocalStorageKeys.ACCOUNT_SELECTED, id);
  document.title = `FGO Manager - ${
    account.name
  } (${account.region.toUpperCase()})`;
  return true;
}

onMount(accountStore, () => {
  let selected = localStorage.getItem(LocalStorageKeys.ACCOUNT_SELECTED);
  if (!selected) {
    const list = getAccountList();
    const first = list[0];
    if (!first) {
      return accountStore.set(null);
    }
    selected = first;
  }

  if (!selectAccount(selected)) accountStore.set(null);
});

/**
 * Store set to `undefined` during loading, `null` if no accounts exist or `AccountData`
 */
export function useAccount() {
  return useStore(accountStore);
}
