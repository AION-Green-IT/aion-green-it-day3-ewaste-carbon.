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
