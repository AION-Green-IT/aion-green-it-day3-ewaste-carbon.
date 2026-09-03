"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const STORAGE_KEY = "aion-greenit-day3";

/**
 * Deliberately generic so the next module reuses it unchanged:
 *  - seen:    sectionId -> item ids the learner has engaged (basics cards, task1 clues)
 *  - choices: sectionId -> the single option id they picked (task2, bluegrid)
 *  - checks:  arbitrary key -> boolean (Nexora checklist)
 *  - notes:   arbitrary key -> text (Nexora note fields)
 * The store knows nothing about what a section means; lib/progress.ts joins it
 * to the content to decide what "done" is.
 */
export type ProgressState = {
  seen: Record<string, string[]>;
  choices: Record<string, string>;
  checks: Record<string, boolean>;
  notes: Record<string, string>;
};

type Session = {
  /**
   * Bumped by reset(). Section content is keyed on it so a reset also clears
   * state living inside components (an open card, a revealed clue) that the
   * persisted store never sees. Not persisted — a within-session signal only.
   */
  resetCount: number;
  /**
   * Per-section counterpart of resetCount: sectionId -> how many times that
   * one section has been cleared. A mechanic keys its own component-local
   * state on it so "sort these again" wipes revealed answers too.
   */
  sectionResets: Record<string, number>;
};

type Actions = {
  markSeen: (sectionId: string, itemId: string) => void;
  choose: (sectionId: string, optionId: string) => void;
  toggleCheck: (key: string, value: boolean) => void;
  setNote: (key: string, text: string) => void;
  reset: () => void;
  resetSection: (sectionId: string) => void;
};

const emptyProgress: ProgressState = {
  seen: {},
  choices: {},
  checks: {},
  notes: {},
};

const addUnique = (list: string[] | undefined, id: string) =>
  list?.includes(id) ? list : [...(list ?? []), id];

export const useProgress = create<ProgressState & Session & Actions>()(
  persist(
    (set) => ({
      ...emptyProgress,
      resetCount: 0,
      sectionResets: {},

      markSeen: (sectionId, itemId) =>
        set((s) => ({
          seen: { ...s.seen, [sectionId]: addUnique(s.seen[sectionId], itemId) },
        })),

      choose: (sectionId, optionId) =>
        set((s) => ({ choices: { ...s.choices, [sectionId]: optionId } })),

      toggleCheck: (key, value) =>
        set((s) => ({ checks: { ...s.checks, [key]: value } })),

      setNote: (key, text) =>
        set((s) => ({ notes: { ...s.notes, [key]: text } })),

      reset: () =>
        set((s) => ({ ...emptyProgress, resetCount: s.resetCount + 1 })),

      /** Clears one section's answers only — the rest of the day stands. */
      resetSection: (sectionId) =>
        set((s) => {
          const seen = { ...s.seen };
          const choices = { ...s.choices };
          delete seen[sectionId];
          delete choices[sectionId];
          return {
            seen,
            choices,
            sectionResets: {
              ...s.sectionResets,
              [sectionId]: (s.sectionResets[sectionId] ?? 0) + 1,
            },
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        seen: s.seen,
        choices: s.choices,
        checks: s.checks,
        notes: s.notes,
      }),
    },
  ),
);

/**
 * Guard against server/client markup mismatch for persisted values: false on
 * the server and the first client paint, true once localStorage has been read.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
