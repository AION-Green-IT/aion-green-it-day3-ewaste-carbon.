import type { Clue, RiskCategory } from "./content";

export type Dot = {
  id: string;
  label: string;
  x: "low" | "high";
  y: "low" | "high" | "either";
  color: string;
};

/**
 * The learner's own priority-matrix dots — one per signal whose category and
 * both follow-up toggles are all answered. Shared between the interactive
 * widget and the printable note so they never drift apart.
 */
export function liveQuadrantDots(
  clues: Clue[],
  choices: Record<string, string>,
  byCode: Record<string, RiskCategory>,
): Dot[] {
  return clues.flatMap((clue, i) => {
    const cat = choices[`${clue.id}:category`];
    const carbon = choices[`${clue.id}:carbon`];
    const readiness = choices[`${clue.id}:readiness`];
    if (
      !cat ||
      (carbon !== "low" && carbon !== "high") ||
      (readiness !== "low" && readiness !== "high")
    ) {
      return [];
    }
    return [{ id: clue.id, label: String(i + 1), x: carbon, y: readiness, color: byCode[cat]?.hex ?? "#999" }];
  });
}

/** The answer-key dots, always fully populated — revealed only at the debrief. */
export function modelQuadrantDots(clues: Clue[], byCode: Record<string, RiskCategory>): Dot[] {
  return clues.map((clue, i) => ({
    id: clue.id,
    label: String(i + 1),
    x: clue.modelCarbon === "high" ? "high" : "low",
    y: clue.modelReadiness,
    color: byCode[clue.answer].hex,
  }));
}

/** True once every signal has both follow-up toggles answered. */
export function allToggled(clues: Clue[], choices: Record<string, string>): boolean {
  return clues.every(
    (clue) => choices[`${clue.id}:carbon`] && choices[`${clue.id}:readiness`],
  );
}
