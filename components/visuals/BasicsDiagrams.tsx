import { C, type DiagramProps } from "./palette";

// Executive infographic diagrams for the six Basics concepts + the summary map.
// Each one shows how its parts RELATE, not just an icon — the point is a learner
// can read the relationship off the picture before opening the text.
//
// Every gradient / marker id is prefixed per-diagram: SVG defs ids are global to
// the page, so collisions would silently corrupt other diagrams.

const wrap = "w-full h-auto";

function Arrow({ id, color }: { id: string; color: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L10 5 L0 10 z" fill={color} />
    </marker>
  );
}

/* 1 · What e-waste is — one device → four management concerns → the desk. */
export function StakesDiagram({ className }: DiagramProps) {
  const chips = [
    { y: 24, label: "Capital", note: "tied-up value" },
    { y: 62, label: "Compliance", note: "legal duty" },
    { y: 100, label: "Data security", note: "wipe & track" },
    { y: 138, label: "Reputation", note: "audit-proof?" },
  ];
  return (
    <svg viewBox="0 0 360 176" className={className ?? wrap} role="img" aria-label="One retired device connects to capital, compliance, data security and reputation, all landing on the management desk">
      <defs><Arrow id="stk-a" color={C.ash} /></defs>
      {/* device */}
      <g>
        <rect x="14" y="66" width="66" height="44" rx="5" fill={C.navy} />
        <rect x="22" y="72" width="50" height="30" rx="2" fill={C.lilac} />
        <rect x="8" y="110" width="78" height="6" rx="3" fill={C.navy} />
        <text x="47" y="132" textAnchor="middle" fontSize="10" fill={C.ash} fontFamily="inherit">retired device</text>
      </g>
      {/* chips */}
      {chips.map((c) => (
        <g key={c.label}>
          <line x1="86" y1="88" x2="150" y2={c.y + 14} stroke={C.line} strokeWidth="1.5" markerEnd="url(#stk-a)" />
          <rect x="150" y={c.y} width="128" height="30" rx="8" fill={C.paper} stroke={C.line} />
          <text x="162" y={c.y + 13} fontSize="12" fontWeight="600" fill={C.ink} fontFamily="inherit">{c.label}</text>
          <text x="162" y={c.y + 25} fontSize="9.5" fill={C.ash} fontFamily="inherit">{c.note}</text>
          <line x1="278" y1={c.y + 15} x2="308" y2="88" stroke={C.line} strokeWidth="1.5" markerEnd="url(#stk-a)" />
        </g>
      ))}
      {/* management node */}
      <rect x="308" y="66" width="46" height="44" rx="8" fill={C.purple} />
      <text x="331" y="84" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.paper} fontFamily="inherit">Mgmt</text>
      <text x="331" y="97" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.paper} fontFamily="inherit">desk</text>
    </svg>
  );
}

/* 2 · Where e-waste comes from — four upstream causes funnel into the bin. */
export function CausesDiagram({ className }: DiagramProps) {
  const causes = ["Short replace cycle", "No repair path", "Little reuse", "Unstructured returns"];
  return (
    <svg viewBox="0 0 360 176" className={className ?? wrap} role="img" aria-label="Four upstream causes funnel downstream into an overflowing e-waste bin">
      <defs><Arrow id="cau-a" color={C.source} /></defs>
      <text x="12" y="16" fontSize="10" fontWeight="700" fill={C.source} fontFamily="inherit">DECIDED UPSTREAM</text>
      {causes.map((t, i) => (
        <g key={t}>
          <rect x="12" y={28 + i * 32} width="150" height="24" rx="6" fill={C.paper} stroke={C.line} />
          <text x="22" y={44 + i * 32} fontSize="11" fill={C.ink} fontFamily="inherit">{t}</text>
          <line x1="162" y1={40 + i * 32} x2="214" y2="88" stroke={C.source} strokeWidth="1.5" markerEnd="url(#cau-a)" />
        </g>
      ))}
      {/* funnel */}
      <path d="M214 60 L262 60 L244 96 L232 96 Z" fill={C.lilac} stroke={C.line} />
      {/* bin */}
      <text x="300" y="42" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.ash} fontFamily="inherit">APPEARS</text>
      <text x="300" y="54" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.ash} fontFamily="inherit">DOWNSTREAM</text>
      <path d="M276 96 L324 96 L318 150 L282 150 Z" fill={C.navy} />
      <rect x="272" y="88" width="56" height="10" rx="2" fill={C.navy} />
      {/* overflow */}
      <rect x="286" y="72" width="10" height="14" rx="2" fill={C.control} />
      <rect x="300" y="66" width="10" height="20" rx="2" fill={C.cycle} />
      <line x1="248" y1="96" x2="270" y2="104" stroke={C.source} strokeWidth="1.5" markerEnd="url(#cau-a)" />
    </svg>
  );
}

