import { C, type DiagramProps } from "./palette";

const wrap = "w-full h-auto";

/* Task 1 — the three areas are one device life in order; transparency spans it. */
export function AreasLifecycleDiagram({ className }: DiagramProps) {
  const zones = [
    { x: 12, w: 104, c: C.source, t: "Source", s: "buy / replace" },
    { x: 120, w: 104, c: C.cycle, t: "Cycle", s: "use / operate" },
    { x: 228, w: 120, c: C.control, t: "Control", s: "see / close out" },
  ];
  return (
    <svg viewBox="0 0 360 118" className={className ?? wrap} role="img" aria-label="Three areas along one device life: Source, then Cycle, then Control; data and transparency run across all of it">
      <defs>
        <marker id="area-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={C.ash} />
        </marker>
      </defs>
      {zones.map((z, i) => (
        <g key={z.t}>
          <rect x={z.x} y="20" width={z.w} height="42" rx="8" fill={z.c} opacity="0.92" />
          <text x={z.x + z.w / 2} y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill={i === 2 ? C.navy : C.paper} fontFamily="inherit">{z.t}</text>
          <text x={z.x + z.w / 2} y="54" textAnchor="middle" fontSize="9.5" fill={i === 2 ? C.navy : C.lilac} fontFamily="inherit">{z.s}</text>
          {i < 2 && <line x1={z.x + z.w + 1} y1="41" x2={z.x + z.w + 6} y2="41" stroke={C.ash} strokeWidth="1.5" markerEnd="url(#area-a)" />}
        </g>
      ))}
      {/* transparency spans all */}
      <line x1="12" y1="82" x2="348" y2="82" stroke={C.control} strokeWidth="1.4" strokeDasharray="5 4" />
      <text x="180" y="98" textAnchor="middle" fontSize="10" fill={C.ash} fontFamily="inherit">data &amp; transparency (Control) run across every phase</text>
    </svg>
  );
}

/* Task 2 — visible-now vs steers-long-term are two different axes. */
export function TradeoffDiagram({
  className,
  options,
}: DiagramProps & {
  options: { id: string; label: string; axis: { visible: number; steer: number } }[];
}) {
  // 1..3 → pixel on each axis
  const x = (v: number) => 70 + ((v - 1) / 2) * 210; // 70..280
  const y = (v: number) => 180 - ((v - 1) / 2) * 150; // 180(bottom)..30(top)
  return (
    <svg viewBox="0 0 320 216" className={className ?? wrap} role="img" aria-label="A map of the three options by how visible each is now versus how much it lets you steer long-term">
      <defs>
        <marker id="to-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={C.ash} />
        </marker>
      </defs>
      {/* steer-first zone */}
      <rect x="70" y="30" width="210" height="75" fill={C.good} opacity="0.07" />
      <text x="276" y="44" textAnchor="end" fontSize="9" fill={C.good} fontFamily="inherit">steers most — prioritise here</text>
      {/* axes */}
      <line x1="70" y1="180" x2="292" y2="180" stroke={C.ash} strokeWidth="1.5" markerEnd="url(#to-a)" />
      <line x1="70" y1="180" x2="70" y2="24" stroke={C.ash} strokeWidth="1.5" markerEnd="url(#to-a)" />
      <text x="292" y="196" textAnchor="end" fontSize="9.5" fill={C.ash} fontFamily="inherit">visible now →</text>
      <text x="64" y="24" fontSize="9.5" fill={C.ash} fontFamily="inherit" textAnchor="start" transform="rotate(-90 64 24)">↑ steers long-term</text>
      {options.map((o) => {
        const tag = o.label.trim().charAt(0);
        const px = x(o.axis.visible);
        const py = y(o.axis.steer);
        const best = o.axis.steer >= 3;
        return (
          <g key={o.id}>
            <circle cx={px} cy={py} r="13" fill={best ? C.good : C.purple} />
            <text x={px} y={py + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={C.paper} fontFamily="inherit">{tag}</text>
          </g>
        );
      })}
      <text x="16" y="210" fontSize="9" fill={C.ash} fontFamily="inherit">A returns · B carbon acct · C replace</text>
    </svg>
  );
}

/* BlueGrid — the two first moves are the foundation every horizon builds on. */
export function HorizonsTimelineDiagram({ className }: DiagramProps) {
  const marks = [
    { x: 150, y: 118, t: "Short", s: "gather data" },
    { x: 250, y: 88, t: "Medium", s: "set rules" },
    { x: 344, y: 54, t: "Structural", s: "govern & steer" },
  ];
  return (
    <svg viewBox="0 0 380 168" className={className ?? wrap} role="img" aria-label="A foundation of baseline plus device process, feeding a rising timeline through short, medium and structural horizons up to governance">
      <defs>
        <marker id="hz-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={C.purple} />
        </marker>
      </defs>
      {/* foundation */}
      <rect x="10" y="96" width="96" height="52" rx="8" fill={C.navy} />
      <text x="58" y="116" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.paper} fontFamily="inherit">Foundation</text>
      <text x="58" y="130" textAnchor="middle" fontSize="8.5" fill={C.lilac} fontFamily="inherit">baseline +</text>
      <text x="58" y="141" textAnchor="middle" fontSize="8.5" fill={C.lilac} fontFamily="inherit">device process</text>
      {/* rising line */}
      <path d="M106 130 L150 118 L250 88 L344 54" fill="none" stroke={C.purple} strokeWidth="2.2" markerEnd="url(#hz-a)" />
      {marks.map((m) => (
        <g key={m.t}>
          <circle cx={m.x} cy={m.y} r="5" fill={C.purple} />
          <text x={m.x} y={m.y - 10} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.ink} fontFamily="inherit">{m.t}</text>
          <text x={m.x} y={m.y + 18} textAnchor="middle" fontSize="9" fill={C.ash} fontFamily="inherit">{m.s}</text>
        </g>
      ))}
      <text x="10" y="24" fontSize="10" fontWeight="700" fill={C.good} fontFamily="inherit">Governance grows on the foundation →</text>
    </svg>
  );
}

