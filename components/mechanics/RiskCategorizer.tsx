"use client";

import clsx from "clsx";
import type { Clue, QuadrantCopy, RiskCategory, Task1Section } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import { AreasLifecycleDiagram, QuadrantDiagram } from "@/components/visuals/SectionDiagrams";
import { Explainer } from "@/components/ui/Explainer";
import {
  allToggled as computeAllToggled,
  liveQuadrantDots,
  modelQuadrantDots,
} from "@/lib/quadrant";
import { exportFilename, printAsFile } from "@/lib/exportFilename";

export function RiskCategorizer({ section }: { section: Task1Section }) {
  const byCode = Object.fromEntries(
    section.categories.map((c) => [c.code, c]),
  ) as Record<string, RiskCategory>;

  // Bumped by the section's "sort these again" button. Keying the list on it
  // remounts every row, so revealed answers clear with the stored picks.
  const round = useProgress((s) => s.sectionResets[section.id] ?? 0);

  // The diagnosis only makes sense once every signal has been weighed —
  // gate it behind having sorted them all first.
  const hydrated = useHydrated();
  const seenCount = useProgress((s) => (s.seen[section.id] ?? []).length);
  const allSorted = hydrated && seenCount >= section.clues.length;

  // The priority matrix: a dot per signal, plotted the moment its two
  // follow-up toggles are both answered. Colour follows whichever area the
  // learner actually picked for that signal — their read, not the answer key.
  const choices = useProgress((s) => s.choices);
  const choose = useProgress((s) => s.choose);
  const liveDots = hydrated ? liveQuadrantDots(section.clues, choices, byCode) : [];
  const modelDots = modelQuadrantDots(section.clues, byCode);
  const allToggled = hydrated && computeAllToggled(section.clues, choices);
  const compared = hydrated && choices["task1:compared"] === "yes";

  return (
    <div className="space-y-6">
      {/* Explainer: the three areas as one device life, so a solo learner can
          reason about where a clue belongs before sorting. Tidy by default. */}
      <Explainer title="How the three areas relate along a device's life">
        <div className="mx-auto max-w-xl">
          <AreasLifecycleDiagram />
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-caption text-ash">
          {section.areasRelation}
        </p>
      </Explainer>

      {/* Legend: the three areas, described but not ranked. */}
      <div className="grid gap-3 sm:grid-cols-3">
        {section.categories.map((cat) => (
          <div
            key={cat.code}
            className="rounded-2xl border border-line p-3"
            style={{ borderTopColor: cat.hex, borderTopWidth: 3 }}
          >
            <p className="text-h3 text-ink">{cat.name}</p>
            <p className="mt-1 text-caption text-ash">{cat.blurb}</p>
          </div>
        ))}
      </div>

      <ol key={`clues-${round}`} className="space-y-3">
        {section.clues.map((clue, i) => (
          <ClueRow
            key={clue.id}
            clue={clue}
            index={i}
            categories={section.categories}
            byCode={byCode}
            quadrant={section.quadrant}
          />
        ))}
      </ol>

      {/* Live priority matrix — persistent, fills in as toggles are answered. */}
      <div key={`matrix-${round}`} className="card p-4">
        <p className="text-h3 text-ink">{section.quadrant.title}</p>
        <p className="mt-1 text-body text-ash">{section.quadrant.intro}</p>
        <div className="mx-auto mt-3 max-w-sm">
          <QuadrantDiagram
            dots={liveDots}
            xLabel={section.quadrant.xLabel}
            yLabel={section.quadrant.yLabel}
            zoneLabels={section.quadrant.zoneLabels}
          />
        </div>
      </div>

      {allSorted ? (
        <DiagnosisPicker key={`diagnosis-${round}`} section={section} />
      ) : null}

      {/* Debrief: the model matrix only appears once every signal is fully
          weighed, and only after the learner actively asks to compare. */}
      <div key={`compare-${round}`} className="card border-l-4 border-purple p-4">
        <p className="text-h3 text-ink">{section.quadrant.compareLabel}</p>
        {!allToggled ? (
          <p className="mt-2 text-body text-ash">{section.quadrant.compareLocked}</p>
        ) : !compared ? (
          <button
            type="button"
            onClick={() => choose("task1:compared", "yes")}
            className="mt-3 rounded-xl bg-purple px-4 py-2 text-body font-semibold text-paper transition-colors duration-200 hover:bg-navy"
          >
            {section.quadrant.compareLabel}
          </button>
        ) : (
          <div className="reveal-in mt-3 space-y-4">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-center text-caption font-semibold uppercase tracking-wide text-ash">
                  {section.quadrant.yourTitle}
                </p>
                <QuadrantDiagram
                  dots={liveDots}
                  xLabel={section.quadrant.xLabel}
                  yLabel={section.quadrant.yLabel}
                  zoneLabels={section.quadrant.zoneLabels}
                />
              </div>
              <div>
                <p className="mb-2 text-center text-caption font-semibold uppercase tracking-wide text-purple">
                  {section.quadrant.modelTitle}
                </p>
                <QuadrantDiagram
                  dots={modelDots}
                  xLabel={section.quadrant.xLabel}
                  yLabel={section.quadrant.yLabel}
                  zoneLabels={section.quadrant.zoneLabels}
                />
              </div>
            </div>
            <p className="text-caption text-ash">{section.quadrant.eitherNote}</p>
            <p className="rounded-xl border-l-4 border-navy bg-lilac/50 p-3 text-body text-navy">
              {section.quadrant.modelInsight}
            </p>
          </div>
        )}
      </div>

      <ExportControls section={section} />
    </div>
  );
}

