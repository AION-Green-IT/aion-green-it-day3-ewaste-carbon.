"use client";

import clsx from "clsx";
import { content } from "@/lib/content";
import { useHydrated } from "@/lib/store";
import { progressMessage, useSectionStatuses } from "@/lib/progress";
import { AionLogo } from "./Icons";
import { ResetProgress } from "./ResetProgress";

export function TopBar() {
  const hydrated = useHydrated();
  const { statuses, completeCount, total, percent } = useSectionStatuses();

  // Hold zeros until localStorage is read, so server and client markup match.
  const shownPercent = hydrated ? percent : 0;
  const shownComplete = hydrated ? completeCount : 0;

  return (
    <header className="sticky top-0 z-30 bg-navy text-paper print:hidden">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex min-w-0 items-center gap-3">
            <AionLogo className="h-6 w-20 shrink-0 text-paper" />
            <p className="min-w-0 truncate text-caption text-lilac/90 md:text-body">
              {content.meta.module} — {content.meta.title}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-caption uppercase tracking-wide text-lilac/80">
                Done
              </span>
              <span className="text-readout tabular-nums text-paper">
                {shownComplete}/{total}
              </span>
            </div>
            <ResetProgress />
          </div>
        </div>

        {/* Single overall progress bar — the only progress meter on the page. */}
        <div className="mt-3">
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-paper/15"
            role="progressbar"
            aria-valuenow={shownPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall progress through the day's blocks"
          >
            <div
              className="h-full rounded-full bg-lilac transition-[width] duration-500 ease-out"
              style={{ width: `${shownPercent}%` }}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <p className="text-caption text-lilac/90">
              {hydrated
                ? progressMessage(percent)
                : content.progress.byMessages[0].text}
            </p>
            <ul className="flex flex-wrap items-center gap-1.5">
              {statuses.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={clsx(
                      "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption transition-colors duration-200",
                      hydrated && s.complete
                        ? "bg-lilac/20 text-paper"
                        : "text-lilac/70 hover:bg-paper/10 hover:text-paper",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[9px] font-bold",
                        hydrated && s.complete
                          ? "border-lilac bg-lilac text-navy"
                          : "border-lilac/40",
                      )}
                    >
                      {hydrated && s.complete ? "✓" : ""}
                    </span>
                    {s.nav}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
