# AION Green IT — Module 2, Day 3

**E-Waste & Carbon Accounting in IT** — the interactive working companion learners
use during the day's independent work blocks (an 8-hour class: 1h lecture / 2h
work, three cycles). It does not replace the lecture; it is the surface learners
run mechanics on between them.

This is the lighter, more duplicable sibling of the Day 2 site
(`IT as an Environmental Factor`). It keeps Day 2's visual language and swaps its
multi-tab depth for **one scrolling page** with four short mechanics.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Zustand
- **State:** `localStorage` only — no backend, no auth, no accounts
- **Output:** static export (`out/`), deploy-ready to Vercel (or any static host)

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static export → ./out
npm run typecheck  # tsc --noEmit
```

Deploy: point Vercel at the repo. `next.config.mjs` sets `output: "export"`, so
Vercel serves the prerendered `out/` directory — no Next.js server runs in
production. (You can also drag `out/` onto any static host.)

---

## The one rule that makes this a template

**All copy and data live in [`content/day3.json`](content/day3.json). No strings
are hardcoded in components.** The UI reads content through the typed loader in
[`lib/content.ts`](lib/content.ts). To build the next module, you change the JSON
— not the components.

### Folder map

```
content/day3.json      → every string, clue, option and consequence
lib/
  content.ts           → types + typed loader for the JSON
  store.ts             → generic localStorage progress store (reusable as-is)
  progress.ts          → joins store + content to decide what "done" means
components/
  chrome/              → TopBar (single progress bar), Footer (glossary), Opening (cold-open story)
  ui/                  → Section wrapper, ConfirmDialog, Collapsible, Explainer (titled collapsible)
  mechanics/           → the four interactive blocks (generic over their content)
  visuals/             → SVG relationship diagrams + registry (keyed by content `visual`)
app/
  layout.tsx           → shell (top bar, main, footer)
  page.tsx             → assembles the single scroll page from the sections
```

### The four mechanics (each generic over its content)

| Section id | Component         | What it does                                             |
|------------|-------------------|----------------------------------------------------------|
| `basics`   | `Basics`          | Open-to-reveal concept cards (points + "why it matters") |
| `task1`    | `RiskCategorizer` | Sort clues into 3 areas; reveal reasoning, no score      |
| `task2`    | `PriorityPicker`  | Pick one option; reveal its trade-off + coach's note     |
| `bluegrid` | `CasePriority`    | Choose a first step; compare with the recommendation     |
| `nexora`   | `StarterKit`      | 7-part checklist + autosaving notes (self-paced)         |

---

## Making Day 4 (or any next module)

1. **Copy this repo** and rename it in the Day-N pattern
   (`aion-green-it-day4-...`).
2. **Rewrite `content/day3.json`** (rename to `day4.json` and update the single
   import in `lib/content.ts` if you like). Keep the **same section `id`s and
   shapes** — the components are keyed to them:
   - `opening` — `{ kicker, scene, turn, stakes[]{ icon, label, text } }` (the cold-open)
   - `basics.concepts[]` — `{ id, title, visual, relation, points[], analogy, example, useFor }`
   - `basics.map` — `{ title, caption, visual }`
   - `task1` — `{ areasRelation, areasVisual, categories[] (3), clues[]{ id, text, answer, explain, why } }`
   - `task2.options[]` — `{ id, label, summary, axis{ visible, steer }, consequence }` + `tradeoffRelation`
   - `bluegrid` — `situation[]`, `levers[]`, `options[]` (one `recommended: true`), `horizonsRelation`, `horizons[]`
   - `nexora.components[]` — `{ …, pillar }` (Report/Own/Lifecycle/Steer) + `reflection`
   - `progress.byMessages[]` — the dynamic header line per % band
   - `glossary.terms[]` — keep it to the 5–8 terms the page actually uses
3. **That's it.** No component edits are needed for a same-shape module. The
   progress bar, section chips, reset flow and glossary all recompute from the
   new JSON.

**Visuals.** Each concept and each section explainer draws an SVG diagram that
shows how its parts *relate* — collapsed to a title by default (via
`components/ui/Explainer.tsx`) so the page stays tidy, and opening into diagram +
analogy + example + "use it for". A concept's `visual` string keys into
`components/visuals/registry.tsx`; to add a diagram, write an SVG component (see
`BasicsDiagrams.tsx` — mind the unique `<defs>` ids) and register it. Diagram
colours come from `components/visuals/palette.ts`, which mirrors the tokens.

If a future module needs a *new kind* of mechanic, add one component under
`components/mechanics/`, give its section a new `id` in the JSON and in
`SECTION_ORDER` / `useSectionStatuses` (`lib/`), and wire it into `app/page.tsx`.
Everything else stays put.

### Design tokens are shared with Day 2

`tailwind.config.ts` carries the same brand tokens as Day 2 (navy `#231A45`,
purple `#5624D0`, lilac `#EEE9F9`, ink, ash, line, plus good/warn/danger), the
same type scale and the same `Calibri` stack, so the two days read as one product
family. The only Day-3 addition is the three-colour `risk.*` group for the
categorize mechanic. Don't restyle the shared tokens.

---

## Progress model

One bar in the header = the share of the five milestones a learner has *run
through* (`lib/progress.ts`):

- `basics` — every concept card opened
- `task1` — every clue sorted
- `task2` / `bluegrid` — a pick made
- `nexora` — at least one component ticked

A single dynamic line under the bar changes with the percentage; no XP, streaks
or badges. Everything is stored under the `aion-greenit-day3` localStorage key and
cleared by **Reset progress**. There is no punishing right/wrong — the mechanics
always reveal their reasoning, in the Day 2 spirit that *being wrong costs
nothing*.

---

## A note on `npm audit`

`npm audit` flags advisories against `next`. They all concern the **Next.js
server runtime** (Image Optimizer, Server Actions, rewrites, middleware, RSC
DoS/SSRF). This app is a **static export** — no server, no image optimizer, no
middleware, no server actions — so none of them apply to the deployed `out/`.
Next is pinned to the latest patched **14.2.x** (which fixes the Dec-2025
critical) to stay on the Day 2 line, and `postcss` is force-upgraded via
`overrides`. Moving to Next 16 would clear the remaining lines but is a breaking
change off that line, so it is intentionally not taken here.
