import { Heart } from 'lucide-react';
import { Photo } from '../../../core/components/Photo';
import { formatBRLShort } from '../../../core/lib/format';
import { useModaSite } from '../state/site';
import { useShop } from '../state/shop';
import type { Look } from '../types';

/** Editorial “shop the look”: um look em destaque e dois menores (carrossel no celular). */
export function Spotlight() {
  const site = useModaSite();
  const { lookById, open, favorites, toggleFavorite } = useShop();
  const { spotlight } = site;
  const items = spotlight.lookIds.map((id) => lookById(id)).filter((l): l is Look => !!l);
  if (!items.length) return null;

  const card = (l: Look, i: number) => {
    const fav = favorites.has(l.id);
    const big = i === 0;
    return (
      <article
        key={l.id}
        className={`flex w-[72vw] max-w-[300px] sm:w-[44vw] shrink-0 snap-start flex-col lg:w-auto lg:max-w-none ${big ? 'lg:col-span-6' : 'lg:col-span-3 lg:self-end'}`}
      >
        <div className={`relative ${big ? 'lg:flex-1' : ''}`}>
          <button type="button" onClick={() => open({ kind: 'look', id: l.id })} className="block w-full text-left" aria-label={`Ver ${l.name}`}>
            <Photo
              id={l.photo}
              variant="tile"
              badge={false}
              sizes={big ? '(min-width: 768px) 40vw, 72vw' : '(min-width: 768px) 20vw, 72vw'}
              className={`m-photo aspect-[2/3] w-full ${big ? 'lg:aspect-auto lg:h-[560px]' : ''}`}
              imgClassName="object-top"
            />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(l.id)}
            aria-pressed={fav}
            aria-label={fav ? `Remover ${l.name} dos favoritos` : `Favoritar ${l.name}`}
            className="m-icon-btn absolute right-2 top-2 bg-bg/85 backdrop-blur"
          >
            <Heart className="size-5" fill={fav ? 'currentColor' : 'none'} aria-hidden />
          </button>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted">Look {String(l.number).padStart(2, '0')}</p>
            <h3 className={`font-display font-bold leading-tight tracking-tight ${big ? 'text-2xl' : 'text-lg'}`}>{l.name}</h3>
          </div>
          <p className="shrink-0 pt-4 text-sm font-semibold">{l.price.amountCents != null ? formatBRLShort(l.price.amountCents) : 'Sob consulta'}</p>
        </div>
        <p className="mt-1.5 text-[0.85rem] leading-snug text-muted">{l.pieces.join(' · ')}</p>
        <button type="button" onClick={() => open({ kind: 'look', id: l.id })} className="mt-1 min-h-[44px] self-start text-sm font-semibold underline underline-offset-4">
          Ver look
        </button>
      </article>
    );
  };

  return (
    <section id="studio" aria-labelledby="studio-title" className="bg-surface-2 py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="m-kicker text-muted">{spotlight.eyebrow}</p>
          <h2 id="studio-title" className="m-h2 mt-4 text-text">
            {spotlight.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{spotlight.text}</p>
        </div>
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10 lg:overflow-visible lg:px-0 lg:pb-0">
          {items.map(card)}
        </div>
        <p className="mt-8 text-[0.78rem] leading-snug text-muted">{site.collection.disclaimer}</p>
      </div>
    </section>
  );
}
