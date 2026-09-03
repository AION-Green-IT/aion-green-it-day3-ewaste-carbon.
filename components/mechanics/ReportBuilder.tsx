"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type {
  DataSection,
  NexoraComponent,
  NexoraSection,
  ReportReferenceKind,
  Task1Section,
} from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import { annualEmissionsKg } from "@/lib/workBlock2";
import { ArchitectureDiagram } from "@/components/visuals/SectionDiagrams";
import { Explainer } from "@/components/ui/Explainer";
import { Collapsible } from "@/components/ui/Collapsible";
import { MemoDocument, type MemoSection } from "@/components/mechanics/MemoDocument";
import { exportFilename, printAsFile } from "@/lib/exportFilename";

/**
 * Work Block #3, guided: a split-screen "Report Builder" over the same
 * 7-field data the old flat form used (`notes["nexora:n1..n7"]`, unchanged
 * keys) plus three new memo-header fields (`nexora:to/from/subject`) and a
 * per-step "clue opened" flag (`checks["nexora:clue:n{id}"]`), all under the
 * existing `nexora:` key family so nothing already saved is lost.
 *
 * Memo reading order vs. site component numbers (the only place these two
 * orders are translated — reorder here, never renumber content.day3.json):
 *   memo 1 -> n1  Strategic relevance
 *   memo 2 -> n2  Three core decisions
 *   memo 3 -> n7  Decide now, despite gaps
 *   memo 4 -> n5  First-step path
 *   memo 5 -> n3  Prioritisation logic
 *   memo 6 -> n4  Main goal conflicts
 *   memo 7 -> n6  Responsibility, data flows, review
 */
const MEMO_ORDER = ["n1", "n2", "n7", "n5", "n3", "n4", "n6"];

const stripNumber = (title: string) => title.replace(/^\d+\s*·\s*/, "");

