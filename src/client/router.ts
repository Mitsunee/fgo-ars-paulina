import { useStore } from "@nanostores/preact";
import { atom } from "nanostores";

export const enum Routes {
  SERVANTS_LIST = "servants",
  CREATE_ACCOUNT = "create-account",
  SERVANTS_ADD = "add-servants"
}

const router = atom<Routes>(Routes.SERVANTS_LIST);

export function changeRoute(route: Routes) {
  router.set(route);
}

export function returnHome() {
  router.set(Routes.SERVANTS_LIST);
}

export function useRouter() {
  const route = useStore(router);
  return [route, changeRoute] as const;
}
