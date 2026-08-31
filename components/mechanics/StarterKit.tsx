"use client";

import clsx from "clsx";
import type { NexoraComponent, NexoraSection } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import { ArchitectureDiagram } from "@/components/visuals/SectionDiagrams";
import { Explainer } from "@/components/ui/Explainer";

export function StarterKit({ section }: { section: NexoraSection }) {
  const hydrated = useHydrated();
  const checks = useProgress((s) => s.checks);
  const addressed = hydrated
    ? section.components.filter((c) => checks[`nexora:${c.id}`]).length
    : 0;

  return (
    <div className="space-y-5">
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
          <ComponentRow key={c.id} component={c} />
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
    <li
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
    </li>
  );
}
