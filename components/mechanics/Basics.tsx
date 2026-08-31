"use client";

import { useState } from "react";
import clsx from "clsx";
import type { BasicsSection, Concept } from "@/lib/content";
import { useProgress } from "@/lib/store";
import { Diagram } from "@/components/visuals/registry";
import { Explainer } from "@/components/ui/Explainer";

export function Basics({ section }: { section: BasicsSection }) {
  return (
    <div className="space-y-6">
      {/* Concept list — tidy titles that open into the full visual explanation. */}
      <div className="space-y-3">
        {section.concepts.map((c) => (
          <ConceptRow key={c.id} concept={c} />
        ))}
      </div>

      {/* Summary map — collapsed to its title, open for the one picture. */}
      <Explainer title={section.map.title}>
        <div className="mx-auto max-w-xl">
          <Diagram name={section.map.visual} />
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-center text-body text-ash">
          {section.map.caption}
        </p>
      </Explainer>
    </div>
  );
}

function Labeled({
  label,
  color,
  children,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <p className="text-body text-ink">
      <span
        className="mr-1.5 rounded px-1.5 py-0.5 text-caption font-semibold uppercase tracking-wide text-paper"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
      {children}
    </p>
  );
}

function ConceptRow({ concept }: { concept: Concept }) {
  const seen = useProgress((s) => s.seen.basics ?? []);
  const markSeen = useProgress((s) => s.markSeen);
  const [open, setOpen] = useState(false);
  const opened = seen.includes(concept.id);

  const toggle = () => {
    setOpen((o) => !o);
    if (!opened) markSeen("basics", concept.id);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className={clsx(
          "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200",
          open ? "bg-lilac" : "bg-paper hover:bg-lilac/50",
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-body font-semibold",
            opened ? "bg-good/15 text-good" : "bg-lilac text-purple",
          )}
        >
          {opened && !open ? "✓" : open ? "−" : "+"}
        </span>
        <span className="min-w-0 flex-1 text-h3 text-ink">{concept.title}</span>
      </button>

      {open ? (
        <div className="reveal-in space-y-3 border-t border-line p-4">
          <div className="mx-auto max-w-xl rounded-xl border border-line bg-lilac/20 p-3">
            <Diagram name={concept.visual} />
          </div>

          <p className="flex gap-1.5 text-caption text-ash">
            <span aria-hidden="true" className="font-semibold text-purple">
              ↳
            </span>
            {concept.relation}
          </p>

          <ul className="space-y-1.5">
            {concept.points.map((p, i) => (
              <li key={i} className="flex gap-2 text-body text-ash">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple" />
                {p}
              </li>
            ))}
          </ul>

          <div className="space-y-2.5 border-t border-line pt-3">
            <Labeled label="Like" color="#8B7BB8">
              {concept.analogy}
            </Labeled>
            <Labeled label="For example" color="#6E8DC1">
              {concept.example}
            </Labeled>
            <p className="rounded-xl border-l-4 border-navy bg-lilac/50 p-3 text-body text-navy">
              <span className="font-semibold">Use it for: </span>
              {concept.useFor}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
