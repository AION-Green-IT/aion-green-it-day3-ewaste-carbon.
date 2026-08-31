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

export type Clue = {
  id: string;
  text: string;
  answer: string;
  explain: string;
  why: string;
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

export type SectionId = "basics" | "task1" | "task2" | "bluegrid" | "nexora";

type SectionBase = {
  id: SectionId;
  nav: string;
  kicker: string;
  title: string;
  intro: string;
  doneRule: string;
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
  "task2",
  "bluegrid",
  "nexora",
];
