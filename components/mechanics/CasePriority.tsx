"use client";

import clsx from "clsx";
import type { BlueGridSection, CaseOption } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import { HorizonsTimelineDiagram } from "@/components/visuals/SectionDiagrams";
import { Explainer } from "@/components/ui/Explainer";

export function CasePriority({ section }: { section: BlueGridSection }) {
  const hydrated = useHydrated();
  const chosenId = useProgress((s) => s.choices.bluegrid) ?? null;
  const choose = useProgress((s) => s.choose);
  const chosen = hydrated ? chosenId : null;
  const chosenOption = section.options.find((o) => o.id === chosen) ?? null;
  const recommended = section.options.find((o) => o.recommended)!;

  return (
    <div className="space-y-6">
      {/* Starting position + levers, side by side on wide screens. */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="card p-4">
          <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-ash">
            Starting position
          </p>
          <ul className="space-y-1.5">
            {section.situation.map((s, i) => (
              <li key={i} className="flex gap-2 text-body text-ink">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger/60"
                />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-ash">
            The four biggest levers
          </p>
          <ul className="space-y-1.5">
            {section.levers.map((l, i) => (
              <li key={i} className="flex gap-2 text-body text-ink">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-good/70"
                />
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The pick. */}
      <div className="space-y-3">
        <p className="text-body font-semibold text-ink">{section.prompt}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {section.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={chosen === opt.id}
              onClick={() => choose("bluegrid", opt.id)}
              className={clsx(
                "flex h-full items-start gap-3 rounded-2xl border bg-paper p-4 text-left transition-all duration-200",
                chosen === opt.id
                  ? "border-purple ring-2 ring-purple ring-offset-2"
                  : "border-line hover:-translate-y-0.5 hover:border-purple",
                chosen !== null && chosen !== opt.id && "opacity-60",
              )}
            >
              <span
                aria-hidden="true"
                className={clsx(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-caption font-bold",
                  chosen === opt.id
                    ? "border-purple bg-purple text-paper"
                    : "border-line text-ash",
                )}
              >
                {chosen === opt.id ? "✓" : ""}
              </span>
              <span className="text-body text-ink">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {chosenOption ? (
        <Result chosen={chosenOption} recommended={recommended} section={section} />
      ) : null}
    </div>
  );
}

function Result({
  chosen,
  recommended,
  section,
}: {
  chosen: CaseOption;
  recommended: CaseOption;
  section: BlueGridSection;
}) {
  const isRecommended = chosen.recommended;

  return (
    <div className="reveal-in space-y-4">
      {/* What the learner picked. */}
      <div
        className={clsx(
          "card border-l-4 p-4",
          isRecommended ? "border-good" : "border-warn",
        )}
      >
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className={clsx(
              "rounded-full px-3 py-1 text-caption font-semibold text-paper",
              isRecommended ? "bg-good" : "bg-warn",
            )}
          >
            {isRecommended ? "This is the recommendation" : "Your pick"}
          </span>
          <span className="text-h3 text-ink">{chosen.verdict}</span>
        </div>
        <p className="text-body text-ash">{chosen.detail}</p>
      </div>

      {/* The official recommendation, always shown for comparison. */}
      {!isRecommended ? (
        <div className="card border-l-4 border-good p-4">
          <p className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-good px-3 py-1 text-caption font-semibold text-paper">
              The recommendation
            </span>
            <span className="text-h3 text-ink">{recommended.label}</span>
          </p>
          <p className="text-body text-ash">{recommended.detail}</p>
        </div>
      ) : null}

      {/* Why the recommendation holds. */}
      <div className="rounded-2xl border border-line p-4">
        <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-ash">
          Why it holds
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {recommended.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-body text-ink">
              <span aria-hidden="true" className="mt-0.5 text-good">
                ✓
              </span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* How the horizons build on the two first moves. */}
      <Explainer title="How the horizons build on the first two moves">
        <div className="mx-auto max-w-lg">
          <HorizonsTimelineDiagram />
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-caption text-ash">
          {section.horizonsRelation}
        </p>
      </Explainer>

      {/* Short / medium / structural horizons. */}
      <div className="grid gap-3 md:grid-cols-3">
        {section.horizons.map((h) => (
          <div key={h.id} className="rounded-2xl border border-line p-4">
            <p className="mb-2 inline-block rounded-full bg-navy px-3 py-1 text-caption font-semibold text-paper">
              {h.label}
            </p>
            <ul className="space-y-1.5">
              {h.items.map((it, i) => (
                <li key={i} className="flex gap-2 text-caption text-ash">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple"
                  />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-caption text-ash">
        Try another first step to compare — the recommendation stays visible either
        way.
      </p>
    </div>
  );
}
