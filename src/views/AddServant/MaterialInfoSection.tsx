import { useMaterialList } from "~/client/context";
import { BorderedIcon } from "~/components/BorderedIcon";
import type { WithChildren } from "~/components/jsx";
import type { EnhancementStage, ServantData } from "~/data/servants";
import { formatLongNumber } from "~/util/formatLongNumber";
import styles from "./MaterialInfoSection.module.css";

interface MaterialInfoRowProps extends WithChildren {
  stage: EnhancementStage;
}

interface MaterialInfoTableProps {
  stages: EnhancementStage[];
  levelOffset?: number;
}

interface MaterialInfoSectionProps {
  servant: ServantData;
}

function MaterialInfoRow({ stage, children }: MaterialInfoRowProps) {
  const materialsData = useMaterialList();

  return (
    <tr>
      <td>{children}</td>
      <td>
        {stage.items.map(([id, amount]) => {
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
        <BorderedIcon
          src="https://static.atlasacademy.io/NA/Items/5.png"
          border="blue"
          title="QP">
          <span title={`${stage.qp.toLocaleString()}`}>
            {formatLongNumber(stage.qp)}
          </span>
        </BorderedIcon>
      </td>
    </tr>
  );
}

function MaterialInfoTable({
  stages,
  levelOffset = 0
}: MaterialInfoTableProps) {
  return (
    <table>
      <tbody>
        {stages.map((stage, idx) => (
          <MaterialInfoRow key={idx} stage={stage}>
            {idx + levelOffset} &rarr; {idx + levelOffset + 1}
          </MaterialInfoRow>
        ))}
      </tbody>
    </table>
  );
}

export function MaterialInfoSection({ servant }: MaterialInfoSectionProps) {
  return (
    <section className="section">
      <h2>Materials used by {servant.name}</h2>
      <ul className={styles.grid}>
        <li>
          <h3>Ascension</h3>
          {servant.mats.ascension ? (
            <MaterialInfoTable stages={servant.mats.ascension} />
          ) : (
            `${servant.name} ${
              servant.id == 1
                ? "ascends through story progress."
                : // FIXME: Still how QP for welfares
                  "is a Welfare Servant who uses Event Items for ascension."
            }`
          )}
        </li>
        <li>
          <h3>Skills</h3>
          <MaterialInfoTable stages={servant.mats.skill} levelOffset={1} />
        </li>
        <li>
          <h3>Append Skills</h3>
          <MaterialInfoTable stages={servant.mats.append} levelOffset={1} />
        </li>
        {servant.mats.costume && servant.costumes && (
          <li>
            <h3>Costumes</h3>
            <table>
              <tbody>
                {Object.entries(servant.mats.costume).map(([id, stage]) => (
                  <MaterialInfoRow key={id} stage={stage}>
                    {servant.costumes![+id]}
                  </MaterialInfoRow>
                ))}
              </tbody>
            </table>
          </li>
        )}
      </ul>
    </section>
  );
}
