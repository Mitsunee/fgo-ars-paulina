import type { Dispatch } from "preact/hooks";
import type { AccountServant } from "~/client/account";
import {
  getAccountServantIcon,
  ServantStat,
  useAccount
} from "~/client/account";
import { useServantsData } from "~/client/context";
import { cc } from "~/components/jsx";
import styles from "./ServantCard.module.css";
import { ButtonRow } from "~/components/ButtonField";
import { IconButton } from "~/components/IconButton";

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

  return (
    <>
      <li className={cc([styles.card, expanded && styles.sel])}>
        <ButtonRow>
          {idx > 0 && <IconButton onClick={() => {}} icon="left" />}
          <IconButton
            onClick={() => {
              set(expanded ? undefined : idx);
            }}
            icon={expanded ? "less" : "more"}
          />
          {servant.id != 1 && <IconButton onClick={() => {}} icon="delete" />}
          {idx < user.servants.length - 1 && (
            <IconButton onClick={() => {}} icon="right" />
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
    </>
  );
}
