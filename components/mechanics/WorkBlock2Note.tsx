"use client";

import { content, type DataSection } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import {
  annualEmissionsKg,
  residualValuePct,
  marginalSavingsKg,
  isDiminishingReturns,
} from "@/lib/workBlock2";

/**
 * The printable Work Block #2 report. Hidden on screen, shown only inside
 * `window.print()` and only when `printTarget === "data"` — several blocks
 * each keep a note like this mounted, and the target flag is what keeps one
 * export from dragging another block's page into the same print job.
 */
export function WorkBlock2Note({ section }: { section: DataSection }) {
  const hydrated = useHydrated();
  const printTarget = useProgress((s) => s.printTarget);
  const cycleRaw = useProgress((s) => s.choices["workBlock2_cycle"]);
  const cycleWhy = useProgress((s) => s.notes["workBlock2_cycleWhy"] ?? "");
  const gapNote = useProgress((s) => s.notes["workBlock2_gapNote"] ?? "");
  const name = useProgress((s) => s.notes["learner:name"] ?? "");

  if (printTarget !== "data") return null;

  const { config } = section;
  const cycle = hydrated && cycleRaw ? Number(cycleRaw) : config.cycleDefault;
  const midpoint = (config.cycleMin + config.cycleMax) / 2;
  const otherEnd = cycle <= midpoint ? config.cycleMax : config.cycleMin;

  const chosenEmissions = annualEmissionsKg(config, cycle);
  const otherEmissions = annualEmissionsKg(config, otherEnd);
  const chosenResidual = residualValuePct(config, cycle);
  const otherResidual = residualValuePct(config, otherEnd);
  const emissionsDiff = otherEmissions - chosenEmissions;
  const marginal = marginalSavingsKg(config, cycle);
  const diminishing = isDiminishingReturns(config, cycle);

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="print-note bg-paper p-8 text-ink">
      <p className="text-caption uppercase tracking-wide text-ash">
        {section.exportNote.watermark}
      </p>
      <h1 className="mt-1 text-h1 text-ink">{section.exportNote.heading}</h1>
      <p className="text-h3 text-ash">{section.exportNote.subheading}</p>
      <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1 text-caption text-ash">
        <p>
          {content.namePrompt.nameLabel}:{" "}
          <span className="font-semibold text-ink">
            {name || content.namePrompt.namePlaceholder}
          </span>
        </p>
        <p>
          Date: <span className="font-semibold text-ink">{today}</span>
        </p>
      </div>

      <h2 className="mb-2 mt-6 text-h3 text-navy">{section.exportNote.scopeTitle}</h2>
      <p className="text-body text-ink">
        {config.office} · {config.unitsInOffice} units · {config.pcfPerUnitKg} kg
        CO₂e embodied carbon per unit ({config.pcfSource}). Formula: annual
        embodied carbon = units ÷ cycle years × PCF per unit.
      </p>

      <h2 className="mb-2 mt-6 text-h3 text-navy">{section.exportNote.calcTitle}</h2>
      <table className="w-full border-collapse text-body">
        <thead>
          <tr className="bg-lilac/50 text-left text-caption uppercase tracking-wide text-ash">
            <th className="border border-line p-2">Cycle</th>
            <th className="border border-line p-2">Annual embodied carbon</th>
            <th className="border border-line p-2">Residual value recovered</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-line p-2">{cycle.toFixed(1)} yrs (recommended)</td>
            <td className="border border-line p-2">
              {Math.round(chosenEmissions).toLocaleString()} kg CO₂e/yr
            </td>
            <td className="border border-line p-2">{chosenResidual.toFixed(0)}%</td>
          </tr>
          <tr>
            <td className="border border-line p-2">{otherEnd.toFixed(1)} yrs</td>
            <td className="border border-line p-2">
              {Math.round(otherEmissions).toLocaleString()} kg CO₂e/yr
            </td>
            <td className="border border-line p-2">{otherResidual.toFixed(0)}%</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-3 text-body text-ink">
        At {cycle.toFixed(1)} years, {config.office} {emissionsDiff >= 0 ? "avoids" : "adds"}{" "}
        an estimated{" "}
        <span className="font-semibold">
          {Math.abs(Math.round(emissionsDiff)).toLocaleString()} kg CO₂e per year
        </span>{" "}
        compared with a {otherEnd.toFixed(1)}-year cycle.
      </p>
      {diminishing ? (
        <p className="mt-2 text-caption text-ash">
          {section.diminishingLabel}: one more half-year step from here would save only
          ~{Math.round(marginal).toLocaleString()} kg CO₂e/yr — a small fraction of the
          saving the first half-year step gave.
        </p>
      ) : null}

      <h2 className="mb-2 mt-6 text-h3 text-navy">{section.exportNote.justificationTitle}</h2>
      <p className="text-body font-semibold text-ink">{section.justification.cycleLabel}</p>
      <p className="text-body text-ash">{cycleWhy}</p>
      <p className="mt-3 text-body font-semibold text-ink">{section.justification.gapLabel}</p>
      <p className="text-body text-ash">{gapNote}</p>

      <p className="mt-6 rounded-xl border-l-4 border-navy bg-lilac/50 p-3 text-body text-navy">
        {section.exportNote.closingLine}
      </p>
    </div>
  );
}
