"use client";

import clsx from "clsx";
import type { DataSection, NexoraComponent, NexoraSection, Task1Section } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import { ArchitectureDiagram } from "@/components/visuals/SectionDiagrams";
import { Explainer } from "@/components/ui/Explainer";

export function StarterKit({
  section,
  diagnosisSection,
  dataSection,
}: {
  section: NexoraSection;
  /** The Task section whose diagnosis pick feeds in as this section's starting condition. */
  diagnosisSection: Task1Section;
  /** Block 2's scenario, so D3 has a number to quote instead of a guess. */
  dataSection: DataSection;
}) {
  const hydrated = useHydrated();
  const checks = useProgress((s) => s.checks);
  const addressed = hydrated
    ? section.components.filter((c) => checks[`nexora:${c.id}`]).length
    : 0;

  return (
    <div className="space-y-5">
      <DiagnosisCarryover section={diagnosisSection} />

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border-l-4 border-navy bg-lilac/50 p-4">
        <p className="flex-1 text-body text-navy">
          <span className="font-semibold">Senior bar: </span>
          {section.seniorNote}
        </p>
        <span className="rounded-full bg-navy px-3 py-1 text-caption font-semibold text-paper tabular-nums">
          {addressed} / {section.components.length} addressed
        </span>
      </div>

      <Explainer title="How the seven parts fit into one decision architecture">
        <div className="mx-auto max-w-lg">
          <ArchitectureDiagram components={section.components} />
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-caption text-ash">
          {section.architectureRelation}
        </p>
      </Explainer>

      <ol className="space-y-3">
        {section.components.map((c) => (
          <li key={c.id} className="space-y-3">
            {c.id === "n2" ? <DataCarryover section={dataSection} /> : null}
            <ComponentRow component={c} />
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-line p-4">
        <p className="mb-2 text-h3 text-ink">{section.reflection.title}</p>
        <ul className="space-y-2">
          {section.reflection.questions.map((q, i) => (
            <li key={i} className="flex gap-2 text-body text-ash">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple" />
              {q}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-caption text-ash">
        Your ticks and notes save on this device only — no account, nothing sent
        anywhere. &ldquo;Reset progress&rdquo; in the header clears them.
      </p>
    </div>
  );
}

function ComponentRow({ component }: { component: NexoraComponent }) {
  const hydrated = useHydrated();
  const key = `nexora:${component.id}`;
  const checked = useProgress((s) => s.checks[key] ?? false);
  const note = useProgress((s) => s.notes[key] ?? "");
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setNote = useProgress((s) => s.setNote);

  const isChecked = hydrated && checked;

  return (
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
          aria-label={`Mark "${component.title}" as addressed`}
          onClick={() => toggleCheck(key, !checked)}
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
          <p className="text-h3 text-ink">{component.title}</p>
          <p className="mt-0.5 text-body text-ash">{component.prompt}</p>

          <label className="mt-3 block">
            <span className="sr-only">Notes for {component.title}</span>
            <textarea
              value={hydrated ? note : ""}
              onChange={(e) => setNote(key, e.target.value)}
              rows={2}
              placeholder="Your line of reasoning…"
              className="w-full resize-y rounded-xl border border-line bg-paper p-3 text-body text-ink placeholder:text-ash/70 focus:border-purple"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

/**
 * Reads the weak-area finding from the Task section's diagnosis pick and
 * carries it in as this section's starting condition. Absent (no pick yet)
 * or wrong picks render nothing — only a confirmed finding is worth quoting
 * back, so the learner isn't anchored on a guess they've since abandoned.
 */
function DiagnosisCarryover({ section }: { section: Task1Section }) {
  const hydrated = useHydrated();
  const pickedCode = useProgress((s) => s.choices[section.id]);
  const picked = hydrated ? pickedCode : undefined;

  if (!picked || picked !== section.diagnosis.correct) return null;

  const area = section.categories.find((c) => c.code === picked);
  if (!area) return null;

  return (
    <div className="rounded-2xl border-l-4 border-purple bg-lilac/30 p-4">
      <p className="text-caption font-semibold uppercase tracking-wide text-purple">
        Carried in from Task
      </p>
      <p className="mt-1 text-body text-ink">
        Your diagnosis: <span className="font-semibold">{area.name}</span> is
        where Nexora is weakest — {area.blurb.toLowerCase()} Let that pressure-test
        which components below you push hardest.
      </p>
    </div>
  );
}

/**
 * Reads Block 2's fixed scenario and the learner's own saved D3 sentence, so
 * the number is sitting right above the field it must be quoted in. The
 * comparison is deterministic (same five inputs every time), so this shows
 * once the learner has ticked Block 2's draft as done — no correctness gate
 * needed, unlike the Task diagnosis.
 */
function DataCarryover({ section }: { section: DataSection }) {
  const hydrated = useHydrated();
  const done = useProgress((s) => s.checks["data:d3"] ?? false);
  const note = useProgress((s) => s.notes["data:d3"] ?? "");

  if (!hydrated || !done) return null;

  const { scenario } = section;
  const reps2 = scenario.windowYears / 2;
  const reps4 = scenario.windowYears / 4;
  const t2 = (scenario.units * scenario.pcfPerUnit * reps2) / 1000;
  const t4 = (scenario.units * scenario.pcfPerUnit * reps4) / 1000;
  const diff = t2 - t4;

  return (
    <div className="rounded-2xl border-l-4 border-purple bg-lilac/30 p-4">
      <p className="text-caption font-semibold uppercase tracking-wide text-purple">
        Carried in from Block 2
      </p>
      <p className="mt-1 text-body text-ink">
        Your number for D3:{" "}
        <span className="font-semibold">{diff.toFixed(1)} t CO₂e</span> over{" "}
        {scenario.windowYears} years at {scenario.office} (
        {scenario.units} units × {scenario.pcfPerUnit} kg CO₂e PCF, 2-year vs
        4-year cycle). Quote it — don&rsquo;t re-derive it.
      </p>
      {note ? (
        <p className="mt-2 rounded-xl border border-line bg-paper p-3 text-body text-ash">
          <span className="font-semibold text-ink">Your draft: </span>
          {note}
        </p>
      ) : null}
    </div>
  );
}
