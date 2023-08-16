import { useStore } from "@nanostores/react";
import { atom } from "nanostores";

export const enum Routes {
  SERVANTS_VIEW = "servants",
  CREATE_ACCOUNT = "create-account"
}

const router = atom<Routes>(Routes.SERVANTS_VIEW);

export function changeRoute(route: Routes) {
  router.set(route);
}

export function returnHome() {
  router.set(Routes.SERVANTS_VIEW);
}

export function useRouter() {
  const route = useStore(router);
  return [route, changeRoute] as const;
}
