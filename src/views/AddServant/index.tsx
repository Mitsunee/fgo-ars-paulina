import { useState } from "react";
import { useServantsData } from "~/client/context";
import { returnHome } from "~/client/router";
import { ButtonField } from "~/components/ButtonField";
import { PickServantForm, useFilters } from "./PickServantForm";

export function AddServantView() {
  const [servantId, setServant] = useState<IdKey | null>(null);
  const servantsData = useServantsData();
  const servant = servantId && servantsData[servantId];
  const [filters, setFilters] = useFilters();

  return (
    <section className="section">
      <h1>{servant ? `Adding ${servant.name}` : `Add Servant`}</h1>
      {servant ? (
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
      ) : (
        <PickServantForm
          data={servantsData}
          set={setServant}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </section>
  );
}
