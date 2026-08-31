"use client";

import { useProgress } from "@/lib/store";

/**
 * Remounts everything below it whenever progress is reset, so component-local
 * state (an opened card, a revealed clue) clears alongside the persisted store.
 */
export function ResetBoundary({ children }: { children: React.ReactNode }) {
  const resetCount = useProgress((s) => s.resetCount);
  return <div key={resetCount}>{children}</div>;
}
