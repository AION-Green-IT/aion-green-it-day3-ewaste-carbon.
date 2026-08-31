"use client";

import clsx from "clsx";
import type { PriorityOption, Task2Section } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import { TradeoffDiagram } from "@/components/visuals/SectionDiagrams";
import { Explainer } from "@/components/ui/Explainer";

export function PriorityPicker({ section }: { section: Task2Section }) {
  const hydrated = useHydrated();
  const chosenId = useProgress((s) => s.choices.task2) ?? null;
  const choose = useProgress((s) => s.choose);
  const chosen = hydrated ? chosenId : null;
  const chosenOption = section.options.find((o) => o.id === chosen) ?? null;

  return (
    <div className="space-y-4">
      <Explainer title="How to weigh these — visible now vs. steers long-term">
        <div className="mx-auto max-w-sm">
          <TradeoffDiagram options={section.options} />
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-caption text-ash">
          {section.tradeoffRelation}
        </p>
      </Explainer>

      <p className="text-body font-semibold text-ink">{section.prompt}</p>

      <div className="grid gap-3 md:grid-cols-3">
        {section.options.map((opt) => (
          <OptionCard
            key={opt.id}
            option={opt}
            picked={chosen === opt.id}
            dimmed={chosen !== null && chosen !== opt.id}
            onPick={() => choose("task2", opt.id)}
          />
        ))}
      </div>

      {chosenOption ? (
        <div className="reveal-in space-y-3">
          <div className="card border-l-4 border-purple p-4">
            <p className="text-caption font-semibold uppercase tracking-wide text-purple">
              Trade-off of {chosenOption.label.split(" — ")[0]}
            </p>
            <p className="mt-1 text-h3 text-ink">
              {chosenOption.consequence.headline}
            </p>
            <ul className="mt-3 space-y-1.5">
              {chosenOption.consequence.points.map((p, i) => (
                <li key={i} className="flex gap-2 text-body text-ash">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <p className="rounded-xl border-l-4 border-navy bg-lilac/50 p-3 text-body text-navy">
            <span className="font-semibold">Coach&rsquo;s note: </span>
            {section.coachNote}
          </p>

          <p className="text-caption text-ash">
            Changed your mind? Pick another card — nothing here is scored.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function OptionCard({
  option,
  picked,
  dimmed,
  onPick,
}: {
  option: PriorityOption;
  picked: boolean;
  dimmed: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={picked}
      onClick={onPick}
      className={clsx(
        "flex h-full flex-col rounded-2xl border bg-paper p-4 text-left transition-all duration-200",
        picked
          ? "border-purple ring-2 ring-purple ring-offset-2"
          : "border-line hover:-translate-y-0.5 hover:border-purple",
        dimmed && "opacity-60",
      )}
    >
      <span className="mb-1 flex items-center justify-between gap-2 text-h3 text-ink">
        {option.label}
        {picked ? (
          <span className="shrink-0 rounded-full bg-purple px-2 py-0.5 text-caption font-semibold text-paper">
            Chosen
          </span>
        ) : null}
      </span>
      <span className="text-body text-ash">{option.summary}</span>
    </button>
  );
}
