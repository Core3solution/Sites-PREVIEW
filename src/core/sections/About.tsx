import { useSite } from '../state/site';
import { Photo } from '../components/Photo';
import { useRichMotion, useScrollProgress } from '../hooks/motion';

export function About() {
  const { about, sources } = useSite();
  const rich = useRichMotion();
  const ref = useScrollProgress<HTMLDivElement>(rich);
  const srcLabel = (id?: string) => sources.find((s) => s.id === id)?.label;
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="relative overflow-hidden border-t border-line/60 py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div ref={ref} className="relative order-2 lg:order-1" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line sm:aspect-[5/4] lg:aspect-[4/5]">
            <div className="absolute -inset-y-[8%] inset-x-0" style={{ transform: 'translate3d(0, calc((var(--p, 0) - 0.5) * -10%), 0)' }}>
              <Photo id={about.photo} variant="panel" sizes="(min-width: 1024px) 45vw, 100vw" className="h-full w-full" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg/90 to-transparent" />
            <div className="glass absolute inset-x-5 bottom-5 rounded-2xl p-5 sm:inset-x-6 sm:bottom-6">
              <ul className="grid gap-4 sm:grid-cols-3 sm:gap-3">
                {about.pillars.map((p) => (
                  <li key={p.title}>
                    <p className="font-display text-base font-semibold text-accent">{p.title}</p>
                    <p className="mt-1 text-[0.8rem] leading-snug text-text/75">{p.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div data-reveal>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 id="sobre-title" className="display mt-5 text-[2.15rem] text-balance sm:text-5xl lg:text-[3.4rem]">
              {about.title}
            </h2>
          </div>
          <div className="mt-8 flex flex-col gap-5">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="text-[1.05rem] leading-relaxed text-text/80 text-pretty" data-reveal style={{ ['--d' as string]: i + 1 }}>
                {p.text}
                {p.sourceId && (
                  <span className="mt-1.5 block text-[0.72rem] text-white/40">Fonte: {srcLabel(p.sourceId)}</span>
                )}
              </p>
            ))}
          </div>
          <dl className="mt-10 divide-y divide-line border-y border-line" data-reveal>
            {about.facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-muted">{f.label}</dt>
                <dd className="text-[0.98rem] sm:text-right">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
