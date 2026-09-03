"use client";

import {
  content,
  getSection,
  SECTION_ORDER,
  type BasicsSection,
  type DataSection,
  type Task1Section,
  type NexoraSection,
  type SectionId,
} from "@/lib/content";
import { useProgress } from "@/lib/store";
import { partAComplete } from "@/lib/workBlock2";

export type SectionStatus = {
  id: SectionId;
  nav: string;
  /** Units engaged so far (clues sorted, cards opened, a pick made, …). */
  done: number;
  /** Units needed for this section to count as complete. */
  total: number;
  complete: boolean;
};

/**
 * One place that decides what "done" means for each mechanic, so the header
 * bar, the section chips and the jump-nav all agree. A section counts as
 * complete once its mechanic has genuinely been run through once.
 */
export function useSectionStatuses(): {
  statuses: SectionStatus[];
  completeCount: number;
  total: number;
  percent: number;
} {
  const seen = useProgress((s) => s.seen);
  const choices = useProgress((s) => s.choices);
  const notes = useProgress((s) => s.notes);

  const basics = getSection<BasicsSection>("basics");
  const task1 = getSection<Task1Section>("task1");
  const dataSection = getSection<DataSection>("data");
  const nexora = getSection<NexoraSection>("nexora");

  // Note: `checks["nexora:..."]` is used for "clue opened" tracking now, not
  // completion — a step counts as addressed once it has drafted text.
  const nexoraAddressed = nexora.components.filter(
    (c) => (notes[`nexora:${c.id}`] ?? "").trim().length > 0,
  ).length;

  const raw: Record<SectionId, { done: number; total: number }> = {
    basics: {
      done: (seen.basics ?? []).length,
      total: basics.concepts.length,
    },
    // Sorting every signal plus the final diagnosis pick — the finding that
    // carries forward into the next task.
    task1: {
      done: (seen.task1 ?? []).length + (choices.task1 ? 1 : 0),
      total: task1.clues.length + 1,
    },
    // Done once Part A's five hand-worked questions AND Part B's two
    // justification fields are both filled — the same bar the playground's
    // own export button gates on.
    data: {
      done:
        partAComplete(dataSection.config, notes) &&
        !!notes["workBlock2_cycleWhy"]?.trim() &&
        !!notes["workBlock2_gapNote"]?.trim()
          ? 1
          : 0,
      total: 1,
    },
    // A single pick completes the mechanic.
    task2: { done: choices.task2 ? 1 : 0, total: 1 },
    bluegrid: { done: choices.bluegrid ? 1 : 0, total: 1 },
    // Self-paced worksheet: engaged once at least one component is ticked.
    nexora: { done: nexoraAddressed, total: 1 },
  };

  const statuses: SectionStatus[] = SECTION_ORDER.map((id) => {
    const s = content.sections.find((x) => x.id === id)!;
    const r = raw[id];
    const done = Math.min(r.done, r.total);
    return {
      id,
      nav: s.nav,
      done: r.done,
      total: r.total,
      complete: done >= r.total,
    };
  });

  const completeCount = statuses.filter((s) => s.complete).length;
  const total = statuses.length;

  return {
    statuses,
    completeCount,
    total,
    percent: Math.round((completeCount / total) * 100),
  };
}

/** The dynamic header line for the current percentage. */
export function progressMessage(percent: number): string {
  const rungs = content.progress.byMessages;
  return (
    rungs.find((r) => percent <= r.upTo)?.text ?? rungs[rungs.length - 1].text
  );
}
