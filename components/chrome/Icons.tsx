type IconProps = { className?: string };

export function AionLogo({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 96 24"
      role="img"
      aria-label="AION"
      className={className ?? "h-6 w-24"}
    >
      <path
        d="M3 19 9 5l6 14h-3l-1-2.6H7L6 19H3Zm4.9-5h2.2L9 11.2 7.9 14Z"
        fill="currentColor"
      />
      <rect x="19" y="5" width="2.6" height="14" fill="currentColor" />
      <path
        d="M32 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 2.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Z"
        fill="currentColor"
      />
      <path
        d="M44 19V5h2.5l6 8.7V5H55v14h-2.5l-6-8.7V19H44Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LeafMark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
    >
      <path
        d="M16 4C9 4 4.5 7.5 4.5 13.5c0 .8.1 1.5.3 2.2C6 12 9 9.5 13.5 8.5 10 10.5 7.8 13 7 16.5c6 .8 9-3 9-9V4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
