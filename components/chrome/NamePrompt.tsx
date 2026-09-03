"use client";

import { content } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";

/**
 * Asked once, right after the cold-open and before any work block — every
 * export's filename and printed header reuse `notes["learner:name"]` from
 * here, so the learner never re-types it three times.
 */
export function NamePrompt() {
  const hydrated = useHydrated();
  const { namePrompt: copy } = content;
  const name = useProgress((s) => s.notes["learner:name"] ?? "");
  const setNote = useProgress((s) => s.setNote);

  return (
    <div className="rounded-2xl border border-line bg-lilac/30 p-4">
      <p className="text-h3 text-ink">{copy.title}</p>
      <p className="mt-1 text-caption text-ash">{copy.caption}</p>
      <label className="mt-3 block max-w-xs">
        <span className="sr-only">{copy.nameLabel}</span>
        <input
          type="text"
          value={hydrated ? name : ""}
          onChange={(e) => setNote("learner:name", e.target.value)}
          placeholder={copy.namePlaceholder}
          className="w-full rounded-xl border border-line bg-paper p-2.5 text-body text-ink placeholder:text-ash/70 focus:border-purple"
        />
      </label>
    </div>
  );
}