/* 3 · The disposal ladder — rungs ranked by how much embodied energy is kept. */
export function LadderDiagram({ className }: DiagramProps) {
  const rungs = [
    { t: "Disposal", c: C.danger },
    { t: "Recycling", c: C.warn },
    { t: "Remanufacture", c: "#A98A2E" },
    { t: "Refurbishment", c: "#7FA24A" },
    { t: "Reuse", c: C.good },
    { t: "Prevention", c: "#1F7A46" },
  ];
  const n = rungs.length;
  return (
    <svg viewBox="0 0 360 192" className={className ?? wrap} role="img" aria-label="A six-rung ladder from disposal up to prevention; higher rungs keep more embodied energy">
      <defs><Arrow id="lad-a" color={C.good} /></defs>
      {rungs.map((r, i) => {
        const w = 44 + i * 44;
        const y = 168 - i * 26;
        return (
          <g key={r.t}>
            <rect x="40" y={y} width={w} height="22" rx="4" fill={r.c} opacity={0.9} />
            <text x={48} y={y + 15} fontSize="11" fontWeight="600" fill={C.paper} fontFamily="inherit">{r.t}</text>
          </g>
        );
      })}
      {/* energy-kept axis */}
      <line x1="24" y1="182" x2="24" y2="16" stroke={C.line} strokeWidth="1.5" markerEnd="url(#lad-a)" />
      <text x="20" y="12" fontSize="9.5" fill={C.good} fontFamily="inherit" transform="rotate(0 20 12)">more energy &amp; value kept</text>
      <text x="300" y={168 - (n - 1) * 26 - 6} fontSize="9.5" fill={C.ash} fontFamily="inherit">top of ladder</text>
      <text x="150" y="186" fontSize="9.5" fill={C.ash} fontFamily="inherit">bottom = throw the build-energy away</text>
    </svg>
  );
}

