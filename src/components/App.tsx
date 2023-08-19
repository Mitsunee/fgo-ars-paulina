import { useAccount } from "~/client/account";
import { useServantsDataApi } from "~/client/api";
import type { DataContext } from "~/client/context";
import { dataContext, servantsContext } from "~/client/context";
import { Routes, useRouter } from "~/client/router";
import { useIsClient } from "~/hooks/useIsClient";
import { AddServantView } from "~/views/AddServant";
import { CreateAccountView } from "~/views/CreateAccount";
import { ServantListView } from "~/views/ServantsList";
import { Loading } from "./Loading";

function AppRouter() {
  const user = useAccount();
  const [route] = useRouter();

  if (user === undefined) {
    return <Loading title="Loading Account Data" />;
  }

  if (!user) {
    return <CreateAccountView forced />;
  }

  switch (route) {
    case Routes.SERVANTS_LIST:
      return <ServantListView />;
    case Routes.CREATE_ACCOUNT:
      return <CreateAccountView />;
    case Routes.SERVANTS_ADD:
      return <AddServantView />;
    default:
      return <ServantListView />;
  }
}

export function App(ctxProps: DataContext) {
  const isClient = useIsClient();
  const servantsData = useServantsDataApi();
  const isError = servantsData.state == "error";
  const isReady = isClient && servantsData.state == "success";

  if (!isClient) {
    return <Loading title="Loading App" />;
  }

  if (isError) {
    return (
      <section className="section error">
        <h2>Internal Server Error</h2>
        <p>
          An error occured while fetching the app data. Refresh the page to try
          again. If the error persists please wait a moment before trying again.
        </p>
      </section>
    );
  }

  if (!isReady) {
    return <Loading title="Loading App Data" />;
  }

  return (
    <dataContext.Provider value={ctxProps}>
      <servantsContext.Provider value={servantsData.data}>
        <AppRouter />
      </servantsContext.Provider>
    </dataContext.Provider>
  );
}
