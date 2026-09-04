import type { WorkBlock2Config } from "./content";

/**
 * Annual manufacturing-embodied carbon for the office's fleet at a given
 * replacement cycle: shorter cycles rebuild the fleet more often, so the
 * embodied-carbon cost lands every year instead of every few.
 */
export function annualEmissionsKg(config: WorkBlock2Config, cycleYears: number): number {
  return (config.unitsInOffice / cycleYears) * config.pcfPerUnitKg;
}

/**
 * Placeholder linear model, not a market figure: residual value recovered
 * (% of purchase price) falls as the cycle lengthens, so the two meters
 * pull in opposite directions on purpose.
 */
export function residualValuePct(config: WorkBlock2Config, cycleYears: number): number {
  const span = config.cycleMax - config.cycleMin;
  const t = span === 0 ? 0 : (cycleYears - config.cycleMin) / span;
  return (
    config.residualAtMinCyclePct +
    t * (config.residualAtMaxCyclePct - config.residualAtMinCyclePct)
  );
}

/**
 * How much annual embodied carbon one more step of cycle length would save
 * from here — 1/cycle means this shrinks the further out the cycle already
 * is, which is the diminishing-returns curve itself, not an add-on to it.
 * 0 once there's no further step to take.
 */
export function marginalSavingsKg(config: WorkBlock2Config, cycleYears: number): number {
  const next = cycleYears + config.cycleStep;
  if (next > config.cycleMax + 1e-9) return 0;
  return annualEmissionsKg(config, cycleYears) - annualEmissionsKg(config, next);
}

/** The saving from the very first step (cycleMin -> cycleMin + step) — the yardstick everything else is measured against. */
export function firstStepSavingsKg(config: WorkBlock2Config): number {
  return annualEmissionsKg(config, config.cycleMin) - annualEmissionsKg(config, config.cycleMin + config.cycleStep);
}

/** True once the next step's saving has fallen below the configured share of the first step's saving. */
export function isDiminishingReturns(config: WorkBlock2Config, cycleYears: number): boolean {
  const first = firstStepSavingsKg(config);
  if (first <= 0) return false;
  return marginalSavingsKg(config, cycleYears) < first * (config.diminishingReturnsThresholdPct / 100);
}

// --- Part A: the hand-worked questions, and the checking logic behind them ---

/** Office B's total retired-laptop count — Model A and B units share the same cycle, so they retire together. */
export function officeBTotalUnits(config: WorkBlock2Config): number {
  return config.officeB.modelAUnits + config.officeB.modelBUnits;
}

/**
 * The five reference answers, computed from `config` — never a separate set
 * of numbers to keep in sync by hand. Q5 has no numeric answer (see
 * `isRefusal`/`containsNumber` below); this only covers Q1–Q4.
 */
export function computePartAAnswers(config: WorkBlock2Config): {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
} {
  const q1 = (config.unitsInOffice / config.partAQuizCycleYears) * config.pcfPerUnitKg;
  const q2 = q1 / 1000;
  const q3 =
    (config.officeB.modelAUnits / config.officeB.cycleYears) * config.pcfPerUnitKg +
    (config.officeB.modelBUnits / config.officeB.cycleYears) * config.modelBPcfPerUnitKg;
  const q4 = officeBTotalUnits(config) * (config.disposalLandfillKg - config.disposalRecyclerKg);
  return { q1, q2, q3, q4 };
}

const THOUSANDS_COMMA = /^-?\d{1,3}(,\d{3})+$/;
const THOUSANDS_DOT = /^-?\d{1,3}(\.\d{3})+$/;

/**
 * Parses a learner-typed number under either Indonesian ("4.966,67" — dot
 * thousands, comma decimal) or English ("4,966.67") formatting, plus the
 * plain single-separator forms each style shortens to on its own
 * ("4966,67", "4966.67", "7,000", "7.000"). When both separators appear,
 * whichever one appears last is the decimal point and the other is
 * thousands grouping to strip. With only one separator, it's thousands
 * grouping solely when it's followed by nothing but three-digit groups
 * ("7,000", "7.000") — otherwise it's read as the decimal point, so a
 * genuine decimal like "4966,67" is never mistaken for one.
 */
export function parseLearnerNumber(input: string): number {
  let s = input.trim();
  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  if (hasComma && hasDot) {
    s =
      s.lastIndexOf(",") > s.lastIndexOf(".")
        ? s.replace(/\./g, "").replace(",", ".")
        : s.replace(/,/g, "");
  } else if (hasComma && THOUSANDS_COMMA.test(s)) {
    s = s.replace(/,/g, "");
  } else if (hasComma) {
    s = s.replace(",", ".");
  } else if (hasDot && THOUSANDS_DOT.test(s)) {
    s = s.replace(/\./g, "");
  }

  return Number.parseFloat(s);
}

/**
 * Numeric-answer check: ±2% relative tolerance, comma or period accepted as
 * the decimal separator (or as thousands grouping — see `parseLearnerNumber`).
 * Empty or unparseable input is simply not correct yet — never flagged as a
 * hard wrong answer.
 */
export function withinTolerance(input: string, correct: number, tolerancePct = 2): boolean {
  const parsed = parseLearnerNumber(input);
  if (Number.isNaN(parsed)) return false;
  return Math.abs(parsed - correct) <= Math.abs(correct) * (tolerancePct / 100);
}

const REFUSAL_PATTERNS = [
  "cannot",
  "can't",
  "cant",
  "not enough",
  "insufficient",
  "missing",
  "don't know",
  "dont know",
  "no data",
  "unknown",
  "unable",
  "not possible",
  "not available",
  "n/a",
];

/** True when the free-text answer reads as a refusal to compute — Q5's actually-correct move. */
export function isRefusal(text: string): boolean {
  const t = text.toLowerCase();
  return REFUSAL_PATTERNS.some((p) => t.includes(p));
}

/** True when the free-text answer contains a digit — a specific-number attempt worth flagging, not blocking. */
export function containsNumber(text: string): boolean {
  return /\d/.test(text);
}

/**
 * Part A counts as done once Q1–Q4 are each within tolerance and Q5 has
 * something written — correctness of Q5 isn't required, only that it was
 * engaged with (a wrong extrapolation still surfaces the mistake, which is
 * the point).
 */
export function partAComplete(config: WorkBlock2Config, notes: Record<string, string>): boolean {
  const { q1, q2, q3, q4 } = computePartAAnswers(config);
  return (
    withinTolerance(notes["workBlock2_q1"] ?? "", q1) &&
    withinTolerance(notes["workBlock2_q2"] ?? "", q2) &&
    withinTolerance(notes["workBlock2_q3"] ?? "", q3) &&
    withinTolerance(notes["workBlock2_q4"] ?? "", q4) &&
    (notes["workBlock2_q5"] ?? "").trim().length > 0
  );
}
