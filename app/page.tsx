import {
  content,
  getSection,
  type BasicsSection,
  // type BlueGridSection, — hidden for now, keep for later use
  type DataSection,
  type NexoraSection,
  type Task1Section,
  // type Task2Section, — hidden for now, keep for later use
} from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Opening } from "@/components/chrome/Opening";
import { NamePrompt } from "@/components/chrome/NamePrompt";
import { Roadmap } from "@/components/chrome/Roadmap";
import { Basics } from "@/components/mechanics/Basics";
import { RiskCategorizer } from "@/components/mechanics/RiskCategorizer";
import { CarbonPlayground } from "@/components/mechanics/CarbonPlayground";
import { WorkBlock2Note } from "@/components/mechanics/WorkBlock2Note";
// import { PriorityPicker } from "@/components/mechanics/PriorityPicker"; — hidden for now, keep for later use
// import { CasePriority } from "@/components/mechanics/CasePriority"; — hidden for now, keep for later use
import { ReportBuilder } from "@/components/mechanics/ReportBuilder";
import { NexoraNote } from "@/components/mechanics/NexoraNote";
import { DiagnosticNoteExport } from "@/components/mechanics/DiagnosticNoteExport";
import { SectionReset } from "@/components/chrome/SectionReset";
import { LeafMark } from "@/components/chrome/Icons";

export default function Page() {
  const { meta } = content;
  const basics = getSection<BasicsSection>("basics");
  const task1 = getSection<Task1Section>("task1");
  const dataSection = getSection<DataSection>("data");
  // const task2 = getSection<Task2Section>("task2"); — hidden for now, keep for later use
  // const bluegrid = getSection<BlueGridSection>("bluegrid"); — hidden for now, keep for later use
  const nexora = getSection<NexoraSection>("nexora");

  return (
    <>
      {/* Everything below is the normal interactive page; it collapses out
          of the way when printing so only DiagnosticNoteExport (a sibling,
          outside this wrapper) reaches the page. */}
      <div className="print:hidden">
      {/* Hero */}
      <div className="max-w-3xl py-12">
        <p className="mb-2 flex items-center gap-2 text-caption font-semibold uppercase tracking-wide text-purple">
          <LeafMark className="h-4 w-4" />
          {meta.module}
        </p>
        <h1 className="mb-3 text-h1 text-ink">{meta.title}</h1>
        <p className="mb-4 text-body text-ash">{meta.subtitle}</p>

        <div className="space-y-2">
          <p className="rounded-xl border-l-4 border-navy bg-lilac/50 p-3 text-body text-navy">
            <span className="font-semibold">Level 3 — </span>
            {meta.levelNote.replace(/^Level 3 — /, "")}
          </p>
          <p className="text-caption text-ash">{meta.howToUse}</p>
        </div>
      </div>

      {/* Urgency cold-open */}
      <Opening />

      {/* Asked once, before any work block — every export reuses this */}
      <div className="py-6">
        <NamePrompt />
      </div>

      {/* Bridge: why the basics are worth two minutes, before the first card */}
      <Roadmap />

      {/* Block 1a — basics */}
      <Section
        id="basics"
        kicker={basics.kicker}
        title={basics.title}
        intro={basics.intro}
        doneRule={basics.doneRule}
      >
        <Basics section={basics} />
      </Section>

      <Divider />

      {/* Block 1b — Task: diagnoses Nexora's weak area, carried into Nexora below */}
      <Section
        id="task1"
        kicker={task1.kicker}
        title={task1.title}
        intro={task1.intro}
        doneRule={task1.doneRule}
        action={
          task1.resetLabel && task1.resetNote ? (
            <SectionReset
              sectionId="task1"
              label={task1.resetLabel}
              note={task1.resetNote}
              extraKeyPrefixes={[
                ...task1.clues.map((c) => `${c.id}:`),
                "task1:",
              ]}
            />
          ) : null
        }
      >
        <RiskCategorizer section={task1} />
      </Section>

      <Divider />

      {/* Block 2 — the one defensible comparison; feeds D3 in Nexora's brief */}
      <Section
        id="data"
        kicker={dataSection.kicker}
        title={dataSection.title}
        intro={dataSection.intro}
        doneRule={dataSection.doneRule}
      >
        <CarbonPlayground section={dataSection} diagnosisSection={task1} />
      </Section>

      {/* Task 2 — hidden for now, keep for later use
      <Divider />

      <Section
        id="task2"
        kicker={task2.kicker}
        title={task2.title}
        intro={task2.intro}
        doneRule={task2.doneRule}
      >
        <PriorityPicker section={task2} />
      </Section>
      */}

      {/* BlueGrid case — hidden for now, keep for later use
      <Divider />

      <Section
        id="bluegrid"
        kicker={bluegrid.kicker}
        title={bluegrid.title}
        intro={bluegrid.intro}
        doneRule={bluegrid.doneRule}
      >
        <CasePriority section={bluegrid} />
      </Section>
      */}

      <Divider />

      {/* Block 3 — Nexora final brief */}
      <Section
        id="nexora"
        kicker={nexora.kicker}
        title={nexora.title}
        intro={nexora.intro}
        doneRule={nexora.doneRule}
      >
        <ReportBuilder section={nexora} diagnosisSection={task1} dataSection={dataSection} />
      </Section>
      </div>

      <DiagnosticNoteExport section={task1} />
      <WorkBlock2Note section={dataSection} />
      <NexoraNote section={nexora} />
    </>
  );
}

function Divider() {
  return <hr className="border-line" />;
}