/* 4 · Carbon scopes — how 1/2/3 nest around the company boundary. */
export function ScopesDiagram({ className }: DiagramProps) {
  return (
    <svg viewBox="0 0 344 232" className={className ?? wrap} role="img" aria-label="Scope 1 sits inside the company boundary, Scope 2 is bought energy crossing it, Scope 3 wraps around it up- and downstream">
      <defs>
        <Arrow id="sco-in" color={C.control} />
        <Arrow id="sco-out" color={C.source} />
      </defs>
      {/* Scope 3 outer band */}
      <rect x="8" y="8" width="328" height="158" rx="14" fill={C.lilac} stroke={C.line} />
      <text x="20" y="24" fontSize="10.5" fontWeight="700" fill={C.source} fontFamily="inherit">SCOPE 3 · up- &amp; downstream — biggest slice for IT</text>
      {/* upstream */}
      <g>
        <path d="M24 66 h30 v26 h-30 z" fill={C.paper} stroke={C.source} />
        <path d="M24 66 l15 -10 l15 10 z" fill={C.source} />
        <text x="26" y="104" fontSize="9.5" fill={C.ash} fontFamily="inherit">make · ship</text>
      </g>
      {/* downstream */}
      <g>
        <path d="M292 60 q10 0 10 10 q10 0 8 10 h-30 q-6 -10 4 -12 q0 -8 8 -8 z" fill={C.paper} stroke={C.source} />
        <path d="M290 92 l8 -8 m0 8 l8 -8" stroke={C.source} strokeWidth="2" fill="none" />
        <text x="300" y="106" textAnchor="middle" fontSize="9.5" fill={C.ash} fontFamily="inherit">cloud · disposal</text>
      </g>
      {/* company boundary */}
      <rect x="102" y="42" width="140" height="112" rx="10" fill={C.paper} stroke={C.navy} strokeWidth="1.5" strokeDasharray="5 4" />
      <text x="172" y="58" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.navy} fontFamily="inherit">YOUR COMPANY</text>
      {/* Scope 1 */}
      <rect x="120" y="70" width="104" height="30" rx="8" fill={C.navy} />
      <text x="172" y="85" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.paper} fontFamily="inherit">Scope 1</text>
      <text x="172" y="96" textAnchor="middle" fontSize="9" fill={C.lilac} fontFamily="inherit">direct · on-site</text>
      {/* Scope 2 */}
      <rect x="120" y="108" width="104" height="30" rx="8" fill={C.purple} />
      <text x="172" y="123" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.paper} fontFamily="inherit">Scope 2</text>
      <text x="172" y="134" textAnchor="middle" fontSize="9" fill={C.lilac} fontFamily="inherit">bought energy</text>
      {/* flows across the boundary */}
      <line x1="56" y1="80" x2="100" y2="86" stroke={C.source} strokeWidth="1.6" markerEnd="url(#sco-out)" />
      <line x1="244" y1="86" x2="284" y2="78" stroke={C.source} strokeWidth="1.6" markerEnd="url(#sco-out)" />
      {/* proportion bar */}
      <text x="8" y="188" fontSize="9.5" fontWeight="600" fill={C.ash} fontFamily="inherit">Typical IT footprint</text>
      <g>
        <rect x="8" y="196" width="26" height="16" fill={C.navy} />
        <rect x="34" y="196" width="70" height="16" fill={C.purple} />
        <rect x="104" y="196" width="232" height="16" fill={C.source} />
        <text x="21" y="226" textAnchor="middle" fontSize="8.5" fill={C.ash} fontFamily="inherit">S1</text>
        <text x="69" y="226" textAnchor="middle" fontSize="8.5" fill={C.ash} fontFamily="inherit">S2</text>
        <text x="220" y="226" textAnchor="middle" fontSize="8.5" fill={C.ash} fontFamily="inherit">Scope 3 — most of it</text>
      </g>
    </svg>
  );
}

/* 5 · Lifecycle hotspots — CO₂ spread around a closed loop. */
export function LifecycleDiagram({ className }: DiagramProps) {
  const cx = 150;
  const cy = 118;
  const r = 78;
  const nodes = [
    { a: -90, t: "Manufacture", hot: 20 },
    { a: -30, t: "Ship", hot: 8 },
    { a: 30, t: "Use", hot: 14 },
    { a: 90, t: "Operate", hot: 20 },
    { a: 150, t: "Replace", hot: 6 },
    { a: 210, t: "Dispose", hot: 10 },
  ];
  const pt = (a: number, rr = r) => [
    cx + rr * Math.cos((a * Math.PI) / 180),
    cy + rr * Math.sin((a * Math.PI) / 180),
  ];
  return (
    <svg viewBox="0 0 300 236" className={className ?? wrap} role="img" aria-label="Device lifecycle as a loop with CO2 hotspots of different sizes at manufacture, operation and disposal; recycling closes the loop">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.line} strokeWidth="1.5" strokeDasharray="3 4" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.navy} fontFamily="inherit">CO₂ around</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.navy} fontFamily="inherit">the whole loop</text>
      {nodes.map((n) => {
        const [x, y] = pt(n.a);
        return (
          <g key={n.t}>
            <circle cx={x} cy={y} r={n.hot} fill={C.danger} opacity={0.16} />
            <circle cx={x} cy={y} r="5" fill={C.purple} />
            <text x={x} y={y - n.hot - 4} textAnchor="middle" fontSize="10" fontWeight="600" fill={C.ink} fontFamily="inherit">{n.t}</text>
          </g>
        );
      })}
      {/* recycle-closes-loop marker */}
      <text x={cx} y="228" textAnchor="middle" fontSize="9.5" fill={C.good} fontFamily="inherit">recycling feeds materials back to the start ↺</text>
    </svg>
  );
}