function ClueRow({
  clue,
  index,
  categories,
  byCode,
  quadrant,
}: {
  clue: Clue;
  index: number;
  categories: RiskCategory[];
  byCode: Record<string, RiskCategory>;
  quadrant: QuadrantCopy;
}) {
  const hydrated = useHydrated();
  const markSeen = useProgress((s) => s.markSeen);
  const choose = useProgress((s) => s.choose);
  const chosenCode = useProgress((s) => s.choices[`${clue.id}:category`]) ?? null;
  const carbon = useProgress((s) => s.choices[`${clue.id}:carbon`]) ?? null;
  const readiness = useProgress((s) => s.choices[`${clue.id}:readiness`]) ?? null;
  const chosen = hydrated ? chosenCode : null;
  const revealed = chosen !== null;
  const answer = byCode[clue.answer];
  const matched = chosen === clue.answer;

  const pick = (code: string) => {
    if (revealed) return;
    choose(`${clue.id}:category`, code);
    markSeen("task1", clue.id);
  };

  return (
    <li className="card p-4">
      <div className="flex gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-caption font-semibold text-paper">
          {index + 1}
        </span>
        <p className="flex-1 text-body text-ink">{clue.text}</p>
      </div>

      {!revealed ? (
        <div className="mt-3 pl-9">
          <p className="mb-2 text-caption text-ash">
            Which area does this sit in? Nothing is scored.
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.code}
                type="button"
                onClick={() => pick(cat.code)}
                className="rounded-xl border border-line px-3 py-1.5 text-body text-navy transition-colors duration-200 hover:bg-lilac hover:underline"
                style={{ borderLeft: `3px solid ${cat.hex}` }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="reveal-in mt-3 space-y-3 pl-9">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-caption font-semibold text-paper"
              style={{ backgroundColor: answer.hex }}
            >
              {answer.name}
            </span>
            <span
              className={clsx(
                "rounded-full border px-3 py-1 text-caption",
                matched
                  ? "border-good/40 bg-good/10 text-good"
                  : "border-line bg-lilac/40 text-ash",
              )}
            >
              {matched
                ? "Same area you picked"
                : `You put it in ${byCode[chosen!].name} — both readings are worth hearing`}
            </span>
          </div>

          <p className="text-body text-ink">{clue.explain}</p>

          <p className="rounded-xl border-l-4 border-navy bg-lilac/50 p-3 text-body text-navy">
            <span className="font-semibold">Why this matters: </span>
            {clue.why}
          </p>

          <div className="space-y-2.5 border-t border-line pt-3">
            <ToggleQuestion
              question={quadrant.carbonQuestion}
              lowLabel={quadrant.low}
              highLabel={quadrant.high}
              value={hydrated ? (carbon as "low" | "high" | null) : null}
              onPick={(v) => choose(`${clue.id}:carbon`, v)}
            />
            <ToggleQuestion
              question={quadrant.readinessQuestion}
              lowLabel={quadrant.low}
              highLabel={quadrant.high}
              value={hydrated ? (readiness as "low" | "high" | null) : null}
              onPick={(v) => choose(`${clue.id}:readiness`, v)}
            />
          </div>
        </div>
      )}
    </li>
  );
}

