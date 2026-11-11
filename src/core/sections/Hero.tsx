import { ArrowRight, Camera, ChevronDown, MapPin, Star } from 'lucide-react';
import { useSite } from '../state/site';
import { useRichMotion, useScrollProgress, useTilt } from '../hooks/motion';
import { Photo } from '../components/Photo';

function Title({ title, highlight }: { title: string; highlight?: string }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;
  const [before, after] = title.split(highlight);
  return (
    <>
      {before}
      <span className="text-accent">{highlight}</span>
      {after}
    </>
  );
}

export function Hero() {
  const { hero, reputation, contact, photos } = useSite();
  const slot = photos[hero.photo];
  const pending = !slot?.photo;
  const rich = useRichMotion();
  const ref = useScrollProgress<HTMLElement>(rich);
  const tilt = useTilt<HTMLDivElement>(rich, 6);

  return (
    <section
      id="inicio"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate -mt-[var(--header-h)] flex min-h-[640px] flex-col overflow-hidden pt-[var(--header-h)] sm:min-h-[720px] lg:min-h-[min(100svh,980px)]"
    >
      {/* Fundo: fotografia aprovada ou cenário de luz em CSS (sem veículo desenhado) enquanto a foto está pendente */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Photo id={hero.photo} variant="background" priority className="hero-media absolute inset-0" imgClassName="object-[68%_60%] lg:object-[60%_55%]" />
        {pending && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="studio-ceiling" />
            <div className="studio-floor" />
            <div className="absolute right-[-10%] top-[10%] size-[60vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand-accent)_14%,transparent),transparent_60%)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_20%,transparent_30%,rgb(0_0_0/0.55)_80%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/40 to-bg/10 lg:bg-gradient-to-r lg:from-bg/90 lg:via-bg/30 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
        <div className={`absolute inset-0 ${rich ? 'light-sweep' : ''}`} />
      </div>

      <div className="container-x relative flex flex-1 flex-col justify-end pb-14 pt-24 sm:pb-20 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:pb-28 lg:pt-16">
        <div className="hero-copy intro max-w-[46rem]">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="display mt-6 text-[2.55rem] text-balance min-[390px]:text-[2.8rem] sm:text-[5rem] lg:text-[5.6rem] xl:text-[6rem]">
            <Title title={hero.title} highlight={hero.highlight} />
          </h1>
          <p className="mt-6 max-w-xl text-[1.04rem] leading-relaxed text-muted text-pretty sm:text-lg">{hero.subtitle}</p>
          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
            <a href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            {reputation && (
              <a href="#avaliacoes" className="group inline-flex items-center gap-2 rounded-md hover:text-text">
                <Star className="size-4 fill-accent text-accent" aria-hidden />
                <span>
                  <strong className="font-semibold text-text">{reputation.rating.toLocaleString('pt-BR')}</strong> · {reputation.reviewCount} avaliações no {reputation.platform}
                </span>
              </a>
            )}
            <span className="hidden h-4 w-px bg-line sm:block" aria-hidden />
            <a href="#localizacao" className="inline-flex items-center gap-2 rounded-md hover:text-text">
              <MapPin className="size-4 text-accent" aria-hidden />
              {contact.address.street} · {contact.address.district}
            </a>
          </div>
        </div>

        {/* Pilha de vidro com profundidade (somente telas grandes) */}
        <div className="hero-stack hidden shrink-0 lg:block" aria-label="Destaques">
          <div ref={tilt} className="tilt relative w-[300px] xl:w-[320px]">
            <ul className="glass relative overflow-hidden rounded-[22px]" style={{ transform: 'translateZ(40px)' }}>
              {hero.highlights.map((h, i) => (
                <li key={h.title} className={`flex flex-col gap-1 px-6 py-5 ${i ? 'border-t border-white/[0.14]' : ''}`}>
                  <span className="font-display text-lg font-semibold" style={{ fontStretch: '80%' }}>
                    {h.title}
                  </span>
                  <span className="text-[0.82rem] text-muted">{h.detail}</span>
                </li>
              ))}
              <span className="tilt-glare pointer-events-none absolute inset-0" aria-hidden />
            </ul>
            <div
              className="absolute -inset-x-6 -bottom-8 h-16 rounded-[50%] bg-black/60 blur-2xl"
              style={{ transform: 'translateZ(-60px)' }}
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className="container-x relative flex items-end justify-between gap-4 pb-6">
        <a href="#servicos" className="group hidden items-center gap-3 text-xs uppercase tracking-[0.24em] text-muted hover:text-text sm:inline-flex">
          <span className="grid size-10 place-items-center rounded-full border border-white/25 transition-colors group-hover:border-accent">
            <ChevronDown className="size-4" aria-hidden />
          </span>
          Explorar
        </a>
        {pending ? (
          <p className="inline-flex max-w-[19rem] items-center gap-2 text-right text-[0.7rem] leading-snug text-subtle sm:max-w-sm" data-photo-status="pendente" data-photo-slot={hero.photo}>
            <Camera className="size-3.5 shrink-0" aria-hidden />
            {slot?.label ?? 'Fotografia'} pendente · {slot?.aspect} · mín. {slot?.minWidth}px
          </p>
        ) : (
          <p className="max-w-xs text-right text-[0.7rem] leading-snug text-subtle">{slot?.photo?.credit}</p>
        )}
      </div>
    </section>
  );
}
