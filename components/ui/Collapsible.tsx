"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";

/** Generic show/hide with an accessible toggle. Reused by the footer glossary. */
export function Collapsible({
  summary,
  children,
  defaultOpen = false,
  className,
  onOpenChange,
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  /** Fires with the new open state whenever the toggle is clicked. */
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  };
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="flex w-full items-center gap-2 text-left"
      >
        <span
          aria-hidden="true"
          className={clsx(
            "text-h3 text-purple transition-transform duration-200",
            open && "rotate-45",
          )}
        >
          +
        </span>
        <span className="flex-1">{summary}</span>
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
