import { useServantsDataApi } from "~/client/api";
import { servantsContext, useServantsData } from "~/client/context";
import { useIsClient } from "~/hooks/useIsClient";
import { Loading } from "./Loading";

function AppRouter() {
  // DEBUG
  // PLACEHOLDER
  const servantsData = useServantsData();
  return <p>servants: {Object.values(servantsData).length}</p>;
}

export function App() {
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
    <servantsContext.Provider value={servantsData.data}>
      <AppRouter />
    </servantsContext.Provider>
  );
}
