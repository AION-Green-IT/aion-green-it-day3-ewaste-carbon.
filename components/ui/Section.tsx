"use client";

import clsx from "clsx";
import { useHydrated } from "@/lib/store";
import { useSectionStatuses } from "@/lib/progress";
import type { SectionId } from "@/lib/content";

/**
 * Generic scroll section: anchor + heading block + a live completion chip that
 * reads the same status source as the header. Reused by every block; a new
 * module only supplies different children.
 */
export function Section({
  id,
  kicker,
  title,
  intro,
  doneRule,
  action,
  children,
}: {
  id: SectionId;
  kicker: string;
  title: string;
  intro: string;
  doneRule: string;
  /** Optional control beside the progress bar, e.g. a per-section reset. */
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const hydrated = useHydrated();
  const { statuses } = useSectionStatuses();
  const status = statuses.find((s) => s.id === id);
  const showProgress =
    hydrated && status && status.total > 1 && status.done > 0;

  return (
    <section id={id} className="scroll-mt-28 py-10">
      <div className="mb-6 max-w-3xl">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <p className="text-caption font-semibold uppercase tracking-wide text-purple">
            {kicker}
          </p>
          {hydrated && status?.complete ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-good/10 px-2.5 py-0.5 text-caption font-semibold text-good">
              <span aria-hidden="true">✓</span> Done
            </span>
          ) : (
            <span className="rounded-full border border-line px-2.5 py-0.5 text-caption text-ash">
              {doneRule}
            </span>
          )}
        </div>

        <h2 className="mb-3 text-h2 text-ink">{title}</h2>
        <p className="text-body text-ash">{intro}</p>

        {showProgress || action ? (
          // empty:hidden keeps the row from adding space when `action` itself
          // renders nothing (an untouched section) and there is no bar yet.
          <div className="mt-4 flex flex-wrap items-center gap-3 empty:hidden">
            {showProgress ? (
              <>
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-lilac">
                  <div
                    className={clsx(
                      "h-full rounded-full transition-[width] duration-300",
                      status!.complete ? "bg-good" : "bg-purple",
                    )}
                    style={{
                      width: `${Math.min(100, (status!.done / status!.total) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-caption tabular-nums text-ash">
                  {Math.min(status!.done, status!.total)} / {status!.total}
                </span>
              </>
            ) : null}
            {action}
          </div>
        ) : null}
      </div>

      {children}
    </section>
  );
}