/* Nexora — the seven parts lock into one structure (roof · pillars · base). */
export function ArchitectureDiagram({
  className,
  components,
}: DiagramProps & { components: { id: string; title: string; pillar: string }[] }) {
  const pillars = ["Report", "Own", "Lifecycle", "Steer"];
  const numOf = (title: string) => title.trim().charAt(0);
  const grouped = pillars.map((p) => ({
    p,
    nums: components.filter((c) => c.pillar === p).map((c) => numOf(c.title)),
  }));
  const px = (i: number) => 40 + i * 86;
  return (
    <svg viewBox="0 0 380 206" className={className ?? wrap} role="img" aria-label="A temple: a decision-architecture roof on four pillars — Report, Own, Lifecycle, Steer — each carrying the numbered components, on a base of steering under uncertainty">
      {/* roof */}
      <path d="M14 44 L190 12 L366 44 Z" fill={C.navy} />
      <text x="190" y="36" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.paper} fontFamily="inherit">Decision architecture</text>
      {/* pillars */}
      {grouped.map((g, i) => (
        <g key={g.p}>
          <rect x={px(i) - 26} y="52" width="52" height="112" rx="6" fill={C.lilac} stroke={C.line} />
          <text x={px(i)} y="70" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.navy} fontFamily="inherit">{g.p}</text>
          {g.nums.map((n, j) => (
            <g key={n}>
              <circle cx={px(i)} cy={90 + j * 26} r="10" fill={C.purple} />
              <text x={px(i)} y={94 + j * 26} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.paper} fontFamily="inherit">{n}</text>
            </g>
          ))}
        </g>
      ))}
      {/* base */}
      <rect x="14" y="168" width="352" height="26" rx="6" fill={C.purple} />
      <text x="190" y="185" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.paper} fontFamily="inherit">keeps steering — even under incomplete information</text>
    </svg>
  );
}

/* Block 2 — the one defensible comparison: 2-year vs 4-year replacement cycle,
   embodied CO2e only, for the one office with a complete asset register. */
export function CarbonCompareDiagram({
  className,
  office,
  units,
  pcfPerUnit,
  windowYears,
}: DiagramProps & {
  office: string;
  units: number;
  pcfPerUnit: number;
  windowYears: number;
}) {
  const reps2 = windowYears / 2;
  const reps4 = windowYears / 4;
  const t2 = (units * pcfPerUnit * reps2) / 1000;
  const t4 = (units * pcfPerUnit * reps4) / 1000;
  const diff = t2 - t4;
  const maxT = Math.max(t2, t4);
  const barHeight = (v: number) => (v / maxT) * 118;
  const base = 172;
  const bars = [
    { x: 56, w: 74, v: t2, label: "Every 2 years", color: C.danger },
    { x: 190, w: 74, v: t4, label: "Every 4 years", color: C.good },
  ];
  return (
    <svg
      viewBox="0 0 320 220"
      className={className ?? wrap}
      role="img"
      aria-label={`Embodied CO2e over ${windowYears} years at ${office}: ${t2.toFixed(1)} tonnes on a 2-year replacement cycle versus ${t4.toFixed(1)} tonnes on a 4-year cycle`}
    >
      <text x="160" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.purple} fontFamily="inherit">
        Embodied CO₂e, {windowYears}-year window — {office}
      </text>
      <line x1="26" y1={base} x2="294" y2={base} stroke={C.line} strokeWidth="1.5" />
      {bars.map((b) => {
        const h = barHeight(b.v);
        return (
          <g key={b.label}>
            <rect x={b.x} y={base - h} width={b.w} height={h} rx="6" fill={b.color} opacity="0.85" />
            <text x={b.x + b.w / 2} y={base - h - 10} textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink} fontFamily="inherit">
              {b.v.toFixed(1)} t
            </text>
            <text x={b.x + b.w / 2} y={base + 18} textAnchor="middle" fontSize="10" fill={C.ash} fontFamily="inherit">
              {b.label}
            </text>
          </g>
        );
      })}
      <text x="160" y="205" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.navy} fontFamily="inherit">
        Δ {diff.toFixed(1)} t CO₂e — halving the cycle roughly doubles it
      </text>
    </svg>
  );
}

