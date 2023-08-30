import type { Dispatch } from "preact/hooks";
import { useEffect, useMemo, useState } from "preact/hooks";
import { getAccountServantIcon, useAccount } from "~/client/account";
import { useMaterialList, useServantsData } from "~/client/context";
import { BorderedIcon } from "~/components/BorderedIcon";
import { ButtonRow } from "~/components/ButtonField";
import { useModalRef } from "~/hooks/useModal";
import { flattenMaterialUsage } from "~/util/flattenMaterialUsage";
import { flattenServantsNeeds } from "~/util/flattenServantNeeds";
import { formatLongNumber } from "~/util/formatLongNumber";

interface MaterialOverviewProps {
  setServant: Dispatch<number>;
}

interface MaterialSummaryProps extends MaterialOverviewProps {
  id: number;
}

function MaterialSummary({ id, setServant }: MaterialSummaryProps) {
  const [dialog] = useModalRef();
  const user = useAccount()!;
  const servantsData = useServantsData();
  const materialsData = useMaterialList();
  const mat = materialsData[id];

  const usage = useMemo(
    () => flattenMaterialUsage(mat, user.servants, servantsData),
    [mat, servantsData, user.servants]
  );

  function handleClick(idx: number) {
    dialog.close();
    setServant(idx);
    const title = document.getElementsByTagName("h1")[0];
    title?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="section">
      <h2>Servants using {mat.name}</h2>
      <div className="icon-list no-hover">
        {usage.map(({ servant, idx, amount }) => {
          const servantData = servantsData[servant.id];
          const icon = getAccountServantIcon(servant, servantData.icons);

          return (
            <button
              key={`${servant.id}-${idx}`}
              type="button"
              onClick={() => handleClick(idx)}>
              <BorderedIcon
                title={servantData.name}
                border={servantData.rarity}
                src={icon}>
                x{amount}
              </BorderedIcon>
            </button>
          );
        })}
      </div>
      <ButtonRow>
        <button type="button" onClick={() => dialog.close()}>
          Close
        </button>
      </ButtonRow>
    </section>
  );
}

export function MaterialOverview({ setServant }: MaterialOverviewProps) {
  const user = useAccount()!;
  const servantsData = useServantsData();
  const materialsData = useMaterialList();
  const [dialog, createDialog] = useModalRef();
  const [selected, setSelected] = useState<null | number>(null);

  const { mats, qp } = useMemo(
    () => flattenServantsNeeds(user.servants, servantsData, materialsData),
    [materialsData, servantsData, user.servants]
  );

  useEffect(() => {
    if (typeof selected == "number") dialog.showModal();
  }, [dialog, selected]);

  useEffect(() => {
    const callback = () => setSelected(null);
    dialog.addEventListener("close", callback);
    return () => dialog?.removeEventListener("close", callback);
  }, [dialog]);

  if (qp < 1 && mats.length < 1) return null;

  return (
    <>
      <section className="section">
        <h2>Required Materials</h2>
        <div className="icon-list no-hover">
          {mats.map(({ id, amount }) => {
            const mat = materialsData[id];
            return (
              <button key={id} type="button" onClick={() => setSelected(id)}>
                <BorderedIcon
                  key={id}
                  src={mat.icon}
                  border={mat.rarity}
                  title={mat.name}>
                  x{amount}
                </BorderedIcon>
              </button>
            );
          })}
          <BorderedIcon
            src="https://static.atlasacademy.io/NA/Items/5.png"
            border="blue"
            title="QP"
            style={{ margin: 0 }}>
            <span title={qp.toLocaleString()}>{formatLongNumber(qp)}</span>
          </BorderedIcon>
        </div>
      </section>
      {typeof selected == "number" &&
        createDialog(<MaterialSummary id={selected} setServant={setServant} />)}
    </>
  );
}
