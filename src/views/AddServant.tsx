import { useState } from "react";
import { useServantsData } from "~/client/context";
import { returnHome } from "~/client/router";
import { ButtonField } from "~/components/ButtonField";
import { getServantIconUrl } from "~/util/urls";

export function AddServantView() {
  const [servantId, setServant] = useState<IdKey | null>(null);
  const servantsData = useServantsData();
  const servantIds = Object.keys(servantsData) as IdKey[];

  if (!servantId) {
    return (
      <section className="section">
        <h1>Add Servant</h1>
        <form onSubmit={ev => ev.preventDefault()}>
          {servantIds.map(id => {
            if (id == "1") return null;
            const servant = servantsData[id];
            const icon = getServantIconUrl(servant.icons["1"]);
            return (
              <button key={id} type="button" onClick={() => setServant(id)}>
                <img src={icon} alt={servant.name} />
              </button>
            );
          })}
        </form>
      </section>
    );
  }

  const servant = servantsData[servantId];

  return (
    <section className="section">
      <h1>Adding {servant.name}</h1>
      <form onSubmit={ev => ev.preventDefault()}>
        <ButtonField>
          <button type="button" onClick={() => setServant(null)}>
            Add other Servant
          </button>
          <button type="button" onClick={() => returnHome()}>
            Cancel
          </button>
        </ButtonField>
      </form>
    </section>
  );
}
