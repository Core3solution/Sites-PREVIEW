import { useCallback, useEffect, useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, Expand, Info } from 'lucide-react';
import { useSite } from '../state/site';
import { SectionHeading } from '../components/SectionHeading';
import { Photo } from '../components/Photo';
import { Dialog } from '../components/Dialog';
import { SmartLink } from '../components/SmartLink';

export function Gallery() {
  const { gallery, photos } = useSite();
  const [index, setIndex] = useState<number | null>(null);
  const n = gallery.items.length;
  const close = useCallback(() => setIndex(null), []);
  const go = useCallback((d: number) => setIndex((i) => (i == null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (index == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  const current = index != null ? gallery.items[index] : null;
  const slot = current ? photos[current.photo] : undefined;

  return (
    <section id="galeria" aria-labelledby="galeria-title" className="relative border-t border-line/60 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          id="galeria-title"
          eyebrow={gallery.eyebrow}
          title={gallery.title}
          intro={gallery.intro}
          aside={
            gallery.externalCta && (
              <SmartLink href={gallery.externalCta.href} className="btn btn-ghost" showExternalIcon>
                {gallery.externalCta.label}
              </SmartLink>
            )
          }
        />
        <p className="mt-8 flex items-start gap-2.5 text-[0.82rem] leading-relaxed text-muted" data-reveal>
          <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          {gallery.notice}
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {gallery.items.map((it, i) => (
            <li key={`${it.photo}-${i}`} className="aspect-[16/10]" data-reveal style={{ ['--d' as string]: i % 4 }}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block h-full w-full overflow-hidden rounded-[18px] border border-line text-left"
                aria-label={`${photos[it.photo]?.photo ? 'Ampliar' : 'Ver especificação'}: ${it.title}`}
              >
                <Photo
                  id={it.photo}
                  variant="tile"
                  badge={false}
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                  className="absolute inset-0"
                  imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="font-display text-base font-semibold sm:text-lg">{it.title}</p>
                    {!photos[it.photo]?.photo && (
                      <p className="mt-0.5 hidden text-[0.78rem] leading-snug text-muted sm:line-clamp-2">{photos[it.photo]?.brief}</p>
                    )}
                  </div>
                  <span className="hidden size-9 shrink-0 place-items-center rounded-full sm:grid border border-white/30 bg-black/30 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Expand className="size-3.5" aria-hidden />
                  </span>
                </div>
                {photos[it.photo]?.photo?.illustrative && (
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.12em] text-text">
                    Ilustrativa
                  </span>
                )}
                {!photos[it.photo]?.photo && (
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full sm:left-7 sm:top-7 border border-white/25 bg-black/40 px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.12em] text-muted">
                    <Camera className="size-3 text-accent" aria-hidden />
                    <span className="sm:hidden">Pendente</span>
                    <span className="hidden sm:inline">Fotografia pendente</span>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={index != null} onClose={close} title={current?.title ?? ''} size="lg">
        {current && slot && (
          slot.photo ? (
            <figure>
              <div className="overflow-hidden rounded-2xl border border-line bg-black">
                {/* Exibida no máximo a 1,5× do tamanho original para não perder nitidez */}
                <img src={slot.photo.src} alt={slot.photo.alt} className="mx-auto max-h-[62dvh] w-full object-contain" style={{ maxWidth: Math.round(slot.photo.width * 1.5) }} />
              </div>
              <figcaption className="mt-4 text-sm text-muted">{slot.photo.credit}</figcaption>
            </figure>
          ) : (
            <div>
              <Photo id={slot.id} variant="panel" className="aspect-[16/10] rounded-2xl border border-line" />
              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">Direção de arte</dt>
                  <dd className="mt-1.5 leading-relaxed">{slot.brief}</dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">Proporção</dt>
                  <dd className="mt-1.5 tabular-nums">{slot.aspect}</dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">Largura mínima</dt>
                  <dd className="mt-1.5 tabular-nums">{slot.minWidth}px</dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">Situação</dt>
                  <dd className="mt-1.5 text-accent">Aguardando foto autorizada</dd>
                </div>
              </dl>
            </div>
          )
        )}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => go(-1)} aria-label="Imagem anterior">
            <ChevronLeft className="size-4" aria-hidden /> Anterior
          </button>
          <span className="text-sm tabular-nums text-muted" aria-live="polite">
            {index != null ? index + 1 : 0} / {n}
          </span>
          <button type="button" className="btn btn-ghost" onClick={() => go(1)} aria-label="Próxima imagem">
            Próxima <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </Dialog>
    </section>
  );
}