/* 6 · Measure vs steer — data only matters once it feeds a decision. */
export function SteerDiagram({ className }: DiagramProps) {
  return (
    <svg viewBox="0 0 360 176" className={className ?? wrap} role="img" aria-label="Data sources feed a baseline which feeds a decision; a number with no decision attached is a report on a shelf">
      <defs><Arrow id="ste-a" color={C.purple} /><Arrow id="ste-d" color={C.ash} /></defs>
      {/* data sources */}
      {[28, 60, 92].map((y, i) => (
        <g key={y}>
          <rect x="14" y={y} width="34" height="24" rx="3" fill={C.paper} stroke={C.line} />
          <line x1="19" y1={y + 8} x2="43" y2={y + 8} stroke={C.line} />
          <line x1="19" y1={y + 14} x2="43" y2={y + 14} stroke={C.line} />
        </g>
      ))}
      <text x="14" y="130" fontSize="10" fill={C.ash} fontFamily="inherit">data sources</text>
      <line x1="50" y1="72" x2="94" y2="72" stroke={C.purple} strokeWidth="1.8" markerEnd="url(#ste-a)" />
      {/* baseline gauge */}
      <g>
        <path d="M104 92 a44 44 0 0 1 88 0" fill="none" stroke={C.line} strokeWidth="8" />
        <path d="M104 92 a44 44 0 0 1 66 -38" fill="none" stroke={C.purple} strokeWidth="8" />
        <line x1="148" y1="92" x2="176" y2="60" stroke={C.navy} strokeWidth="2.5" />
        <circle cx="148" cy="92" r="4" fill={C.navy} />
        <text x="148" y="112" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.ink} fontFamily="inherit">baseline</text>
      </g>
      <line x1="196" y1="72" x2="240" y2="72" stroke={C.purple} strokeWidth="1.8" markerEnd="url(#ste-a)" />
      {/* decision */}
      <g>
        <circle cx="286" cy="72" r="30" fill={C.paper} stroke={C.purple} strokeWidth="1.8" />
        <path d="M286 72 L286 48 M286 72 L266 86 M286 72 L306 86" stroke={C.purple} strokeWidth="2" fill="none" />
        <circle cx="286" cy="72" r="4" fill={C.purple} />
        <text x="286" y="118" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.ink} fontFamily="inherit">decision</text>
      </g>
      {/* dead-end branch */}
      <line x1="148" y1="120" x2="148" y2="150" stroke={C.ash} strokeWidth="1.4" strokeDasharray="4 4" markerEnd="url(#ste-d)" />
      <text x="158" y="150" fontSize="9.5" fill={C.ash} fontFamily="inherit">…or a report on a shelf</text>
    </svg>
  );
}

/* Summary map — both topics run the lifecycle and roll up into governance. */
export function ConnectionsMap({ className }: DiagramProps) {
  const stages = ["Procure", "Use", "Operate", "Replace", "Dispose"];
  return (
    <svg viewBox="0 0 380 190" className={className ?? wrap} role="img" aria-label="E-waste and carbon both run the length of the device lifecycle and roll up into governance and reporting">
      <defs><Arrow id="con-a" color={C.purple} /></defs>
      {/* governance box */}
      <rect x="90" y="12" width="200" height="30" rx="8" fill={C.navy} />
      <text x="190" y="31" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.paper} fontFamily="inherit">Governance &amp; Reporting</text>
      {/* two ribbons rolling up */}
      <line x1="150" y1="72" x2="150" y2="44" stroke={C.purple} strokeWidth="1.8" markerEnd="url(#con-a)" />
      <line x1="230" y1="72" x2="230" y2="44" stroke={C.purple} strokeWidth="1.8" markerEnd="url(#con-a)" />
      <rect x="24" y="72" width="150" height="22" rx="11" fill={C.control} opacity="0.9" />
      <text x="99" y="87" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.navy} fontFamily="inherit">E-waste</text>
      <rect x="206" y="72" width="150" height="22" rx="11" fill={C.source} opacity="0.9" />
      <text x="281" y="87" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.paper} fontFamily="inherit">Carbon</text>
      {/* lifecycle spine */}
      <line x1="24" y1="128" x2="356" y2="128" stroke={C.line} strokeWidth="2" />
      {stages.map((s, i) => {
        const x = 40 + i * 76;
        return (
          <g key={s}>
            <circle cx={x} cy="128" r="5" fill={C.purple} />
            <text x={x} y="150" textAnchor="middle" fontSize="10" fill={C.ink} fontFamily="inherit">{s}</text>
          </g>
        );
      })}
      <text x="190" y="176" textAnchor="middle" fontSize="9.5" fill={C.ash} fontFamily="inherit">both span the whole lifecycle — steer them together, not apart</text>
    </svg>
  );
}

