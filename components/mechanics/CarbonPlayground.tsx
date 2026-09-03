"use client";

import clsx from "clsx";
import type { DataSection, Task1Section } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import {
  annualEmissionsKg,
  residualValuePct,
  marginalSavingsKg,
  firstStepSavingsKg,
  isDiminishingReturns,
} from "@/lib/workBlock2";
import { C } from "@/components/visuals/palette";
import { exportFilename, printAsFile } from "@/lib/exportFilename";
import { PartA } from "@/components/mechanics/PartA";

/**
 * Work Block #2: hands-on with the Source lever Task already flagged as the
 * biggest carbon driver, scoped to the one office with a complete asset
 * register (Task's Control finding is why the rest of the fleet isn't
 * countable yet — see the locked toggle below). Two meters move in opposite
 * directions on purpose, so sliding to either extreme still costs something.
 */
export function CarbonPlayground({
  section,
  diagnosisSection,
}: {
  section: DataSection;
  diagnosisSection: Task1Section;
}) {
  const hydrated = useHydrated();
  const { config } = section;

  const cycleRaw = useProgress((s) => s.choices["workBlock2_cycle"]);
  const choose = useProgress((s) => s.choose);
  const cycle = hydrated && cycleRaw ? Number(cycleRaw) : config.cycleDefault;

  const cycleWhy = useProgress((s) => s.notes["workBlock2_cycleWhy"] ?? "");
  const gapNote = useProgress((s) => s.notes["workBlock2_gapNote"] ?? "");
  const setNote = useProgress((s) => s.setNote);
  const setPrintTarget = useProgress((s) => s.setPrintTarget);

  const emissions = annualEmissionsKg(config, cycle);
  const residual = residualValuePct(config, cycle);
  const maxEmissions = annualEmissionsKg(config, config.cycleMin);
  const marginal = marginalSavingsKg(config, cycle);
  const firstStep = firstStepSavingsKg(config);
  const diminishing = isDiminishingReturns(config, cycle);
  const atMax = cycle >= config.cycleMax - 1e-9;

  // How far each meter has moved from the cycle the learner landed on by
  // default — so the up/down swing reads at a glance, no mental arithmetic.
  const baselineLabel = `${config.cycleDefault.toFixed(1)} yrs`;
  const emissionsDelta = emissions - annualEmissionsKg(config, config.cycleDefault);
  const residualDelta = residual - residualValuePct(config, config.cycleDefault);
  const deltaLine = (delta: number, formatAbs: string) =>
    Math.abs(delta) < 0.05
      ? `Same as your starting point (${baselineLabel})`
      : `${delta > 0 ? "▲" : "▼"} ${formatAbs} ${section.startingPointLabel} (${baselineLabel})`;

  // Evenly spaced tick labels along the (now wider) range, always including
  // both ends, so a longer scale doesn't read as an empty bar.
  const tickCount = Math.min(5, Math.round((config.cycleMax - config.cycleMin) / config.cycleStep) + 1);
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const raw = config.cycleMin + ((config.cycleMax - config.cycleMin) * i) / (tickCount - 1);
    return Math.round(raw / config.cycleStep) * config.cycleStep;
  });

  const canExport = hydrated && cycleWhy.trim().length > 0 && gapNote.trim().length > 0;
  const learnerName = useProgress((s) => s.notes["learner:name"] ?? "");

  const exportReport = () => {
    setPrintTarget("data");
    printAsFile(exportFilename(learnerName, 2, section.taskLabel));
  };

  return (
    <div className="space-y-6">
      <PartA section={section} diagnosisSection={diagnosisSection} />

      <p className="text-caption font-semibold uppercase tracking-wide text-purple">
        {section.partBKicker}
      </p>

      {/* Slider */}
      <div className="card p-4">
        <label className="block">
          <span className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-h3 text-ink">Replacement cycle for this office</span>
            <span className="text-readout tabular-nums text-navy">{cycle.toFixed(1)} yrs</span>
          </span>
          <input
            type="range"
            min={config.cycleMin}
            max={config.cycleMax}
            step={config.cycleStep}
            value={cycle}
            onChange={(e) => choose("workBlock2_cycle", e.target.value)}
            className="mt-3 w-full accent-purple"
          />
          <div className="mt-1 flex justify-between text-caption text-ash">
            {ticks.map((t) => (
              <span key={t}>{t.toFixed(1)} yrs</span>
            ))}
          </div>
        </label>
        <p className="mt-2 text-caption text-ash">
          {config.office} · {config.unitsInOffice} units · {config.pcfPerUnitKg} kg CO₂e embodied carbon per unit ({config.pcfSource})
        </p>
      </div>

      {/* Two opposing meters */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Meter
          label="Annual embodied carbon"
          displayValue={`${Math.round(emissions).toLocaleString()} kg CO₂e/yr`}
          pct={maxEmissions > 0 ? (emissions / maxEmissions) * 100 : 0}
          color={C.source}
          delta={deltaLine(emissionsDelta, `${Math.round(Math.abs(emissionsDelta)).toLocaleString()} kg CO₂e/yr`)}
        />
        <Meter
          label="Residual value recovered"
          displayValue={`${residual.toFixed(0)}%`}
          pct={residual}
          color={C.cycle}
          delta={deltaLine(residualDelta, `${Math.abs(residualDelta).toFixed(0)} pts`)}
        />
      </div>
      <p className="text-caption text-ash">
        The two meters move in opposite directions on purpose — this is exploration, not a right-answer slider.
      </p>

      {/* Marginal savings: the same carbon meter, read as a rate of change,
          so the diminishing-returns pattern in 1 / cycle is felt directly. */}
      <div className="card p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-caption font-semibold uppercase tracking-wide text-ash">
            {section.marginalLabel}
          </p>
          <p className="text-h3 tabular-nums text-ink">
            {atMax ? "— (at the end of the range)" : `${Math.round(marginal).toLocaleString()} kg CO₂e/yr`}
          </p>
        </div>
        {!atMax && firstStep > 0 ? (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-lilac">
            <div
              className="h-full rounded-full bg-navy transition-[width] duration-200"
              style={{ width: `${Math.min(100, (marginal / firstStep) * 100)}%` }}
            />
          </div>
        ) : null}
        {diminishing ? (
          <div className="reveal-in mt-3 rounded-xl border-l-4 border-navy bg-lilac/50 p-3">
            <p className="text-body font-semibold text-navy">{section.diminishingLabel}</p>
            <p className="mt-1 text-caption text-ash">
              This step saved {Math.round(marginal).toLocaleString()} kg — the first half-year step
              saved {Math.round(firstStep).toLocaleString()} kg. {section.diminishingHelp}
            </p>
          </div>
        ) : null}
      </div>

      {/* Locked: the fleet-wide generalisation Task's Control finding blocks */}
      <div className="card p-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-line bg-lilac/40 text-ash"
          >
            <span className="text-caption font-bold">🔒</span>
          </span>
          <div>
            <p className="text-body font-semibold text-ash">{section.lockedLabel}</p>
            <p className="mt-1 text-caption text-ash">{section.lockedNote}</p>
          </div>
        </div>
      </div>

      {/* Justification — both required before export unlocks */}
      <div className="card space-y-4 p-4">
        <label className="block">
          <span className="mb-1 block text-caption font-semibold uppercase tracking-wide text-ash">
            {section.justification.cycleLabel}
          </span>
          <textarea
            value={hydrated ? cycleWhy : ""}
            onChange={(e) => setNote("workBlock2_cycleWhy", e.target.value)}
            rows={3}
            placeholder={section.justification.cyclePlaceholder}
            className="w-full resize-y rounded-xl border border-line bg-paper p-3 text-body text-ink placeholder:text-ash/70 focus:border-purple"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-caption font-semibold uppercase tracking-wide text-ash">
            {section.justification.gapLabel}
          </span>
          <textarea
            value={hydrated ? gapNote : ""}
            onChange={(e) => setNote("workBlock2_gapNote", e.target.value)}
            rows={3}
            placeholder={section.justification.gapPlaceholder}
            className="w-full resize-y rounded-xl border border-line bg-paper p-3 text-body text-ink placeholder:text-ash/70 focus:border-purple"
          />
        </label>

        <p className="text-caption text-ash">
          Exporting as:{" "}
          <span className="font-semibold text-ink">
            {hydrated && learnerName.trim() ? learnerName : "no name yet — add one at the top of the page"}
          </span>
        </p>

        <button
          type="button"
          disabled={!canExport}
          onClick={exportReport}
          className={clsx(
            "rounded-xl px-4 py-2 text-body font-semibold transition-colors duration-200",
            canExport
              ? "bg-navy text-paper hover:bg-purple"
              : "cursor-not-allowed bg-lilac text-ash",
          )}
        >
          {section.exportLabel}
        </button>
      </div>
    </div>
  );
}

function Meter({
  label,
  displayValue,
  pct,
  color,
  delta,
}: {
  label: string;
  displayValue: string;
  pct: number;
  color: string;
  /** How far this reads from the default cycle — spares the learner the arithmetic. */
  delta?: string;
}) {
  const width = Math.min(100, Math.max(0, pct));
  return (
    <div className="card p-4">
      <p className="text-caption font-semibold uppercase tracking-wide text-ash">{label}</p>
      <p className="mt-1 text-h2 tabular-nums text-ink">{displayValue}</p>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-lilac">
        <div
          className="h-full rounded-full transition-[width] duration-200"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      {delta ? <p className="mt-1.5 text-caption text-ash">{delta}</p> : null}
    </div>
  );
}