export function ReportBuilder({
  section,
  diagnosisSection,
  dataSection,
}: {
  section: NexoraSection;
  diagnosisSection: Task1Section;
  dataSection: DataSection;
}) {
  const hydrated = useHydrated();
  const { reportBuilder: rb } = section;

  const byId = Object.fromEntries(section.components.map((c) => [c.id, c])) as Record<
    string,
    NexoraComponent
  >;
  const stepByComponentId = Object.fromEntries(rb.steps.map((s) => [s.componentId, s]));
  const orderedComponents = MEMO_ORDER.map((id) => byId[id]);

  const notes = useProgress((s) => s.notes);
  const checks = useProgress((s) => s.checks);
  const setNote = useProgress((s) => s.setNote);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const setPrintTarget = useProgress((s) => s.setPrintTarget);

  const to = hydrated ? notes["nexora:to"] ?? "" : "";
  const from = hydrated ? notes["nexora:from"] ?? "" : "";
  const subject = hydrated ? notes["nexora:subject"] ?? "" : "";
  const headerDone = to.trim() && from.trim() && subject.trim();

  const [currentStep, setCurrentStep] = useState(0);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (!justSavedId) return;
    const t = setTimeout(() => setJustSavedId(null), 1200);
    return () => clearTimeout(t);
  }, [justSavedId]);

  const go = (step: number, savedId: string | null) => {
    if (savedId) setJustSavedId(savedId);
    setCurrentStep(Math.max(0, Math.min(7, step)));
  };

  const allDone =
    !!headerDone &&
    orderedComponents.every((c) => (notes[`nexora:${c.id}`] ?? "").trim().length > 0);

  const learnerName = useProgress((s) => s.notes["learner:name"] ?? "");

  const exportMemo = () => {
    setPrintTarget("nexora");
    printAsFile(exportFilename(learnerName, 3, rb.taskLabel));
  };

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const memoSections: MemoSection[] = orderedComponents.map((c) => {
    const text = hydrated ? notes[`nexora:${c.id}`] ?? "" : "";
    return { id: c.id, heading: stripNumber(c.title), text, empty: text.trim().length === 0 };
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border-l-4 border-navy bg-lilac/50 p-4">
        <p className="flex-1 text-body text-navy">
          <span className="font-semibold">Senior bar: </span>
          {section.seniorNote}
        </p>
      </div>

      <Explainer title="How the seven parts fit into one decision architecture">
        <div className="mx-auto max-w-lg">
          <ArchitectureDiagram components={section.components} />
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-caption text-ash">
          {section.architectureRelation}
        </p>
      </Explainer>

      {/* Breadcrumb — every step stays clickable, nothing locks once passed. */}
      <div className="flex flex-wrap gap-2">
        <StepDot
          label="Memo header"
          active={currentStep === 0}
          done={!!headerDone}
          onClick={() => go(0, null)}
        >
          H
        </StepDot>
        {orderedComponents.map((c, i) => {
          const done = hydrated && (notes[`nexora:${c.id}`] ?? "").trim().length > 0;
          return (
            <StepDot
              key={c.id}
              label={stripNumber(c.title)}
              active={currentStep === i + 1}
              done={done}
              onClick={() => go(i + 1, null)}
            >
              {i + 1}
            </StepDot>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Left pane: one question at a time */}
        <div className="card space-y-4 p-5">
          {currentStep === 0 ? (
            <HeaderStep rb={rb} to={to} from={from} subject={subject} setNote={setNote} hydrated={hydrated} />
          ) : (
            <StepPane
              component={orderedComponents[currentStep - 1]}
              step={stepByComponentId[orderedComponents[currentStep - 1].id]}
              rb={rb}
              diagnosisSection={diagnosisSection}
              dataSection={dataSection}
              hydrated={hydrated}
              notes={notes}
              checks={checks}
              setNote={setNote}
              toggleCheck={toggleCheck}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => go(currentStep - 1, null)}
              disabled={currentStep === 0}
              className={clsx(
                "rounded-xl border border-line px-4 py-2 text-body font-semibold transition-colors duration-200",
                currentStep === 0
                  ? "cursor-not-allowed text-ash/50"
                  : "text-navy hover:bg-lilac",
              )}
            >
              ← Back
            </button>

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={() =>
                  go(
                    currentStep + 1,
                    currentStep === 0 ? null : orderedComponents[currentStep - 1].id,
                  )
                }
                className="rounded-xl bg-navy px-4 py-2 text-body font-semibold text-paper transition-colors duration-200 hover:bg-purple"
              >
                Next →
              </button>
            ) : (
              <span className="text-caption text-ash">Last step — export below once ready</span>
            )}
          </div>
        </div>

        {/* Right pane: the live document */}
        <div className="lg:sticky lg:top-28">
          <MemoDocument
            docTitle={rb.docTitle}
            to={to}
            from={from}
            date={today}
            subject={subject}
            toPlaceholder={rb.header.toPlaceholder}
            fromPlaceholder={rb.header.fromPlaceholder}
            subjectPlaceholder={rb.header.subjectPlaceholder}
            sections={memoSections}
            highlightId={justSavedId}
          />
        </div>
      </div>

      {allDone ? (
        <div className="reveal-in space-y-3 rounded-2xl border-l-4 border-purple bg-lilac/30 p-4">
          <p className="text-body font-semibold text-navy">{rb.closingLine}</p>
          <p className="text-caption text-ash">
            Exporting as:{" "}
            <span className="font-semibold text-ink">
              {hydrated && learnerName.trim() ? learnerName : "no name yet — add one at the top of the page"}
            </span>
          </p>
          <button
            type="button"
            onClick={exportMemo}
            className="rounded-xl bg-navy px-4 py-2 text-body font-semibold text-paper transition-colors duration-200 hover:bg-purple"
          >
            {rb.exportLabel}
          </button>
        </div>
      ) : (
        <p className="text-caption text-ash">
          {rb.exportLabel} unlocks once the memo header and all seven steps have something written.
        </p>
      )}

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
        Your answers save on this device only — no account, nothing sent anywhere.
        &ldquo;Reset progress&rdquo; in the header clears them.
      </p>
    </div>
  );
}

function StepDot({
  children,
  label,
  active,
  done,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active}
      title={label}
      className={clsx(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-caption font-semibold transition-colors duration-200",
        active
          ? "bg-navy text-paper"
          : done
            ? "bg-good/15 text-good hover:bg-good/25"
            : "border border-line text-ash hover:bg-lilac",
      )}
    >
      {children}
    </button>
  );
}

function HeaderStep({
  rb,
  to,
  from,
  subject,
  setNote,
  hydrated,
}: {
  rb: NexoraSection["reportBuilder"];
  to: string;
  from: string;
  subject: string;
  setNote: (key: string, text: string) => void;
  hydrated: boolean;
}) {
  return (
    <div className="space-y-4">
      <p className="text-caption font-semibold uppercase tracking-wide text-purple">
        {rb.header.title}
      </p>
      <FieldRow
        label={rb.header.toLabel}
        caption={rb.header.toCaption}
        placeholder={rb.header.toPlaceholder}
        value={hydrated ? to : ""}
        onChange={(v) => setNote("nexora:to", v)}
      />
      <FieldRow
        label={rb.header.fromLabel}
        caption={rb.header.fromCaption}
        placeholder={rb.header.fromPlaceholder}
        value={hydrated ? from : ""}
        onChange={(v) => setNote("nexora:from", v)}
      />
      <FieldRow
        label={rb.header.subjectLabel}
        caption={rb.header.subjectCaption}
        placeholder={rb.header.subjectPlaceholder}
        value={hydrated ? subject : ""}
        onChange={(v) => setNote("nexora:subject", v)}
      />
    </div>
  );
}

function FieldRow({
  label,
  caption,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  caption: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-body font-semibold text-ink">{label}</span>
      <span className="mb-1.5 block text-caption text-ash">{caption}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-paper p-2.5 text-body text-ink placeholder:text-ash/70 focus:border-purple"
      />
    </label>
  );
}

function StepPane({
  component,
  step,
  rb,
  diagnosisSection,
  dataSection,
  hydrated,
  notes,
  checks,
  setNote,
  toggleCheck,
}: {
  component: NexoraComponent;
  step: NexoraSection["reportBuilder"]["steps"][number];
  rb: NexoraSection["reportBuilder"];
  diagnosisSection: Task1Section;
  dataSection: DataSection;
  hydrated: boolean;
  notes: Record<string, string>;
  checks: Record<string, boolean>;
  setNote: (key: string, text: string) => void;
  toggleCheck: (key: string, value: boolean) => void;
}) {
  const noteKey = `nexora:${component.id}`;
  const clueKey = `nexora:clue:${component.id}`;
  const value = hydrated ? notes[noteKey] ?? "" : "";
  const clueOpened = hydrated ? checks[clueKey] ?? false : false;

  const ref = useReferenceContent(step.reference, rb, diagnosisSection, dataSection, hydrated, notes);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-caption font-semibold uppercase tracking-wide text-purple">
          {component.title}
        </p>
        <p className="mt-1 text-body font-semibold text-ink">{component.prompt}</p>
        <p className="mt-1 text-caption text-ash">{step.caption}</p>
      </div>

      {ref ? (
        <div className="rounded-xl border border-line bg-lilac/30 p-3">
          <p className="text-caption font-semibold uppercase tracking-wide text-purple">
            {ref.label}
          </p>
          <p className="mt-1 text-body text-ink">{ref.text}</p>
        </div>
      ) : null}

      <textarea
        value={value}
        onChange={(e) => setNote(noteKey, e.target.value)}
        rows={5}
        placeholder="Draft this section…"
        className="w-full resize-y rounded-xl border border-line bg-paper p-3 text-body text-ink placeholder:text-ash/70 focus:border-purple"
      />

      <Collapsible
        summary={<span className="text-caption font-semibold text-purple">{rb.clueToggleLabel}</span>}
        defaultOpen={false}
        className="rounded-xl border border-line p-3"
        onOpenChange={(open) => {
          // Trainer-visible signal only — opening a clue is never scored.
          if (open && !clueOpened) toggleCheck(clueKey, true);
        }}
      >
        <p className="text-body text-ash">{step.clue}</p>
      </Collapsible>
    </div>
  );
}

