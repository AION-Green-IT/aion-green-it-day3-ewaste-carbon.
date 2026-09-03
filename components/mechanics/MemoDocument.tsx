"use client";

import clsx from "clsx";

export type MemoSection = {
  id: string;
  heading: string;
  text: string;
  empty: boolean;
};

/**
 * The memo itself — one component, rendered twice: live in the Report
 * Builder's right pane, and again inside the print-only export. Same markup
 * both times, so "export" is just "print this view", never a second layout
 * to keep in sync.
 */
export function MemoDocument({
  docTitle,
  to,
  from,
  date,
  subject,
  toPlaceholder,
  fromPlaceholder,
  subjectPlaceholder,
  sections,
  highlightId,
}: {
  docTitle: string;
  to: string;
  from: string;
  date: string;
  subject: string;
  toPlaceholder: string;
  fromPlaceholder: string;
  subjectPlaceholder: string;
  sections: MemoSection[];
  /** The step just left, so its section pulses "saved" — screen only, harmless in print. */
  highlightId?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
      <p className="text-center text-caption font-semibold uppercase tracking-[0.2em] text-ash">
        {docTitle}
      </p>

      <dl className="mt-4 space-y-1.5 border-b border-line pb-4 text-body">
        <MemoHeaderRow label="To" value={to} placeholder={toPlaceholder} />
        <MemoHeaderRow label="From" value={from} placeholder={fromPlaceholder} />
        <MemoHeaderRow label="Date" value={date} placeholder="—" />
        <MemoHeaderRow label="Subject" value={subject} placeholder={subjectPlaceholder} />
      </dl>

      <div className="mt-4 space-y-5">
        {sections.map((s, i) => (
          <div
            key={s.id}
            className={clsx(
              "rounded-xl p-2 transition-colors duration-700",
              highlightId === s.id && "reveal-in bg-good/10",
            )}
          >
            <p className="text-h3 text-ink">
              {i + 1}. {s.heading}
            </p>
            <p
              className={clsx(
                "mt-1 whitespace-pre-wrap text-body",
                s.empty ? "italic text-ash/60" : "text-ink",
              )}
            >
              {s.empty ? "Not drafted yet." : s.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoHeaderRow({
  label,
  value,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder: string;
}) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 font-semibold text-ink">{label}:</dt>
      <dd className={value ? "text-ink" : "italic text-ash/60"}>{value || placeholder}</dd>
    </div>
  );
}
