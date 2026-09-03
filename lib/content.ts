// Typed access to content/day3.json. The UI never hardcodes copy — it reads it
// from here, so a future module (Day 4, …) reuses every component by swapping
// the JSON. Keep these types in step with the JSON shape.

import raw from "@/content/day3.json";

export type Concept = {
  id: string;
  title: string;
  /** Key into the visual registry (components/visuals). */
  visual: string;
  /** One line under the diagram: how its parts connect. */
  relation: string;
  points: string[];
  analogy: string;
  example: string;
  /** The management application — "what you use it for". */
  useFor: string;
};

export type ConceptMap = {
  title: string;
  caption: string;
  visual: string;
};

export type RiskCategory = {
  code: string;
  name: string;
  blurb: string;
  hex: string;
};

/** Low/high toggle answer; "either" is only valid for a model answer key. */
export type QuadrantLevel = "low" | "high" | "either";

export type Clue = {
  id: string;
  text: string;
  answer: string;
  /** True when this signal is real evidence of the diagnosed weak area; false when it's a plausible-looking decoy. */
  weak: boolean;
  explain: string;
  why: string;
  /** Model answer key for the priority-matrix follow-up — carbon impact if fixed. */
  modelCarbon: QuadrantLevel;
  /** Model answer key — readiness to act on it today. */
  modelReadiness: QuadrantLevel;
};

export type Diagnosis = {
  prompt: string;
  /** Category code (matches a RiskCategory.code) that the evidence actually points to. */
  correct: string;
  correctVerdict: string;
  incorrectVerdict: string;
};

/** Copy for the priority-matrix mini-game that follows the signal sort. */
export type QuadrantCopy = {
  title: string;
  intro: string;
  carbonQuestion: string;
  readinessQuestion: string;
  low: string;
  high: string;
  xLabel: string;
  yLabel: string;
  zoneLabels: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  compareLabel: string;
  compareLocked: string;
  yourTitle: string;
  modelTitle: string;
  modelInsight: string;
  eitherNote: string;
};

export type Consequence = {
  headline: string;
  points: string[];
};

export type PriorityOption = {
  id: string;
  label: string;
  summary: string;
  /** Position on the two axes of the trade-off map (1–3 each). */
  axis: { visible: number; steer: number };
  consequence: Consequence;
};

export type CaseOption = {
  id: string;
  label: string;
  recommended: boolean;
  verdict: string;
  detail: string;
  reasons: string[];
};

export type Horizon = {
  id: string;
  label: string;
  items: string[];
};

export type NexoraComponent = {
  id: string;
  title: string;
  prompt: string;
  /** Which pillar of the decision architecture it belongs to. */
  pillar: string;
};

export type SectionId = "basics" | "task1" | "data" | "task2" | "bluegrid" | "nexora";

type SectionBase = {
  id: SectionId;
  nav: string;
  kicker: string;
  title: string;
  intro: string;
  doneRule: string;
  /**
   * Optional per-section "start over" affordance. When both are present the
   * page renders a reset button in the section header; sections without them
   * simply have none.
   */
  resetLabel?: string;
  resetNote?: string;
};

export type BasicsSection = SectionBase & {
  id: "basics";
  concepts: Concept[];
  map: ConceptMap;
};

export type Task1Section = SectionBase & {
  id: "task1";
  areasRelation: string;
  areasVisual: string;
  categories: RiskCategory[];
  clues: Clue[];
  /** The synthesis step: which one area the sorted evidence actually points to. Its pick is carried forward as input to the next task. */
  diagnosis: Diagnosis;
  quadrant: QuadrantCopy;
  exportNote: {
    heading: string;
    subheading: string;
    watermark: string;
    controlsTitle: string;
    controlsIntro: string;
    nameLabel: string;
    namePlaceholder: string;
    exportLabel: string;
    signalSortTitle: string;
    matrixTitle: string;
    verdictTitle: string;
    notCompleted: string;
  };
};

export type DataScenario = {
  office: string;
  model: string;
  /** Fleet size at this one office — the only input the learner doesn't derive. */
  units: number;
  /** Embodied carbon per unit, kg CO2e, from the vendor's PCF datasheet. */
  pcfPerUnit: number;
  pcfSource: string;
  /** Comparison horizon in years — a common multiple of the two cycles being compared. */
  windowYears: number;
  note: string;
};

export type DataDraft = {
  label: string;
  helper: string;
  placeholder: string;
};

export type DataSection = SectionBase & {
  id: "data";
  scenario: DataScenario;
  whyOnlyOneOffice: string;
  draft: DataDraft;
  turn: string;
};

export type Task2Section = SectionBase & {
  id: "task2";
  tradeoffRelation: string;
  tradeoffVisual: string;
  prompt: string;
  options: PriorityOption[];
  coachNote: string;
};

export type BlueGridSection = SectionBase & {
  id: "bluegrid";
  situation: string[];
  levers: string[];
  prompt: string;
  options: CaseOption[];
  horizonsRelation: string;
  horizonsVisual: string;
  horizons: Horizon[];
};

export type NexoraSection = SectionBase & {
  id: "nexora";
  seniorNote: string;
  architectureRelation: string;
  architectureVisual: string;
  components: NexoraComponent[];
  reflection: { title: string; questions: string[] };
};

export type Section =
  | BasicsSection
  | Task1Section
  | DataSection
  | Task2Section
  | BlueGridSection
  | NexoraSection;

export type Stake = {
  icon: string;
  label: string;
  text: string;
};

export type Opening = {
  kicker: string;
  scene: string;
  turn: string;
  stakes: Stake[];
};

export type LiteracyFact = {
  stat: string;
  label: string;
  detail: string;
  source: string;
};

/**
 * The bridge between the cold-open and Basics: why the concepts below are
 * worth the learner's time, grounded in real numbers, before they open one.
 */
export type Roadmap = {
  kicker: string;
  title: string;
  intro: string;
  facts: LiteracyFact[];
  factsNote: string;
  /** Key into the visual registry (components/visuals). */
  visual: string;
  visualCaption: string;
  turn: string;
};

export type Day3Content = {
  meta: {
    module: string;
    logoLabel: string;
    title: string;
    subtitle: string;
    levelNote: string;
    howToUse: string;
    footerLine: string;
  };
  opening: Opening;
  roadmap: Roadmap;
  progress: { byMessages: { upTo: number; text: string }[] };
  sections: Section[];
  glossary: {
    title: string;
    hint: string;
    terms: { term: string; def: string }[];
  };
};

export const content = raw as Day3Content;

export function getSection<T extends Section>(id: T["id"]): T {
  const s = content.sections.find((x) => x.id === id);
  if (!s) throw new Error(`Missing section "${id}" in day3.json`);
  return s as T;
}

/** Order of the progress milestones — one per mechanic/section. */
export const SECTION_ORDER: SectionId[] = [
  "basics",
  "task1",
  "data",
  // "task2", — hidden for now, keep in content.day3.json for later use
  // "bluegrid", — hidden for now, keep in content.day3.json for later use
  "nexora",
];
