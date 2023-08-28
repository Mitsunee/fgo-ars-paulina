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
import { useMaterialList, useServantsData } from "~/client/context";
import { BorderedIcon } from "~/components/BorderedIcon";
import { ButtonRow } from "~/components/ButtonField";
import { IconButton } from "~/components/IconButton";
import { cc } from "~/components/jsx";
import { appendIcons } from "~/data/appendIcons";
import type { ServantData } from "~/data/servants";
import { useModal } from "~/hooks/useModal";
import { flattenServantNeeds } from "~/util/flattenServantNeeds";
import { formatLongNumber } from "~/util/formatLongNumber";
import { getSkillIconUrl } from "~/util/urls";
import styles from "./ServantCard.module.css";

interface StatItemProps {
  title: string;
  icon: string;
  current: number;
  target: number;
  replaceZero?: true;
}

interface MaterialNeedsProps {
  servant: AccountServant;
  data: ServantData;
}

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

function StatItem({
  title,
  icon,
  current,
  target,
  replaceZero
}: StatItemProps) {
  const zero = replaceZero ? "-" : "0";

  return (
    <li>
      <img
        src={icon}
        alt=""
        title={title}
        width={48}
        height={48}
        loading="lazy"
      />
      <span className={cc([current == target && styles.done])}>
        {`${current || zero} / ${target || zero}`}
      </span>
    </li>
  );
}

function MaterialNeeds({ servant, data }: MaterialNeedsProps) {
  const materialsData = useMaterialList();
  const { qp, mats } = flattenServantNeeds(servant, data, materialsData);

  if (qp == 0 && mats.length == 0) return null;

  return (
    <>
      <h3>Needed Materials:</h3>
      <ul>
        {mats.map(({ id, amount }) => {
          const mat = materialsData[id];
          return (
            <BorderedIcon
              key={id}
              src={mat.icon}
              border={mat.rarity}
              title={mat.name}>
              x{amount}
            </BorderedIcon>
          );
        })}
        {qp > 0 && (
          <BorderedIcon
            src="https://static.atlasacademy.io/NA/Items/5.png"
            border="blue"
            title="QP">
            <span title={`${qp.toLocaleString()}`}>{formatLongNumber(qp)}</span>
          </BorderedIcon>
        )}
      </ul>
    </>
  );
}

export function ServantCard({ servant, idx, expanded, set }: ServantCardProps) {
  const user = useAccount()!;
  const servantsData = useServantsData();
  const servantData = servantsData[servant.id];
  const activeIcon = getAccountServantIcon(servant, servantData.icons, true);
  const [dialog, createDialog, showDialog] = useModal();
  const skillIcons =
    user.region == "na"
      ? servantData.skillsNA || servantData.skills
      : servantData.skills;

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
        <li className={cc(["section", styles.info])}>
          <h2>{servantData.name}</h2>
          <ul className={styles.infoStats}>
            <StatItem
              icon="https://static.atlasacademy.io/NA/Items/40.png"
              title="Ascension"
              current={servant.stats[ServantStat.ASCENSION_CURRENT]}
              target={servant.stats[ServantStat.ASCENSION_TARGET]}
            />
            <StatItem
              icon={getSkillIconUrl(skillIcons[0])}
              title="Skill 1"
              current={servant.stats[ServantStat.SKILL1_CURRENT]}
              target={servant.stats[ServantStat.SKILL1_TARGET]}
            />
            <StatItem
              icon={getSkillIconUrl(skillIcons[1])}
              title="Skill 2"
              current={servant.stats[ServantStat.SKILL2_CURRENT]}
              target={servant.stats[ServantStat.SKILL2_TARGET]}
            />
            <StatItem
              icon={getSkillIconUrl(skillIcons[2])}
              title="Skill 3"
              current={servant.stats[ServantStat.SKILL3_CURRENT]}
              target={servant.stats[ServantStat.SKILL3_TARGET]}
            />
            <StatItem
              icon={getSkillIconUrl(appendIcons[0])}
              title="Append Skill 1"
              current={servant.stats[ServantStat.APPEND1_CURRENT]}
              target={servant.stats[ServantStat.APPEND1_TARGET]}
              replaceZero
            />
            <StatItem
              icon={getSkillIconUrl(appendIcons[1])}
              title="Append Skill 2"
              current={servant.stats[ServantStat.APPEND2_CURRENT]}
              target={servant.stats[ServantStat.APPEND2_TARGET]}
              replaceZero
            />
            <StatItem
              icon={getSkillIconUrl(appendIcons[2])}
              title="Append Skill 3"
              current={servant.stats[ServantStat.APPEND3_CURRENT]}
              target={servant.stats[ServantStat.APPEND3_TARGET]}
              replaceZero
            />
          </ul>
          <MaterialNeeds servant={servant} data={servantData} />
          <ButtonRow>
            <IconButton
              className="primary"
              icon="less"
              onClick={() => set(undefined)}>
              Close
            </IconButton>
          </ButtonRow>
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
