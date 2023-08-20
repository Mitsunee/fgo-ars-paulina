import { useMemo, useState } from "preact/hooks";
import { createServant } from "~/client/account";
import { useServantsData } from "~/client/context";
import { returnHome } from "~/client/router";
import { EditServantForm } from "~/components/EditServantForm";
import { PickServantForm, useFilters } from "./PickServantForm";

export function AddServantView() {
  const [servantId, setServant] = useState<IdKey | null>(null);
  const servantsData = useServantsData();
  const servantData = servantId && servantsData[servantId];
  const servant = useMemo(
    () => (servantData ? createServant(servantData) : undefined),
    [servantData]
  );
  const [filters, setFilters] = useFilters();

  return (
    <section className="section">
      <h1>{servantData ? `Adding ${servantData.name}` : `Add Servant`}</h1>
      {servantData && servant ? (
        <EditServantForm servant={servant}>
          <button type="button" onClick={() => setServant(null)}>
            Add other Servant
          </button>
          <button type="button" onClick={() => returnHome()}>
            Cancel
          </button>
        </EditServantForm>
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
