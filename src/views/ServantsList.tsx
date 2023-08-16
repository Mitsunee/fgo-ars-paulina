import { useAccount } from "~/client/account";
import { useServantsData } from "~/client/context";
import { changeRoute, Routes } from "~/client/router";
import { ButtonRow } from "~/components/ButtonField";

export function ServantListView() {
  const user = useAccount();
  const servantsData = useServantsData();

  if (!user) return null;

  return (
    <section className="section">
      <h1>Servants</h1>
      <ul>
        {user.servants.map(servant => (
          <li key={servant.id}>{servantsData[servant.id].name}</li>
        ))}
      </ul>
      <ButtonRow>
        <button
          className="primary"
          onClick={() => changeRoute(Routes.SERVANTS_ADD)}>
          Add Servant
        </button>
        <button>Sample Text</button>
      </ButtonRow>
    </section>
  );
}