/* Roadmap (pre-Basics bridge) — two literacy lanes converge into Basics, then
   flow through Task's diagnosis into Nexora's decision architecture. */
export function LiteracyRoadmapDiagram({ className }: DiagramProps) {
  const mechanics = ["What e-waste is", "Where it comes from", "The disposal ladder", "Scopes 1 · 2 · 3", "CO₂ hotspots"];
  return (
    <svg viewBox="0 0 360 320" className={className ?? wrap} role="img" aria-label="Five technical concepts and one steering mindset both feed into Basics, which flows into Task's diagnosis, then into Nexora's decision architecture">
      <defs><Arrow id="lit-a" color={C.purple} /></defs>

      {/* two lanes */}
      <text x="8" y="10" fontSize="9" fontWeight="700" fill={C.source} fontFamily="inherit">THE MECHANICS</text>
      {mechanics.map((t, i) => (
        <g key={t}>
          <rect x="8" y={16 + i * 26} width="150" height="20" rx="6" fill={C.paper} stroke={C.line} />
          <text x="16" y={30 + i * 26} fontSize="9.5" fill={C.ink} fontFamily="inherit">{t}</text>
        </g>
      ))}

      <text x="196" y="10" fontSize="9" fontWeight="700" fill={C.cycle} fontFamily="inherit">THE MINDSET</text>
      <rect x="196" y="67" width="148" height="22" rx="6" fill={C.paper} stroke={C.line} />
      <text x="204" y="82" fontSize="9" fill={C.ink} fontFamily="inherit">Steer, not just measure</text>

      {/* both lanes converge into Basics */}
      <line x1="83" y1="140" x2="150" y2="160" stroke={C.purple} strokeWidth="1.5" markerEnd="url(#lit-a)" />
      <line x1="270" y1="89" x2="210" y2="160" stroke={C.purple} strokeWidth="1.5" markerEnd="url(#lit-a)" />

      {/* the flow: Basics -> Task -> Nexora */}
      <rect x="75" y="160" width="210" height="28" rx="8" fill={C.navy} />
      <text x="180" y="178" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.paper} fontFamily="inherit">Basics — the vocabulary</text>

      <line x1="180" y1="188" x2="180" y2="202" stroke={C.purple} strokeWidth="1.8" markerEnd="url(#lit-a)" />

      <rect x="80" y="202" width="200" height="28" rx="8" fill={C.source} />
      <text x="180" y="220" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.paper} fontFamily="inherit">Task — the evidence</text>

      <line x1="180" y1="230" x2="180" y2="244" stroke={C.purple} strokeWidth="1.8" markerEnd="url(#lit-a)" />

      <rect x="70" y="244" width="220" height="30" rx="8" fill={C.control} />
      <text x="180" y="263" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.navy} fontFamily="inherit">Nexora — the decision</text>

      <line x1="180" y1="274" x2="180" y2="292" stroke={C.ash} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#lit-a)" />
      <text x="180" y="308" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={C.ash} fontFamily="inherit">→ whether you get the room</text>
    </svg>
  );
}
