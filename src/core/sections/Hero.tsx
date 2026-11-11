import { ArrowRight, Camera, ChevronDown, MapPin, Star } from 'lucide-react';
import { useSite } from '../state/site';
import { useRichMotion, useScrollProgress } from '../hooks/motion';
import { Photo } from '../components/Photo';
import { formatRating } from '../lib/format';

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

/**
 * Hero com duas composições:
 * - Celular/tablet: chamada + título → fotografia em faixa inteira (o título nunca cobre o carro) → texto curto + CTAs.
 * - Desktop (≥1024 px): fotografia em tela cheia ao fundo e conteúdo à esquerda, com profundidade no scroll.
 */
export function Hero() {
  const { hero, reputation, contact, photos } = useSite();
  const slot = photos[hero.photo];
  const pending = !slot?.photo;
  const rich = useRichMotion();
  const ref = useScrollProgress<HTMLElement>(rich);

  return (
    <section
      id="inicio"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate -mt-[var(--header-h)] overflow-hidden pt-[var(--header-h)] lg:flex lg:min-h-[min(100svh,960px)] lg:items-center"
    >
      {/* Camadas do desktop: leitura do texto à esquerda sem esconder a fotografia */}
      <div className="pointer-events-none absolute inset-0 -z-[5] hidden lg:block" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--brand-bg)_14%,color-mix(in_srgb,var(--brand-bg)_70%,transparent)_34%,transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
        {rich && <div className="light-sweep absolute inset-0" />}
      </div>

      <div className="container-x pb-12 pt-10 sm:pb-16 sm:pt-14 lg:static lg:py-24">
        {/* 1–3: especialidade e título */}
        <div className="hero-copy intro relative max-w-[44rem]">
          <p className="eyebrow !tracking-[0.2em] sm:!tracking-[0.28em]">{hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="display mt-5 text-text text-balance text-[clamp(2.2rem,9.6vw,4.2rem)] sm:mt-6 lg:text-[clamp(4.4rem,5.6vw,6rem)]"
          >
            <Title title={hero.title} highlight={hero.highlight} />
          </h1>
        </div>

        {/* 4: fotografia — faixa inteira no celular, fundo em tela cheia no desktop */}
        <div className="relative -mx-5 mt-6 aspect-[4/3] sm:-mx-8 sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:left-[14%] lg:right-0 lg:-z-10 lg:m-0 lg:aspect-auto" aria-hidden>
          <div className="hero-media absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_80%,transparent_100%)] lg:[mask-image:none]">
            {pending ? (
              <div className="absolute inset-0 overflow-hidden">
                <div className="studio-ceiling" />
                <div className="studio-floor" />
              </div>
            ) : (
              <Photo
                id={hero.photo}
                mobileId={hero.mobilePhoto}
                variant="background"
                priority
                sizes="100vw"
                className="absolute inset-0"
                imgClassName="object-[74%_72%] sm:object-[70%_68%] lg:object-[70%_55%]"
              />
            )}
          </div>
        </div>

        {/* 5–7: descrição, CTA principal e secundário discreto */}
        <div className="hero-copy relative mt-6 max-w-xl lg:mt-8">
          <p className="text-[1.02rem] leading-relaxed text-muted text-pretty sm:text-lg">
            {hero.subtitleShort ? (
              <>
                <span className="sm:hidden">{hero.subtitleShort}</span>
                <span className="hidden sm:inline">{hero.subtitle}</span>
              </>
            ) : (
              hero.subtitle
            )}
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
            <a href={hero.primaryCta.href} className="btn btn-primary sm:min-w-56">
              {hero.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a
              href={hero.secondaryCta.href}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-2 text-[0.95rem] font-semibold text-text underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-accent sm:justify-start"
            >
              {hero.secondaryCta.label}
              <ChevronDown className="size-4" aria-hidden />
            </a>
          </div>
          <div className="mt-8 flex flex-col gap-2.5 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 lg:border-0 lg:pt-0">
            {reputation && (
              <a href="#avaliacoes" className="inline-flex min-h-8 items-center gap-2 rounded-md hover:text-text">
                <Star className="size-4 fill-accent text-accent" aria-hidden />
                <span>
                  <strong className="font-semibold text-text">{formatRating(reputation.rating)}</strong> · {reputation.reviewCount} avaliações no {reputation.platform}
                </span>
              </a>
            )}
            <a href="#localizacao" className="inline-flex min-h-8 items-center gap-2 rounded-md hover:text-text">
              <MapPin className="size-4 text-accent" aria-hidden />
              {contact.address.street} · {contact.address.district}
            </a>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-[0.7rem] leading-snug text-subtle lg:hidden" data-photo-status={pending ? 'pendente' : undefined}>
            {pending && <Camera className="size-3.5 shrink-0" aria-hidden />}
            {pending ? `${slot?.label ?? 'Fotografia'} pendente` : slot?.photo?.illustrative ? 'Imagem ilustrativa gerada por IA. Não retrata a Company Auto SPA.' : slot?.photo?.credit}
          </p>
        </div>
      </div>

      {/* Legenda da imagem no desktop, no canto inferior direito */}
      <p className="absolute bottom-6 right-6 hidden max-w-xs text-right text-[0.7rem] leading-snug text-subtle lg:block xl:right-12">
        {pending ? `${slot?.label ?? 'Fotografia'} pendente` : slot?.photo?.illustrative ? 'Imagem ilustrativa gerada por IA. Não retrata a Company Auto SPA.' : slot?.photo?.credit}
      </p>
    </section>
  );
}
