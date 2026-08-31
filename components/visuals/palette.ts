// Shared palette for the SVG diagrams — mirrors the Tailwind tokens so the
// illustrations stay in the same family as the rest of the page.
export const C = {
  navy: "#231A45",
  purple: "#5624D0",
  lilac: "#EEE9F9",
  ink: "#1B1230",
  ash: "#6B6484",
  paper: "#FFFFFF",
  line: "#D9D3EA",
  good: "#2F9E5A",
  warn: "#C0721D",
  danger: "#B33A3A",
  source: "#6E8DC1",
  cycle: "#B389D6",
  control: "#F1B24A",
} as const;

export type DiagramProps = { className?: string };
