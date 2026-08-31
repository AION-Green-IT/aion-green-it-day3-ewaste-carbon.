"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";

/**
 * A tidy titled panel: collapsed it shows only its title, so diagrams and
 * explainers stay out of the way until a learner wants them. Reused for every
 * "how this relates" visual on the page.
 */
export function Explainer({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors duration-200",
          open ? "bg-lilac" : "bg-lilac/30 hover:bg-lilac/60",
        )}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 text-purple">
          <rect x="2.5" y="10" width="3.5" height="7" rx="1" fill="currentColor" />
          <rect x="8.25" y="6" width="3.5" height="11" rx="1" fill="currentColor" />
          <rect x="14" y="3" width="3.5" height="14" rx="1" fill="currentColor" />
        </svg>
        <span className="flex-1 text-caption font-semibold uppercase tracking-wide text-purple">
          {title}
        </span>
        <span aria-hidden="true" className="text-h3 leading-none text-purple">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? <div className="border-t border-line p-4">{children}</div> : null}
    </div>
  );
}
