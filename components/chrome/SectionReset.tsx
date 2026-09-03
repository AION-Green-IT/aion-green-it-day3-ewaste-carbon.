"use client";

import { useHydrated, useProgress } from "@/lib/store";
import type { SectionId } from "@/lib/content";
import { useSectionStatuses } from "@/lib/progress";

/**
 * "Start over" for a single mechanic: clears that section's stored answers and
 * bumps its reset counter, which the mechanic keys its own local state on (a
 * revealed clue, an opened card). The header's Reset progress button still
 * clears the whole day; this one leaves every other section alone.
 *
 * Renders nothing until the learner has actually answered something, so an
 * untouched section stays uncluttered.
 */
export function SectionReset({
  sectionId,
  label,
  note,
  extraKeyPrefixes,
}: {
  sectionId: SectionId;
  label: string;
  note: string;
  /** Compound-key prefixes to sweep alongside the plain sectionId — see resetSection. */
  extraKeyPrefixes?: string[];
}) {
  const hydrated = useHydrated();
  const resetSection = useProgress((s) => s.resetSection);
  const { statuses } = useSectionStatuses();
  const status = statuses.find((s) => s.id === sectionId);

  if (!hydrated || !status || status.done === 0) return null;

  return (
    <button
      type="button"
      onClick={() => resetSection(sectionId, extraKeyPrefixes)}
      title={note}
      aria-label={`${label}. ${note}`}
      className="rounded-xl border border-line px-3 py-1.5 text-caption text-navy transition-colors duration-200 hover:bg-lilac hover:underline"
    >
      ↺ {label}
    </button>
  );
}
