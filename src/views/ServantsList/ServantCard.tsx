import type { Dispatch } from "preact/hooks";
import { useMemo } from "preact/hooks";
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
import { changeRoute } from "~/client/router";
import { BorderedIcon } from "~/components/BorderedIcon";
import { ButtonRow } from "~/components/ButtonField";
import { IconButton } from "~/components/IconButton";
import { cc } from "~/components/jsx";
import { appendIcons } from "~/data/appendIcons";
import type { ServantData } from "~/data/servants";
import { useModal } from "~/hooks/useModal";
import { flattenServantNeeds } from "~/util/flattenServantNeeds";
import { formatLongNumber } from "~/util/formatLongNumber";
import { getServantIconUrl, getSkillIconUrl } from "~/util/urls";
import styles from "./ServantCard.module.css";

interface DetailsItemProps {
  title: string;
  icon: string;
  text: string;
  done?: boolean;
}

interface StatItemProps extends Pick<DetailsItemProps, "title" | "icon"> {
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

function DetailsItem({ title, icon, text, done }: DetailsItemProps) {
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
      <span className={cc([done && styles.done])}>{text}</span>
    </li>
  );
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
    <DetailsItem
      title={title}
      icon={icon}
      text={`${current || zero} / ${target || zero}`}
      done={current == target}
    />
  );
}

function MaterialNeeds({ servant, data }: MaterialNeedsProps) {
  const materialsData = useMaterialList();
  const { qp, mats } = flattenServantNeeds(servant, data, materialsData);

  if (qp == 0 && mats.length == 0) return null;

  return (
    <>
      <h3>Needed Materials</h3>
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

function labelCostumeState(state: null | undefined | boolean) {
  if (state === false) return "Planned";
  if (state) return "Done";
  return "Skipped";
}

export function ServantCard({ servant, idx, expanded, set }: ServantCardProps) {
  const user = useAccount()!;
  const servantsData = useServantsData();
  const servantData = servantsData[servant.id];
  const activeIcon = getAccountServantIcon(servant, servantData.icons, true);
  const [dialog, createDialog, showDialog] = useModal();
  const costumesShown = useMemo(
    () =>
      servantData.costumes
        ? (Object.keys(servantData.costumes) as IdKey[]).filter(
            id => id != "800140" && id != "800150"
          )
        : [],
    [servantData.costumes]
  );
  const skillIcons =
    user.region == "na"
      ? servantData.skillsNA || servantData.skills
      : servantData.skills;
  const hasAppends =
    servant.stats[ServantStat.APPEND1_TARGET] +
      servant.stats[ServantStat.APPEND2_TARGET] +
      servant.stats[ServantStat.APPEND3_TARGET] >
    0;
  const hasGrails = servant.stats[ServantStat.GRAIL_TARGET] > 0;

  return (
    <>
      <li className={cc([styles.card, expanded && styles.sel])}>
        <div className={styles.buttons}>
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
          <IconButton
            icon="edit"
            onClick={() =>
              changeRoute({ path: "edit-servant", props: { idx } })
            }
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
        </div>
        <img src={activeIcon} alt="" width={142} height={155} />
        <h2>{servantData.name}</h2>
        <span>
          <img
            src="https://static.atlasacademy.io/NA/Items/40.png"
            alt=""
            title="Ascension"
          />
          {servant.stats[ServantStat.ASCENSION_CURRENT]}
          {hasGrails && (
            <>
              {" | "}
              <img
                src="https://static.atlasacademy.io/NA/Items/7999.png"
                alt=""
                title="Grailing"
              />
              {servant.stats[ServantStat.GRAIL_CURRENT]}
            </>
          )}
        </span>
        <span>
          <img src="/assets/icon_skills.png" alt="" title="Skills" />
          {servant.stats[ServantStat.SKILL1_CURRENT]}
          {" / "}
          {servant.stats[ServantStat.SKILL2_CURRENT]}
          {" / "}
          {servant.stats[ServantStat.SKILL3_CURRENT]}
        </span>
        <span>
          <img src="/assets/icon_appends.png" alt="" title="Append Skills" />
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
            {hasGrails && (
              <StatItem
                icon="https://static.atlasacademy.io/NA/Items/7999.png"
                title="Grails"
                current={servant.stats[ServantStat.GRAIL_CURRENT]}
                target={servant.stats[ServantStat.GRAIL_TARGET]}
              />
            )}
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
            {hasAppends && (
              <>
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
              </>
            )}
          </ul>
          {costumesShown.length > 0 && (
            <>
              <h3>Costumes</h3>
              <ul className={styles.infoStats}>
                {costumesShown.map(id => (
                  <DetailsItem
                    key={id}
                    icon={getServantIconUrl(servantData.icons[id])}
                    title={servantData.costumes![id]}
                    text={labelCostumeState(servant.costume?.[id])}
                    done={!!servant.costume?.[id]}
                  />
                ))}
              </ul>
            </>
          )}
          <MaterialNeeds servant={servant} data={servantData} />
          <ButtonRow>
            <IconButton
              icon="edit"
              className="primary"
              onClick={() =>
                changeRoute({ path: "edit-servant", props: { idx } })
              }>
              Edit
            </IconButton>
            <IconButton icon="less" onClick={() => set(undefined)}>
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
