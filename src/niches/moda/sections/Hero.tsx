import { ArrowRight } from 'lucide-react';
import { useModaSite } from '../state/site';
import { useShop } from '../state/shop';
import { useRichMotion, useScrollProgress } from '../../../core/hooks/motion';
import { Photo } from '../../../core/components/Photo';

/**
 * Hero editorial: painel escuro com corte diagonal (como o layout da marca) + duas fotos de look lado a lado.
 * Celular: painel escuro com título e CTAs em cima, fotos em faixa abaixo (o texto nunca cobre as modelos).
 * Profundidade no scroll: as fotos se movem mais devagar que o painel (desligado em movimento reduzido).
 */
export function Hero() {
  const { hero, looks } = useModaSite();
  const { open } = useShop();
  const rich = useRichMotion();
  const ref = useScrollProgress<HTMLElement>(rich);
  const first = looks.find((l) => l.photo === hero.photos[0]);
  const second = looks.find((l) => l.photo === hero.photos[1]);

  return (
    <section id="inicio" ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden lg:min-h-[min(78svh,720px)]">
      {/* Fotos: faixa no celular, metade direita no desktop */}
      <div className="relative grid h-[min(118vw,520px)] grid-cols-2 bg-[#c6c4c5] sm:h-[560px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[60%]" aria-hidden>
        {hero.photos.map((id, i) => (
          <div key={id} className="relative overflow-hidden">
            <div className="m-hero-photo absolute inset-0" style={{ ['--i' as string]: i }}>
              <Photo id={id} variant="background" priority sizes="(min-width: 1024px) 30vw, 50vw" className="absolute inset-0" imgClassName="object-cover object-[50%_4%]" />
            </div>
          </div>
        ))}
        <p className="m-kicker absolute right-5 top-5 rounded-full bg-[color-mix(in_srgb,var(--brand-bg)_80%,transparent)] px-3 py-1.5 text-text backdrop-blur sm:right-7 sm:top-7">{hero.kicker}</p>
      </div>

      {/* Painel escuro com corte diagonal no desktop */}
      <div className="m-dark relative lg:absolute lg:inset-y-0 lg:left-0 lg:w-[52%] lg:[clip-path:polygon(0_0,100%_0,80%_100%,0_100%)]">
        <div className="container-x flex h-full flex-col justify-center py-12 sm:py-16 lg:max-w-none lg:py-20 lg:pl-[max(3rem,calc((100vw-1320px)/2+3rem))] lg:pr-[22%]">
          <div className="m-hero-copy intro">
            <h1 id="hero-title" className="m-display text-[clamp(2.6rem,10.5vw,3.6rem)] text-[var(--m-dark-text)] lg:text-[clamp(3.6rem,5.2vw,5.4rem)]">
              {hero.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <span className="mt-7 block h-[3px] w-14 rounded bg-accent" aria-hidden />
            <p className="mt-6 max-w-sm text-[1rem] leading-relaxed text-[var(--m-dark-muted)]">{hero.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:max-w-xs">
              <a href={hero.primaryCta.href} className="m-btn m-btn-accent justify-between">
                {hero.primaryCta.label}
                <ArrowRight className="size-4" aria-hidden />
              </a>
              <button type="button" className="m-btn m-btn-outline-dark" onClick={() => open({ kind: 'finder' })}>
                {hero.finderCtaLabel}
              </button>
            </div>
            {first && second && (
              <p className="mt-8 text-[0.75rem] text-[var(--m-dark-muted)]">
                Na foto: Look {String(first.number).padStart(2, '0')} · {first.name} e Look {String(second.number).padStart(2, '0')} · {second.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
