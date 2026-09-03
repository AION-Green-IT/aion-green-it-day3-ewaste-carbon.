import { content } from "@/lib/content";
import { Diagram } from "@/components/visuals/registry";

/** The bridge between the cold-open and Basics: two real-world numbers plus a
 *  map of how the day's four blocks connect, so the learner opens the first
 *  concept card knowing why it's worth the two minutes. */
export function Roadmap() {
  const { roadmap } = content;
  return (
    <section className="py-8">
      <div className="overflow-hidden rounded-2xl border border-line">
        {/* Header */}
        <div className="bg-lilac/40 p-5 md:p-7">
          <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-purple">
            {roadmap.kicker}
          </p>
          <h2 className="mb-3 text-h2 text-ink">{roadmap.title}</h2>
          <p className="max-w-3xl text-body text-ash">{roadmap.intro}</p>
        </div>

        {/* Grounding facts */}
        <div className="grid gap-px bg-line sm:grid-cols-2">
          {roadmap.facts.map((f) => (
            <div key={f.label} className="bg-paper p-4 md:p-5">
              <p className="text-h1 leading-none text-navy">{f.stat}</p>
              <p className="mt-1.5 text-caption font-semibold uppercase tracking-wide text-ash">
                {f.label}
              </p>
              <p className="mt-2 text-body text-ash">{f.detail}</p>
              <p className="mt-2 text-caption text-ash/70">— {f.source}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-line bg-paper p-4 md:p-5">
          <p className="max-w-3xl text-body text-ink">{roadmap.factsNote}</p>
        </div>

        {/* How the day's blocks connect */}
        <div className="border-t border-line bg-lilac/20 p-5 md:p-7">
          <div className="mx-auto max-w-sm">
            <Diagram name={roadmap.visual} />
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-center text-caption text-ash">
            {roadmap.visualCaption}
          </p>
        </div>

        {/* Turn */}
        <div className="border-t border-line bg-lilac/50 p-5">
          <p className="max-w-3xl text-body font-medium text-navy">{roadmap.turn}</p>
        </div>
      </div>
    </section>
  );
}
