"use client";

import {
  content,
  getSection,
  SECTION_ORDER,
  type BasicsSection,
  type Task1Section,
  type NexoraSection,
  type SectionId,
} from "@/lib/content";
import { useProgress } from "@/lib/store";

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
  const checks = useProgress((s) => s.checks);

  const basics = getSection<BasicsSection>("basics");
  const task1 = getSection<Task1Section>("task1");
  const nexora = getSection<NexoraSection>("nexora");

  const nexoraChecked = nexora.components.filter(
    (c) => checks[`nexora:${c.id}`],
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
    // Ticked once the learner has a number to defend and has drafted D3.
    data: { done: checks["data:d3"] ? 1 : 0, total: 1 },
    // A single pick completes the mechanic.
    task2: { done: choices.task2 ? 1 : 0, total: 1 },
    bluegrid: { done: choices.bluegrid ? 1 : 0, total: 1 },
    // Self-paced worksheet: engaged once at least one component is ticked.
    nexora: { done: nexoraChecked, total: 1 },
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