/* Task — the priority matrix: carbon impact vs readiness to act, plotted by
   signal. Reused for the learner's live matrix and the revealed model one;
   dots at the same cell spread out so overlapping signals stay legible. */
export type QuadrantDot = {
  id: string;
  label: string;
  x: "low" | "high";
  y: "low" | "high" | "either";
  color: string;
};

export function QuadrantDiagram({
  className,
  dots,
  xLabel,
  yLabel,
  zoneLabels,
}: DiagramProps & {
  dots: QuadrantDot[];
  xLabel: string;
  yLabel: string;
  zoneLabels: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
}) {
  const left = 46;
  const right = 318;
  const top = 22;
  const bottom = 244;
  const midX = (left + right) / 2;
  const midY = (top + bottom) / 2;

  const xPos = (v: QuadrantDot["x"]) =>
    v === "low" ? left + (midX - left) / 2 : midX + (right - midX) / 2;
  const yPos = (v: QuadrantDot["y"]) =>
    v === "high" ? top + (midY - top) / 2 : v === "low" ? midY + (bottom - midY) / 2 : midY;

  // Cluster dots landing on the same cell and spread them so labels stay readable.
  const groups = new Map<string, QuadrantDot[]>();
  dots.forEach((d) => {
    const key = `${d.x}:${d.y}`;
    groups.set(key, [...(groups.get(key) ?? []), d]);
  });
  const placed = dots.map((d) => {
    const group = groups.get(`${d.x}:${d.y}`)!;
    const i = group.findIndex((g) => g.id === d.id);
    const offset = (i - (group.length - 1) / 2) * 20;
    return { ...d, cx: xPos(d.x) + offset, cy: yPos(d.y) };
  });

  return (
    <svg
      viewBox="0 0 340 300"
      className={className ?? wrap}
      role="img"
      aria-label={`A quadrant of carbon impact against readiness to act, with ${dots.length} signal${dots.length === 1 ? "" : "s"} plotted`}
    >
      <rect x={left} y={top} width={right - left} height={bottom - top} fill="none" stroke={C.line} strokeWidth="1.5" />
      <line x1={midX} y1={top} x2={midX} y2={bottom} stroke={C.line} strokeWidth="1.2" strokeDasharray="4 4" />
      <line x1={left} y1={midY} x2={right} y2={midY} stroke={C.line} strokeWidth="1.2" strokeDasharray="4 4" />

      <text x={left + 6} y={top + 15} fontSize="8.5" fontWeight="700" fill={C.ash} fontFamily="inherit">{zoneLabels.topLeft}</text>
      <text x={right - 6} y={top + 15} textAnchor="end" fontSize="8.5" fontWeight="700" fill={C.ash} fontFamily="inherit">{zoneLabels.topRight}</text>
      <text x={left + 6} y={bottom - 7} fontSize="8.5" fontWeight="700" fill={C.ash} fontFamily="inherit">{zoneLabels.bottomLeft}</text>
      <text x={right - 6} y={bottom - 7} textAnchor="end" fontSize="8.5" fontWeight="700" fill={C.ash} fontFamily="inherit">{zoneLabels.bottomRight}</text>

      {placed.map((d) => (
        <g key={d.id}>
          <circle cx={d.cx} cy={d.cy} r="11" fill={d.color} stroke={C.paper} strokeWidth="1.5" />
          <text x={d.cx} y={d.cy + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill={d.color === C.control ? C.navy : C.paper} fontFamily="inherit">
            {d.label}
          </text>
        </g>
      ))}

      <text x={(left + right) / 2} y={bottom + 26} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.ink} fontFamily="inherit">
        {xLabel} →
      </text>
      <text
        x={16}
        y={(top + bottom) / 2}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill={C.ink}
        fontFamily="inherit"
        transform={`rotate(-90 16 ${(top + bottom) / 2})`}
      >
        {yLabel} →
      </text>
    </svg>
  );
}
