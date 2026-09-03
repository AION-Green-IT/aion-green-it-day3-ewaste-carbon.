"use client";

import { content, type NexoraSection } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import { MemoDocument, type MemoSection } from "@/components/mechanics/MemoDocument";

const MEMO_ORDER = ["n1", "n2", "n7", "n5", "n3", "n4", "n6"];
const stripNumber = (title: string) => title.replace(/^\d+\s*·\s*/, "");

/**
 * The printable memo. Hidden on screen, shown only inside `window.print()`
 * and only when `printTarget === "nexora"` — same mutual-exclusion pattern
 * as Work Block #1/#2's exports. Renders the exact same MemoDocument the
 * Report Builder's right pane shows live, so this is never a second layout
 * to keep in sync with the on-screen preview.
 */
export function NexoraNote({ section }: { section: NexoraSection }) {
  const hydrated = useHydrated();
  const printTarget = useProgress((s) => s.printTarget);
  const notes = useProgress((s) => s.notes);

  if (printTarget !== "nexora") return null;

  const to = hydrated ? notes["nexora:to"] ?? "" : "";
  const from = hydrated ? notes["nexora:from"] ?? "" : "";
  const subject = hydrated ? notes["nexora:subject"] ?? "" : "";
  const name = hydrated ? notes["learner:name"] ?? "" : "";

  const byId = Object.fromEntries(section.components.map((c) => [c.id, c]));
  const sections: MemoSection[] = MEMO_ORDER.map((id) => {
    const c = byId[id];
    const text = hydrated ? notes[`nexora:${id}`] ?? "" : "";
    return { id, heading: stripNumber(c.title), text, empty: text.trim().length === 0 };
  });

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="print-note bg-paper p-8 text-ink">
      <p className="text-caption uppercase tracking-wide text-ash">
        {section.reportBuilder.exportWatermark}
      </p>
      <div className="mb-4 mt-1 flex flex-wrap gap-x-8 gap-y-1 text-caption text-ash">
        <p>
          {content.namePrompt.nameLabel}:{" "}
          <span className="font-semibold text-ink">
            {name || content.namePrompt.namePlaceholder}
          </span>
        </p>
      </div>
      <MemoDocument
        docTitle={section.reportBuilder.docTitle}
        to={to}
        from={from}
        date={today}
        subject={subject}
        toPlaceholder={section.reportBuilder.header.toPlaceholder}
        fromPlaceholder={section.reportBuilder.header.fromPlaceholder}
        subjectPlaceholder={section.reportBuilder.header.subjectPlaceholder}
        sections={sections}
      />
    </div>
  );
}