function useReferenceContent(
  kind: ReportReferenceKind | undefined,
  rb: NexoraSection["reportBuilder"],
  diagnosisSection: Task1Section,
  dataSection: DataSection,
  hydrated: boolean,
  notes: Record<string, string>,
): { label: string; text: string } | null {
  const pickedCode = useProgress((s) => s.choices[diagnosisSection.id]);
  const cycleRaw = useProgress((s) => s.choices["workBlock2_cycle"]);
  const cycleWhy = useProgress((s) => s.notes["workBlock2_cycleWhy"] ?? "");
  const gapNote = useProgress((s) => s.notes["workBlock2_gapNote"] ?? "");

  if (!kind) return null;

  const task1Ready = hydrated && pickedCode === diagnosisSection.diagnosis.correct;

  if (kind === "task1Verdict" || kind === "task1Gap") {
    const label =
      kind === "task1Verdict" ? rb.reference.task1VerdictLabel : rb.reference.task1GapLabel;
    return {
      label,
      text: task1Ready ? diagnosisSection.diagnosis.correctVerdict : rb.reference.task1Placeholder,
    };
  }

  if (kind === "block2Number") {
    const ready = hydrated && cycleWhy.trim().length > 0;
    if (!ready) return { label: rb.reference.block2NumberLabel, text: rb.reference.block2Placeholder };
    const cycle = cycleRaw ? Number(cycleRaw) : dataSection.config.cycleDefault;
    const emissions = annualEmissionsKg(dataSection.config, cycle);
    return {
      label: rb.reference.block2NumberLabel,
      text: `${Math.round(emissions).toLocaleString()} kg CO₂e/yr at a ${cycle.toFixed(1)}-year cycle (${dataSection.config.office}).`,
    };
  }

  // block2Gap
  const ready = hydrated && gapNote.trim().length > 0;
  return {
    label: rb.reference.block2GapLabel,
    text: ready ? gapNote : rb.reference.block2Placeholder,
  };
}
