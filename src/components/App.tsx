import { useServantsData } from "~/client/api";
import { useIsClient } from "~/hooks/useIsClient";
import { Loading } from "./Loading";

export function App() {
  const isClient = useIsClient();
  const servantsData = useServantsData();
  const isError = servantsData.state == "error";
  const isReady = isClient && servantsData.state == "success";

  if (!isClient) return <Loading title="Loading App" />;
  if (isError) return <>Error Placeholder</>;
  if (!isReady) return <Loading title="Loading Game Data" />;

  return <>{servantsData.state}</>;
}
