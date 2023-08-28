import type { Dispatch } from "preact/hooks";
import type { AccountServant } from "~/client/account";
import {
  deleteServant,
  getAccountServantIcon,
  ServantStat,
  swapDownServant,
  swapUpServant,
  useAccount
} from "~/client/account";
import { useServantsData } from "~/client/context";
import { ButtonRow } from "~/components/ButtonField";
import { IconButton } from "~/components/IconButton";
import { cc } from "~/components/jsx";
import { useModal } from "~/hooks/useModal";
import styles from "./ServantCard.module.css";

interface ServantCardProps {
  servant: AccountServant;
  /**
   * Servant index in account.servants
   */
  idx: number;
  /**
   * Whether or not this card is expanded
   */
  expanded: boolean;
  /**
   * setter function to open/close this card
   */
  set: Dispatch<number | undefined>;
}

export function ServantCard({ servant, idx, expanded, set }: ServantCardProps) {
  const user = useAccount()!;
  const servantsData = useServantsData();
  const servantData = servantsData[servant.id];
  const activeIcon = getAccountServantIcon(servant, servantData.icons, true);
  const [dialog, createDialog, showDialog] = useModal();

  return (
    <>
      <li className={cc([styles.card, expanded && styles.sel])}>
        <ButtonRow>
          {idx > 0 && (
            <IconButton
              onClick={() => {
                swapDownServant(idx);
                set(undefined);
              }}
              icon="left"
            />
          )}
          <IconButton
            onClick={() => {
              set(expanded ? undefined : idx);
            }}
            icon={expanded ? "less" : "more"}
          />
          {servant.id != 1 && (
            <IconButton onClick={() => showDialog()} icon="delete" />
          )}
          {idx < user.servants.length - 1 && (
            <IconButton
              onClick={() => {
                swapUpServant(idx);
                set(undefined);
              }}
              icon="right"
            />
          )}
        </ButtonRow>
        <img src={activeIcon} alt="" width={142} height={155} />
        <h2>{servantData.name}</h2>
        <span>
          <img
            src="https://static.atlasacademy.io/NA/Items/40.png"
            alt=""
            title="Ascension"
          />
          {servant.stats[ServantStat.ASCENSION_CURRENT]}
          {" / "}
          {servant.stats[ServantStat.ASCENSION_TARGET]}
        </span>
        <span>
          <img
            // PLACEHOLDER
            src="https://static.atlasacademy.io/NA/Items/40.png"
            alt=""
            title="Skills"
          />
          {servant.stats[ServantStat.SKILL1_CURRENT]}
          {" / "}
          {servant.stats[ServantStat.SKILL2_CURRENT]}
          {" / "}
          {servant.stats[ServantStat.SKILL3_CURRENT]}
        </span>
        <span>
          <img
            // PLACEHOLDER
            src="https://static.atlasacademy.io/NA/Items/40.png"
            alt=""
            title="Append Skills"
          />
          {servant.stats[ServantStat.APPEND1_CURRENT] || "-"}
          {" / "}
          {servant.stats[ServantStat.APPEND2_CURRENT] || "-"}
          {" / "}
          {servant.stats[ServantStat.APPEND3_CURRENT] || "-"}
        </span>
      </li>
      {expanded && (
        <li
          // PLACEHOLDER
          className={cc([styles.info])}>
          <h2>PLACEHOLDER: {servantData.name}</h2>
        </li>
      )}
      {createDialog(
        <section className="section shaded">
          <h2>Deleting {servantData.name}</h2>
          <p>Are you sure you want to delete this Servant?</p>
          <ButtonRow>
            <button
              type="button"
              onClick={() => {
                dialog.close();
                deleteServant(idx);
              }}>
              Confirm
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => dialog.close()}>
              Cancel
            </button>
          </ButtonRow>
        </section>
      )}
    </>
  );
}
