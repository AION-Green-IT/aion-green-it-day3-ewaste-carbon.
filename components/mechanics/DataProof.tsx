"use client";

import clsx from "clsx";
import type { DataSection } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import { CarbonCompareDiagram } from "@/components/visuals/SectionDiagrams";

/**
 * Block 2: one office, one comparison. Deliberately not a calculator over
 * Nexora's full fleet — Task already established that data doesn't exist.
 * The scenario and its five inputs are fixed, not editable; the only thing
 * the learner produces is the sentence that carries the number into Nexora.
 */
export function DataProof({ section }: { section: DataSection }) {
  const hydrated = useHydrated();
  const { scenario } = section;

  const reps2 = scenario.windowYears / 2;
  const reps4 = scenario.windowYears / 4;
  const t2 = (scenario.units * scenario.pcfPerUnit * reps2) / 1000;
  const t4 = (scenario.units * scenario.pcfPerUnit * reps4) / 1000;
  const diff = t2 - t4;

  const checked = useProgress((s) => s.checks["data:d3"] ?? false);
  const note = useProgress((s) => s.notes["data:d3"] ?? "");
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);
  const isChecked = hydrated && checked;

  return (
    <div className="space-y-6">
      {/* The one scenario — fixed, not a sandbox */}
      <div className="card p-4">
        <p className="mb-3 text-caption font-semibold uppercase tracking-wide text-purple">
          The one office with complete records
        </p>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-caption text-ash">Office</dt>
            <dd className="text-body font-semibold text-ink">{scenario.office}</dd>
          </div>
          <div>
            <dt className="text-caption text-ash">Laptop model</dt>
            <dd className="text-body font-semibold text-ink">{scenario.model}</dd>
          </div>
          <div>
            <dt className="text-caption text-ash">Fleet at this office</dt>
            <dd className="text-body font-semibold text-ink">{scenario.units} units</dd>
          </div>
          <div>
            <dt className="text-caption text-ash">Embodied carbon per unit</dt>
            <dd className="text-body font-semibold text-ink">
              {scenario.pcfPerUnit} kg CO₂e
              <span className="ml-1 font-normal text-ash">({scenario.pcfSource})</span>
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-caption text-ash">{scenario.note}</p>
      </div>

      {/* The calculation table — five inputs, one formula, two totals */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse overflow-hidden rounded-2xl border border-line text-body">
          <thead>
            <tr className="bg-lilac/50 text-left text-caption uppercase tracking-wide text-ash">
              <th className="p-3 font-semibold">Cycle</th>
              <th className="p-3 font-semibold">
                Replacements in {scenario.windowYears} yrs
              </th>
              <th className="p-3 font-semibold">Embodied CO₂e</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line">
              <td className="p-3 text-ink">Every 2 years</td>
              <td className="p-3 tabular-nums text-ink">{reps2}</td>
              <td className="p-3 tabular-nums text-ink">
                {scenario.units} × {scenario.pcfPerUnit} kg × {reps2} = {t2.toFixed(1)} t
              </td>
            </tr>
            <tr className="border-t border-line">
              <td className="p-3 text-ink">Every 4 years</td>
              <td className="p-3 tabular-nums text-ink">{reps4}</td>
              <td className="p-3 tabular-nums text-ink">
                {scenario.units} × {scenario.pcfPerUnit} kg × {reps4} = {t4.toFixed(1)} t
              </td>
            </tr>
            <tr className="border-t border-line bg-lilac/30 font-semibold">
              <td className="p-3 text-navy" colSpan={2}>
                Difference over {scenario.windowYears} years
              </td>
              <td className="p-3 tabular-nums text-navy">{diff.toFixed(1)} t CO₂e</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mx-auto max-w-sm">
        <CarbonCompareDiagram
          office={scenario.office}
          units={scenario.units}
          pcfPerUnit={scenario.pcfPerUnit}
          windowYears={scenario.windowYears}
        />
      </div>

      <p className="rounded-xl border-l-4 border-navy bg-lilac/50 p-3 text-body text-navy">
        <span className="font-semibold">Why only one office: </span>
        {section.whyOnlyOneOffice}
      </p>

      {/* The output: the sentence that carries into Nexora's D3 */}
      <div
        className={clsx(
          "card p-4 transition-colors duration-200",
          isChecked && "border-good/40 bg-good/5",
        )}
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            aria-label={`Mark "${section.draft.label}" as drafted`}
            onClick={() => toggleCheck("data:d3", !checked)}
            className={clsx(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200",
              isChecked
                ? "border-good bg-good text-paper"
                : "border-line text-transparent hover:border-purple",
            )}
          >
            <span aria-hidden="true" className="text-caption font-bold">
              ✓
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-h3 text-ink">{section.draft.label}</p>
            <p className="mt-0.5 text-body text-ash">{section.draft.helper}</p>

            <label className="mt-3 block">
              <span className="sr-only">{section.draft.label}</span>
              <textarea
                value={hydrated ? note : ""}
                onChange={(e) => setNote("data:d3", e.target.value)}
                rows={3}
                placeholder={section.draft.placeholder}
                className="w-full resize-y rounded-xl border border-line bg-paper p-3 text-body text-ink placeholder:text-ash/70 focus:border-purple"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
