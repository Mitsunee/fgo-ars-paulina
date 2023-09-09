import { addServant, useAccount } from "~/client/account";
import { useServantsData } from "~/client/context";
import { returnHome } from "~/client/router";
import { EditServantForm } from "~/components/EditServantForm";
import { getEditedServant } from "~/components/EditServantForm/getEditedServant";
import { NoAccountError } from "~/components/NoAccountError";

interface ViewProps {
  idx: number;
}

export function EditServantView({ idx }: ViewProps) {
  const user = useAccount(); // can use ! here, just not doing it yet so TS knows `servant` can be undefined
  const servantsData = useServantsData();
  const servant = user?.servants.at(idx);
  if (!user || !servant) return <NoAccountError />;
  const servantData = servantsData[servant.id];

  return (
    <section className="section">
      <h1>Editing {servantData.name}</h1>
      <EditServantForm servant={servant}>
        <button
          type="submit"
          className="primary"
          onClick={ev => {
            const form = ev.currentTarget.form!;
            const newServant = getEditedServant(servantData, form);
            addServant(newServant, idx);
            returnHome();
          }}>
          Edit Servant
        </button>
        <button type="button" onClick={() => returnHome()}>
          Cancel
        </button>
      </EditServantForm>
    </section>
  );
}
