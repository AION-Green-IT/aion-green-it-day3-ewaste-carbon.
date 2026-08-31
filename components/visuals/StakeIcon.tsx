// Small line icons for the opening "stakes" strip. currentColor so the caller
// sets the tone.
export function StakeIcon({ name, className }: { name: string; className?: string }) {
  const cls = className ?? "h-5 w-5";
  switch (name) {
    case "contract":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cls}>
          <path d="M6 3h8l4 4v14H6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cls}>
          <path d="M12 3l7 2.5v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9v-5L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "coins":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cls}>
          <ellipse cx="9" cy="7" rx="5" ry="2.6" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 7v5c0 1.4 2.2 2.6 5 2.6s5-1.2 5-2.6V7" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 15.4v2c0 1.4 2.2 2.6 5 2.6s5-1.2 5-2.6v-5c0-1.2-1.7-2.3-4-2.6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "eye":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cls}>
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    default:
      return null;
  }
}
