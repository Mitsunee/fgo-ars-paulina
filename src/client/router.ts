import { useStore } from "@nanostores/preact";
import { atom, onSet } from "nanostores";
import type { AnyComponent } from "preact";
import { AddServantView } from "~/views/AddServant";
import { CreateAccountView } from "~/views/CreateAccount";
import { EditServantView } from "~/views/EditServantView";
import { InventoryView } from "~/views/InventoryView";
import { ServantListView } from "~/views/ServantsList";

export const routes = {
  home: ServantListView,
  "create-account": CreateAccountView,
  "add-servant": AddServantView,
  "edit-servant": EditServantView,
  inventory: InventoryView
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<string, AnyComponent<any>>;

type Router = typeof routes;
type Route = Extract<keyof Router, string>;
type SelectedRoute<Path extends Route> = {
  path: Path;
} & (Parameters<Router[Path]>[0] extends undefined
  ? { props?: undefined }
  : { props: Parameters<Router[Path]>[0] });

const router = atom<SelectedRoute<Route>>({ path: "home", props: {} });

onSet(router, () => {
  window?.scrollTo({ top: 0, behavior: "instant" });
});

export function changeRoute<Path extends Route>({
  path,
  props
}: SelectedRoute<Path>) {
  router.set({ path, props });
}

export function returnHome() {
  changeRoute({ path: "home" });
}

export function useRouter() {
  const route = useStore(router);
  return [route, changeRoute] as const;
}
