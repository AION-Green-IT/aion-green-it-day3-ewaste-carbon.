import {
  content,
  getSection,
  type BasicsSection,
  type BlueGridSection,
  type NexoraSection,
  type Task1Section,
  type Task2Section,
} from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Opening } from "@/components/chrome/Opening";
import { Basics } from "@/components/mechanics/Basics";
import { RiskCategorizer } from "@/components/mechanics/RiskCategorizer";
import { PriorityPicker } from "@/components/mechanics/PriorityPicker";
import { CasePriority } from "@/components/mechanics/CasePriority";
import { StarterKit } from "@/components/mechanics/StarterKit";
import { LeafMark } from "@/components/chrome/Icons";

export default function Page() {
  const { meta } = content;
  const basics = getSection<BasicsSection>("basics");
  const task1 = getSection<Task1Section>("task1");
  const task2 = getSection<Task2Section>("task2");
  const bluegrid = getSection<BlueGridSection>("bluegrid");
  const nexora = getSection<NexoraSection>("nexora");

  return (
    <>
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

      {/* Block 1b — Task 1 */}
      <Section
        id="task1"
        kicker={task1.kicker}
        title={task1.title}
        intro={task1.intro}
        doneRule={task1.doneRule}
      >
        <RiskCategorizer section={task1} />
      </Section>

      <Divider />

      {/* Block 1c — Task 2 */}
      <Section
        id="task2"
        kicker={task2.kicker}
        title={task2.title}
        intro={task2.intro}
        doneRule={task2.doneRule}
      >
        <PriorityPicker section={task2} />
      </Section>

      <Divider />

      {/* Block 2 — BlueGrid case */}
      <Section
        id="bluegrid"
        kicker={bluegrid.kicker}
        title={bluegrid.title}
        intro={bluegrid.intro}
        doneRule={bluegrid.doneRule}
      >
        <CasePriority section={bluegrid} />
      </Section>

      <Divider />

      {/* Block 3 — Nexora final brief */}
      <Section
        id="nexora"
        kicker={nexora.kicker}
        title={nexora.title}
        intro={nexora.intro}
        doneRule={nexora.doneRule}
      >
        <StarterKit section={nexora} />
      </Section>
    </>
  );
}

function Divider() {
  return <hr className="border-line" />;
}
