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
    /** Short, filename-safe description of this deliverable — the "which task" part of every export's filename. */
    taskLabel: string;
    signalSortTitle: string;
    matrixTitle: string;
    verdictTitle: string;
    notCompleted: string;
  };
};

/**
 * The trainer-tunable numbers behind Work Block #2's playground. One office
 * only, deliberately — see Task's Control finding for why the rest of the
 * fleet isn't countable yet. Every figure the UI shows is derived from this
 * object, so tuning it here never drifts out of sync with the interactive
 * meters or the exported report.
 */
export type WorkBlock2Config = {
  office: string;
  /** Laptop count at this one office — the only fleet number that's real. */
  unitsInOffice: number;
  /** Manufacturing-embodied carbon per laptop, kg CO2e. */
  pcfPerUnitKg: number;
  pcfSource: string;
  cycleMin: number;
  cycleMax: number;
  cycleStep: number;
  cycleDefault: number;
  /** Residual value recovered, % of purchase price, at the shortest cycle (cycleMin). */
  residualAtMinCyclePct: number;
  /** Residual value recovered, % of purchase price, at the longest cycle (cycleMax). */
  residualAtMaxCyclePct: number;
  /**
   * Flags "diminishing returns" once the marginal saving for one more step
   * falls below this % of the very first step's saving — a computed knee,
   * not an asserted year, so retuning the fleet numbers retunes the knee too.
   */
  diminishingReturnsThresholdPct: number;

  // --- Part A ("do the math by hand") — same case, three more reference
  // numbers and a second office, added here rather than inlined in the
  // question component so every number stays trainer-editable in one place.
  /** Embodied carbon per unit for the office's second laptop model, kg CO2e. */
  modelBPcfPerUnitKg: number;
  /** Embodied carbon released per unit sent to landfill instead of tracked, kg CO2e. */
  disposalLandfillKg: number;
  /** Embodied carbon released per unit through a certified recycler, kg CO2e. */
  disposalRecyclerKg: number;
  /** The fixed cycle length Q1 asks about — independent of the Part B slider's own range. */
  partAQuizCycleYears: number;
  /** A second office, mixed fleet, used only for the Part A worked questions. */
  officeB: {
    name: string;
    modelAUnits: number;
    modelBUnits: number;
    cycleYears: number;
  };
  /** Nexora's total country-office count — what Q5 asks the learner to reason about extrapolating to. */
  fleetOfficeCount: number;
};

export type CarbonTableRow = {
  item: string;
  category: string;
  /** Which WorkBlock2Config field holds this row's number — the table reads the value live, never a second copy of it. */
  configKey: "pcfPerUnitKg" | "modelBPcfPerUnitKg" | "disposalLandfillKg" | "disposalRecyclerKg";
  unit: string;
  /** Short code the auto-calculator's factor pickers show and reference — the "keterangan" that ties a picked factor back to its table row. */
  ref: string;
};

export type PartAQuestion = {
  id: string;
  /**
   * "number" checks the typed value against a computed answer within
   * tolerance. "text" (Q5 only) checks for refusal wording and separately
   * flags — never blocks on — an attempt to compute a specific figure.
   */
  kind: "number" | "text";
  /** Question text with {tokens} — see PartA component for the substitution list (unitsA, cycleA, officeB, unitsBA, unitsBB, cycleB, totalB, fleetOffices). */
  prompt: string;
  unit?: string;
  placeholder: string;
};

export type DataSection = SectionBase & {
  id: "data";
  config: WorkBlock2Config;
  marginalLabel: string;
  diminishingLabel: string;
  diminishingHelp: string;
  startingPointLabel: string;
  lockedLabel: string;
  lockedNote: string;
  justification: {
    cycleLabel: string;
    cyclePlaceholder: string;
    gapLabel: string;
    gapPlaceholder: string;
  };
  exportLabel: string;
  /** Short, filename-safe description of this deliverable — the "which task" part of every export's filename. */
  taskLabel: string;
  exportNote: {
    watermark: string;
    heading: string;
    subheading: string;
    scopeTitle: string;
    calcTitle: string;
    justificationTitle: string;
    closingLine: string;
  };
  turn: string;
  /** The hand-worked half of the block, shown above the slider playground. */
  partA: {
    kicker: string;
    title: string;
    intro: string;
    tableTitle: string;
    formulaLabel: string;
    table: CarbonTableRow[];
    /** The auto-calculator: picks factors by their table `ref` instead of retyping numbers, and computes live. */
    calculator: {
      title: string;
      help: string;
      carbonModeLabel: string;
      disposalModeLabel: string;
      unitsLabel: string;
      cycleLabel: string;
      factorLabel: string;
      factor1Label: string;
      factor2Label: string;
      addModelLabel: string;
      removeModelLabel: string;
      totalLabel: string;
      tonnesToggleLabel: string;
      carbonFormula: string;
      disposalFormula: string;
    };
    questions: PartAQuestion[];
    correctFeedback: string;
    retryFeedback: string;
    /** Shown when Q5 is answered with a specific number instead of a refusal — never a hard "wrong". */
    q5FlagHint: string;
    /** Shown above Q5's own reference box before Task's diagnosis has landed. */
    q5NoTaskYet: string;
  };
  partBKicker: string;
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

/** One reference-box source the Report Builder can pull earlier work from. */
export type ReportReferenceKind = "task1Verdict" | "task1Gap" | "block2Number" | "block2Gap";

export type ReportStep = {
  /** Which existing NexoraComponent (n1..n7) this step drafts — the only link between memo order and site order. */
  componentId: string;
  caption: string;
  reference?: ReportReferenceKind;
  /** Generic, content-free sentence-starter shown behind "Need a clue?". */
  clue: string;
};

export type ReportBuilderCopy = {
  docTitle: string;
  header: {
    title: string;
    toLabel: string;
    toCaption: string;
    toPlaceholder: string;
    fromLabel: string;
    fromCaption: string;
    fromPlaceholder: string;
    subjectLabel: string;
    subjectCaption: string;
    subjectPlaceholder: string;
  };
  clueToggleLabel: string;
  reference: {
    task1VerdictLabel: string;
    task1GapLabel: string;
    block2NumberLabel: string;
    block2GapLabel: string;
    task1Placeholder: string;
    block2Placeholder: string;
  };
  /** In memo reading order — NOT the order `components` lists n1..n7 in. */
  steps: ReportStep[];
  closingLine: string;
  exportLabel: string;
  exportWatermark: string;
  /** Short, filename-safe description of this deliverable — the "which task" part of every export's filename. */
  taskLabel: string;
};

export type NexoraSection = SectionBase & {
  id: "nexora";
  seniorNote: string;
  architectureRelation: string;
  architectureVisual: string;
  components: NexoraComponent[];
  reflection: { title: string; questions: string[] };
  reportBuilder: ReportBuilderCopy;
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
  /**
   * Asked once, before any work block — every export's filename and printed
   * header reuse this same name, so the learner never re-types it.
   */
  namePrompt: {
    title: string;
    caption: string;
    nameLabel: string;
    namePlaceholder: string;
  };
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
