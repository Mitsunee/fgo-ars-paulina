import { useStore } from "@nanostores/preact";
import { atom, onMount } from "nanostores";
import type { ServantData } from "~/data/servants";
import { getServantIconUrl } from "~/util/urls";
import { Storage } from "./localStorage";

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
  APPEND3_TARGET,
  GRAIL_CURRENT,
  GRAIL_TARGET
}

export interface AccountServant {
  id: number;
  /**
   * Tuple containing current and target levels for ascension, skills and append skills. See `ServantStat` for indices
   */
  stats: Tuple<number, 16>;
  /**
   * Maps costume id to state where `null` means costume is not wanted, `true` means costume is aquired and `false` means costume is wanted but not unlocked
   */
  costume?: PartialDataMap<boolean | null>;
  owned?: boolean;
  icon?: string;
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

export function saveAccountList(list: string[]) {
  Storage.write("accounts", JSON.stringify(list));
}

export function getAccount(id: string) {
  const str = Storage.getAccount(id);
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
  const accountList = Storage.getAccountList();
  if (!accountList.includes(id)) {
    accountList.push(id);
    saveAccountList(accountList);
  }

  Storage.write(`account:${id}`, JSON.stringify(data));
}

export function createServant(data: ServantData): AccountServant {
  const servant: AccountServant = {
    id: data.id,
    stats: [0, 4, 1, 10, 1, 10, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  if (data.na) {
    servant.owned = true;
  } else {
    const acc = accountStore.get();
    if (acc?.region == "jp") servant.owned = true;
  }

  return servant;
}

export function addServant(servant: AccountServant, idx?: number) {
  const oldAccount = accountStore.get();
  if (!oldAccount) {
    throw new Error("Cannot set servant as no account is selected");
  }

  const account: AccountData = {
    ...oldAccount,
    servants: [...oldAccount.servants]
  };
  if (typeof idx == "number") {
    account.servants[idx] = servant;
  } else {
    account.servants.push(servant);
  }

  saveAccount(account);
  accountStore.set(account);
}

export function getAccountServantIcon(
  servant: AccountServant,
  icons: DataMap<string>,
  bordered?: boolean
) {
  const asc = +servant.stats[ServantStat.ASCENSION_CURRENT];
  const byAsc = asc < 2 ? asc + 1 : asc;
  const icon = icons[servant.icon ? +servant.icon : byAsc];
  return getServantIconUrl(icon, bordered);
}

export function swapUpServant(idx: number) {
  const oldAccount = accountStore.get();
  if (!oldAccount) {
    throw new Error("Cannot swap servant as no account is selected");
  }
  if (idx < 0 || idx >= oldAccount.servants.length - 1) return;

  // create new servants array with servants swapped
  const servantA = oldAccount.servants[idx];
  const servantB = oldAccount.servants[idx + 1];
  const servants = [...oldAccount.servants];
  servants[idx + 1] = servantA;
  servants[idx] = servantB;

  // create and save new account data
  const account: AccountData = { ...oldAccount, servants };
  saveAccount(account);
  accountStore.set(account);
}

export function swapDownServant(idx: number) {
  const oldAccount = accountStore.get();
  if (!oldAccount) {
    throw new Error("Cannot swap servant as no account is selected");
  }
  if (idx < 1 || idx >= oldAccount.servants.length) return;

  // create new servants array with servants swapped
  const servantA = oldAccount.servants[idx];
  const servantB = oldAccount.servants[idx - 1];
  const servants = [...oldAccount.servants];
  servants[idx - 1] = servantA;
  servants[idx] = servantB;

  // create and save new account data
  const account: AccountData = { ...oldAccount, servants };
  saveAccount(account);
  accountStore.set(account);
}

export function deleteServant(idx: number) {
  const oldAccount = accountStore.get();
  if (!oldAccount) {
    throw new Error("Cannot delete servant as no account is selected");
  }
  if (oldAccount.servants[idx]?.id == 1) {
    throw new Error("Do not delete Mash!");
  }

  const servants = oldAccount.servants.filter((_, i) => i != idx);
  const account: AccountData = { ...oldAccount, servants };
  saveAccount(account);
  accountStore.set(account);
}

export function setMaterialAmount(id: number, amount: number) {
  const newAmount = Math.max(0, Math.trunc(amount));
  const oldAccount = accountStore.get();
  if (!oldAccount) {
    throw new Error("Cannot delete servant as no account is selected");
  }

  const materials = { ...oldAccount.materials, [id]: newAmount };
  const account: AccountData = { ...oldAccount, materials };
  saveAccount(account);
  accountStore.set(account);
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
        stats: [0, 4, 1, 10, 1, 10, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0],
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
  Storage.write("selected", id);
  document.title = `FGO Manager - ${
    account.name
  } (${account.region.toUpperCase()})`;
  return true;
}

onMount(accountStore, () => {
  const selected = Storage.getSelected();

  if (!selected) {
    const list = Storage.getAccountList();
    const first = list[0];
    if (!first) {
      return accountStore.set(null);
    }
    if (!selectAccount(first)) return accountStore.set(null);
    return;
  }

  if (!selectAccount(selected)) accountStore.set(null);
});

/**
 * Store set to `undefined` during loading, `null` if no accounts exist or `AccountData`
 */
export function useAccount() {
  return useStore(accountStore);
}
