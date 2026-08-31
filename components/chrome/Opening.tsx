import { content } from "@/lib/content";
import { StakeIcon } from "@/components/visuals/StakeIcon";

/** The cold-open: a concrete Monday-morning scene that sets the stakes, so the
 *  learner feels why the day matters before touching a mechanic. */
export function Opening() {
  const { opening } = content;
  return (
    <section className="py-8">
      <div className="overflow-hidden rounded-2xl border border-line">
        {/* Scene */}
        <div className="bg-navy p-5 md:p-7">
          <p className="mb-3 flex items-center gap-2 text-caption font-semibold uppercase tracking-wide text-lilac/80">
            <span aria-hidden="true" className="inline-flex h-5 items-center rounded-full bg-danger px-2 text-[11px] font-bold text-paper">
              LIVE
            </span>
            {opening.kicker}
          </p>
          <p className="max-w-3xl text-h3 font-normal leading-relaxed text-paper">
            {opening.scene}
          </p>
        </div>

        {/* Stakes */}
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {opening.stakes.map((s) => (
            <div key={s.label} className="bg-paper p-4">
              <div className="mb-1.5 flex items-center gap-2 text-purple">
                <StakeIcon name={s.icon} className="h-5 w-5" />
                <span className="text-caption font-semibold uppercase tracking-wide">
                  {s.label}
                </span>
              </div>
              <p className="text-body text-ash">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Turn */}
        <div className="border-t border-line bg-lilac/50 p-5">
          <p className="max-w-3xl text-body font-medium text-navy">{opening.turn}</p>
        </div>
      </div>
    </section>
  );
}
