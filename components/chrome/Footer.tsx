import { content } from "@/lib/content";
import { Collapsible } from "@/components/ui/Collapsible";

export function Footer() {
  const { glossary } = content;
  return (
    <footer className="mt-16 border-t border-line print:hidden">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-8 md:px-6">
        <Collapsible
          summary={
            <span className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-h3 text-ink">{glossary.title}</span>
              <span className="text-caption text-ash">{glossary.hint}</span>
            </span>
          }
        >
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {glossary.terms.map((t) => (
              <div key={t.term} className="border-t border-line pt-2">
                <dt className="text-body font-semibold text-navy">{t.term}</dt>
                <dd className="text-caption text-ash">{t.def}</dd>
              </div>
            ))}
          </dl>
        </Collapsible>

        <p className="mt-8 text-caption text-ash">{content.meta.footerLine}</p>
      </div>
    </footer>
  );
}