/** One Low/High follow-up question. Never marked right or wrong — matches
 *  the "nothing is scored" sort above it. */
function ToggleQuestion({
  question,
  lowLabel,
  highLabel,
  value,
  onPick,
}: {
  question: string;
  lowLabel: string;
  highLabel: string;
  value: "low" | "high" | null;
  onPick: (value: "low" | "high") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="min-w-[200px] flex-1 text-caption text-ash">{question}</p>
      <div className="flex gap-1.5">
        {(["low", "high"] as const).map((lvl) => (
          <button
            key={lvl}
            type="button"
            aria-pressed={value === lvl}
            onClick={() => onPick(lvl)}
            className={clsx(
              "rounded-lg border px-3 py-1 text-caption font-semibold transition-colors duration-200",
              value === lvl
                ? "border-purple bg-purple text-paper"
                : "border-line text-navy hover:bg-lilac",
            )}
          >
            {lvl === "low" ? lowLabel : highLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The synthesis step: name the one area the evidence actually points to.
 * Unlike the clue sort above, this has a real answer — it's the finding that
 * gets carried forward as input into the next task. Re-pickable, so a wrong
 * guess is a lead to follow rather than a dead end.
 */
function DiagnosisPicker({ section }: { section: Task1Section }) {
  const hydrated = useHydrated();
  const pickedCode = useProgress((s) => s.choices[section.id]) ?? null;
  const choose = useProgress((s) => s.choose);
  const picked = hydrated ? pickedCode : null;
  const correct = picked === section.diagnosis.correct;

  return (
    <div className="reveal-in card border-l-4 border-purple p-4">
      <p className="mb-3 text-body font-semibold text-ink">
        {section.diagnosis.prompt}
      </p>

      <div className="flex flex-wrap gap-2">
        {section.categories.map((cat) => (
          <button
            key={cat.code}
            type="button"
            aria-pressed={picked === cat.code}
            onClick={() => choose(section.id, cat.code)}
            className={clsx(
              "rounded-xl border px-3 py-1.5 text-body transition-colors duration-200",
              picked === cat.code
                ? "border-purple bg-purple text-paper"
                : "border-line text-navy hover:bg-lilac",
              picked !== null && picked !== cat.code && "opacity-60",
            )}
            style={
              picked === cat.code
                ? undefined
                : { borderLeft: `3px solid ${cat.hex}` }
            }
          >
            {cat.name}
          </button>
        ))}
      </div>

      {picked ? (
        <div className="reveal-in mt-4 space-y-2">
          <span
            className={clsx(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-caption font-semibold",
              correct
                ? "bg-good/10 text-good"
                : "border border-line bg-lilac/40 text-ash",
            )}
          >
            {correct ? "That's the one — carried forward" : "Not the core gap — try another area"}
          </span>
          <p className="text-body text-ink">
            {correct
              ? section.diagnosis.correctVerdict
              : section.diagnosis.incorrectVerdict}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/**
 * On-screen only (the printable note itself lives in DiagnosticNoteExport,
 * rendered separately so it can escape the normal page's print:hidden
 * wrapper). A name field plus a button that hands off to the browser's own
 * print dialog — "Save as PDF" needs no library and nothing leaves the
 * device.
 */
function ExportControls({ section }: { section: Task1Section }) {
  const hydrated = useHydrated();
  const setPrintTarget = useProgress((s) => s.setPrintTarget);
  const name = useProgress((s) => s.notes["learner:name"] ?? "");

  const exportNote = () => {
    setPrintTarget("task1");
    printAsFile(exportFilename(name, 1, section.exportNote.taskLabel));
  };

  return (
    <div className="card p-4">
      <p className="text-h3 text-ink">{section.exportNote.controlsTitle}</p>
      <p className="mt-1 text-body text-ash">{section.exportNote.controlsIntro}</p>
      <p className="mt-2 text-caption text-ash">
        Exporting as:{" "}
        <span className="font-semibold text-ink">
          {hydrated && name.trim() ? name : "no name yet — add one at the top of the page"}
        </span>
      </p>

      <button
        type="button"
        onClick={exportNote}
        className="mt-4 rounded-xl bg-navy px-4 py-2 text-body font-semibold text-paper transition-colors duration-200 hover:bg-purple"
      >
        {section.exportNote.exportLabel}
      </button>
    </div>
  );
}
