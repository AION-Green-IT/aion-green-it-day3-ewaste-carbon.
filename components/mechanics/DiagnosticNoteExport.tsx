"use client";

import type { RiskCategory, Task1Section } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import { QuadrantDiagram } from "@/components/visuals/SectionDiagrams";
import { liveQuadrantDots } from "@/lib/quadrant";

/**
 * The printable Block 1 deliverable: watermark, signal sort, priority
 * matrix and verdict, laid out as one page. Hidden on screen (`.print-note`
 * in globals.css) and shown only inside `window.print()`, reading live from
 * the same store as the interactive widgets so it's always the current
 * state — never a stale snapshot.
 */
export function DiagnosticNoteExport({ section }: { section: Task1Section }) {
  const hydrated = useHydrated();
  const printTarget = useProgress((s) => s.printTarget);
  const choices = useProgress((s) => s.choices);
  const name = useProgress((s) => s.notes["learner:name"] ?? "");

  if (printTarget !== "task1") return null;

  const byCode = Object.fromEntries(
    section.categories.map((c) => [c.code, c]),
  ) as Record<string, RiskCategory>;

  const dots = hydrated ? liveQuadrantDots(section.clues, choices, byCode) : [];
  const diagnosisPick = hydrated ? choices["task1"] : undefined;
  const diagnosisArea = diagnosisPick ? byCode[diagnosisPick] : undefined;
  const diagnosisCorrect = diagnosisPick === section.diagnosis.correct;
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

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-1 border-y border-line py-2 text-caption text-ash">
        <p>
          {section.exportNote.nameLabel}:{" "}
          <span className="font-semibold text-ink">
            {name || section.exportNote.namePlaceholder}
          </span>
        </p>
        <p>
          Date: <span className="font-semibold text-ink">{today}</span>
        </p>
      </div>

      <h2 className="mb-2 mt-6 text-h3 text-navy">{section.exportNote.signalSortTitle}</h2>
      <table className="w-full border-collapse text-body">
        <thead>
          <tr className="bg-lilac/50 text-left text-caption uppercase tracking-wide text-ash">
            <th className="border border-line p-2">Signal</th>
            <th className="border border-line p-2">Area</th>
          </tr>
        </thead>
        <tbody>
          {section.clues.map((clue, i) => {
            const cat = hydrated ? choices[`${clue.id}:category`] : undefined;
            return (
              <tr key={clue.id}>
                <td className="border border-line p-2">
                  {i + 1} · {clue.text}
                </td>
                <td className="border border-line p-2">
                  {cat ? byCode[cat]?.name : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="mb-2 mt-6 text-h3 text-navy">{section.exportNote.matrixTitle}</h2>
      <div className="mx-auto max-w-sm">
        <QuadrantDiagram
          dots={dots}
          xLabel={section.quadrant.xLabel}
          yLabel={section.quadrant.yLabel}
          zoneLabels={section.quadrant.zoneLabels}
        />
      </div>

      <h2 className="mb-2 mt-6 text-h3 text-navy">{section.exportNote.verdictTitle}</h2>
      {diagnosisArea ? (
        <>
          <p className="text-h3 text-ink">{diagnosisArea.name}.</p>
          <p className="mt-1 text-body text-ash">
            {diagnosisCorrect
              ? section.diagnosis.correctVerdict
              : section.diagnosis.incorrectVerdict}
          </p>
        </>
      ) : (
        <p className="text-body text-ash">{section.exportNote.notCompleted}</p>
      )}
    </div>
  );
}
