const makeDummyStorage = (): Storage => {
  let storageMap = new Map<string, string>();
  return {
    get length() {
      return storageMap.size;
    },
    getItem(key) {
      return storageMap.get(key) ?? null;
    },
    setItem(key: string, data: string) {
      storageMap.set(key, data);
    },
    removeItem(key: string) {
      this.delete(key);
    },
    clear() {
      storageMap = new Map();
    },
    key(index) {
      return Array.from(storageMap.values())[index];
    }
  };
};

const LocalStorage = (() => {
  try {
    if (typeof localStorage === "undefined") {
      return makeDummyStorage();
    }
    return localStorage;
  } catch {
    return makeDummyStorage();
  }
})();

export const Storage = {
  getAccountList() {
    const str = LocalStorage.getItem("fgoman:accounts");
    if (!str) return [];

    try {
      const data: unknown = JSON.parse(str);
      if (!Array.isArray(data)) return [];
      return data.filter((id): id is string => /(na|jp)(-\d{4}){3}/.test(id));
    } catch {
      return [];
    }
  },
  getAccount(id: string) {
    return LocalStorage.getItem(`fgoman:account:${id}`);
  },
  getSelected() {
    return LocalStorage.getItem("fgoman:selected");
  },
  write(key: "accounts" | `account:${string}` | "selected", data: string) {
    LocalStorage.setItem(`fgoman:${key}`, data);
  }
};
