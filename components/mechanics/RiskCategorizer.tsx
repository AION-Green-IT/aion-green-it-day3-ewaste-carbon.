"use client";

import { useState } from "react";
import clsx from "clsx";
import type { Clue, RiskCategory, Task1Section } from "@/lib/content";
import { useProgress } from "@/lib/store";
import { AreasLifecycleDiagram } from "@/components/visuals/SectionDiagrams";
import { Explainer } from "@/components/ui/Explainer";

export function RiskCategorizer({ section }: { section: Task1Section }) {
  const byCode = Object.fromEntries(
    section.categories.map((c) => [c.code, c]),
  ) as Record<string, RiskCategory>;

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

      <ol className="space-y-3">
        {section.clues.map((clue, i) => (
          <ClueRow
            key={clue.id}
            clue={clue}
            index={i}
            categories={section.categories}
            byCode={byCode}
          />
        ))}
      </ol>
    </div>
  );
}

function ClueRow({
  clue,
  index,
  categories,
  byCode,
}: {
  clue: Clue;
  index: number;
  categories: RiskCategory[];
  byCode: Record<string, RiskCategory>;
}) {
  const markSeen = useProgress((s) => s.markSeen);
  const [chosen, setChosen] = useState<string | null>(null);
  const revealed = chosen !== null;
  const answer = byCode[clue.answer];
  const matched = chosen === clue.answer;

  const pick = (code: string) => {
    if (revealed) return;
    setChosen(code);
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
        </div>
      )}
    </li>
  );
}
