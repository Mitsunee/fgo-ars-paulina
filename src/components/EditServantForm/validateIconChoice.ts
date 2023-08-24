import type { CostumeState } from "~/hooks/useCostumes";

export function validateIconChoice(
  choice: string | undefined,
  ascension: number,
  costumes?: DataMap<CostumeState>
) {
  if (!choice || ascension < 1) return;

  switch (choice) {
    case "1":
      return "1";
    case "2":
      if (ascension < 1) return;
      break;
    case "3":
      if (ascension < 3) return;
      break;
    case "4":
      if (ascension < 4) return;
      break;
    default:
      if (ascension < 4 || !costumes?.[+choice].state) return;
  }

  return choice;
}
