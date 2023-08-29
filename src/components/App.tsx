import { useAccount } from "~/client/account";
import { useMaterialsDataApi, useServantsDataApi } from "~/client/api";
import {
  infoContext,
  materialsContext,
  servantsContext
} from "~/client/context";
import { routes, useRouter } from "~/client/router";
import type { BuildInfo } from "~/data/buildInfo";
import { useIsClient } from "~/hooks/useIsClient";
import { CreateAccountView } from "~/views/CreateAccount";
import { Loading } from "./Loading";

export interface AppProps {
  info: BuildInfo;
}

function AppRouter() {
  const user = useAccount();
  const [route] = useRouter();
  const RouteComponent = routes[route.path];

  return (
    <>
      {user === undefined ? (
        <Loading title="Loading Account Data" />
      ) : user ? (
        <RouteComponent {...route.props} />
      ) : (
        <CreateAccountView forced />
      )}
    </>
  );
}

export function App(ctxProps: AppProps) {
  const isClient = useIsClient();
  const servantsData = useServantsDataApi();
  const materialsData = useMaterialsDataApi();
  const isError =
    servantsData.status == "error" || materialsData.status == "error";
  const isReady =
    isClient &&
    servantsData.status == "success" &&
    materialsData.status == "success";

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
    <infoContext.Provider value={ctxProps.info}>
      <servantsContext.Provider value={servantsData.data}>
        <materialsContext.Provider value={materialsData.data}>
          <AppRouter />
        </materialsContext.Provider>
      </servantsContext.Provider>
    </infoContext.Provider>
  );
}
