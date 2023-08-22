import ClassName from "@atlasacademy/api-connector/dist/Enum/ClassName.js";
import type { ServantWithLore } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { ServantNameOverrides } from "~/data/servantNameOverrides";

/**
 * Maps ClassName of Servant to name as string
 * @param className class of Servant
 * @returns string
 */
export function nameServantClass(className: ClassName): string {
  switch (className) {
    case ClassName.ALTER_EGO:
      return "Alter Ego";
    case ClassName.MOON_CANCER:
      return "Moon Cancer";
    default:
      return className.replace(/^\w/, c => c.toUpperCase());
  }
}

function stripClassSuffix(name: string): string {
  return name
    .replace(
      / \((?:Saber|Archer|Lancer|Rider|Caster|Assassin|Berserker|Ruler|Avenger|Moon Cancer|Alter(?: |-)Ego|Foreigner|Pretender)\)/i,
      "" // dunno if there's a nicer way to do this
    )
    .replace(/ Alter/, " (Alter)")
    .trim()
    .replace(/ {2,}/g, " ");
}

const baseNameCache = new Map<number, string>();

/**
 * Memoized method to get spoilersafe name of Servant without class suffix and parenthesizes "Alter" suffix
 *
 * For example this will turn "Altria Pendragon Alter (Lancer)" into "Altria Pendragon (Alter)"
 *
 * @param servant Servant object from API
 * @returns string
 */
function getBaseName(servant: ServantWithLore) {
  let cached = baseNameCache.get(servant.id);

  if (!cached) {
    cached = stripClassSuffix(
      servant.ascensionAdd?.overWriteServantName?.ascension?.["0"] ||
        servant.name
    );
    baseNameCache.set(servant.id, cached);
  }

  return cached;
}

function decorateServantName(servant: ServantWithLore) {
  const baseName = getBaseName(servant);
  const className = nameServantClass(servant.className);

  if (baseName.includes("(Alter)")) {
    return baseName.replace("(Alter)", `(${className} Alter)`);
  }

  return `${baseName} (${className})`;
}

export async function generateServantNameList(
  servantList: ServantWithLore[],
  servantListNA: ServantWithLore[],
  overrides: ServantNameOverrides
) {
  // generate base name record
  for (const servant of servantList) {
    const servantNA = servantListNA.find(
      servantNA => servantNA.id == servant.id
    );
    getBaseName(servantNA || servant);
  }

  // count appearances from cache
  const baseNameAppearances = Array.from(baseNameCache.values()).reduce<
    Record<string, number>
  >((map, name) => {
    map[name] = (map[name] || 0) + 1;
    return map;
  }, {});

  // generate nice name record
  const names: Record<number, string> = {};
  for (const servant of servantList) {
    const servantNA = servantListNA.find(
      servantNA => servantNA.id == servant.id
    );
    const defaultName: string = servantNA?.name || servant.name;
    const override = overrides[servant.id];
    let servantName: string;

    // check if override exists
    if (override) {
      servantName = override;
    } else {
      // check if base name is duplicated
      const baseName = getBaseName(servant); // no need to get NA servant again as all names are cached now
      let isDuplicated = baseNameAppearances[baseName] > 1;

      // also check if an Alter (or similar) exists.
      // Shoutouts to Lizzy who makes up a new name each time lol
      isDuplicated ||=
        Object.keys(baseNameAppearances).filter(name =>
          name.startsWith(`${baseName} (`)
        ).length > 0;

      // use decorate method is duplicates exist
      servantName = isDuplicated ? decorateServantName(servant) : baseName;
    }

    // commit name if different from data
    if (servantName != defaultName) {
      names[servant.id] = servantName;
    }
  }

  return names;
}
