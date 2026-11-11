import { Star, ArrowUpRight } from 'lucide-react';
import { useSite } from '../state/site';
import { SmartLink } from '../components/SmartLink';
import { formatDateBR, formatRating } from '../lib/format';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block size-6">
            <Star className="absolute inset-0 size-6 text-white/15" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-6 text-accent" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function Reputation() {
  const { reputation, sources, contact } = useSite();
  if (!reputation) return null;
  const src = sources.find((s) => s.id === reputation.sourceId);
  return (
    <section id="avaliacoes" aria-labelledby="avaliacoes-title" className="relative border-t border-line/60 py-24 sm:py-32">
      <div className="container-x">
        <div className="panel relative grid overflow-hidden lg:grid-cols-[1fr_1.2fr]" data-reveal>
          <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-accent/10 blur-3xl" aria-hidden />
          <div className="relative flex flex-col justify-between gap-10 border-b border-line p-8 sm:p-12 lg:border-b-0 lg:border-r">
            <div>
              <p className="eyebrow">{reputation.eyebrow}</p>
              <h2 id="avaliacoes-title" className="display mt-5 text-[2rem] sm:text-[2.6rem]">
                {reputation.title}
              </h2>
            </div>
            <div>
              <p className="flex items-end gap-4">
                <span className="display text-[5.5rem] leading-[0.8] sm:text-[7rem]" aria-label={`Nota ${formatRating(reputation.rating)} de 5`}>
                  {formatRating(reputation.rating)}
                </span>
                <span className="pb-2 text-muted">/ 5</span>
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Stars rating={reputation.rating} />
                <span className="text-sm text-text/85">
                  {reputation.reviewCount} avaliações no {reputation.platform}
                </span>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col justify-between gap-8 p-8 sm:p-12">
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">Data da observação</dt>
                <dd className="mt-2 font-display text-xl">{formatDateBR(reputation.observedAt)}</dd>
              </div>
              {reputation.category && (
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">Categoria no perfil</dt>
                  <dd className="mt-2 text-[0.98rem] leading-snug">{reputation.category}</dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">Fonte</dt>
                <dd className="mt-2 text-[0.95rem] leading-snug text-text/85">{src?.label}</dd>
              </div>
            </dl>
            <p className="text-[0.85rem] leading-relaxed text-muted">{reputation.note}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <SmartLink href={reputation.profileUrl} className="btn btn-primary">
                Ver avaliações no {reputation.platform}
                <ArrowUpRight className="size-4" aria-hidden />
              </SmartLink>
              {contact.instagram && (
                <SmartLink href={contact.instagram.url} className="btn btn-ghost" showExternalIcon>
                  {contact.instagram.handle}
                </SmartLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
