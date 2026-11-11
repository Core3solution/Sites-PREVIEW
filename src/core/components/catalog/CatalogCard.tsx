import { Check, Info, Plus } from 'lucide-react';
import { Photo } from '../Photo';
import { PriceTag } from './PriceTag';
import type { CatalogItem } from '../../types';

interface Props {
  item: CatalogItem;
  photoId?: string;
  categoryLabel: string;
  selected: boolean;
  observedLabel: string;
  onToggle: () => void;
  onDetails: () => void;
}

/**
 * Card comercial de um serviço: imagem, nome, resumo, preço observado, “Detalhes” e seleção.
 * Celular: layout horizontal compacto. ≥640 px: card vertical.
 */
export function CatalogCard({ item, photoId, categoryLabel, selected, observedLabel, onToggle, onDetails }: Props) {
  return (
    <li
      className={`group relative flex overflow-hidden rounded-[20px] border bg-surface transition-[border-color,box-shadow,transform] duration-300 sm:flex-col ${
        selected
          ? 'border-accent shadow-[0_0_0_1px_var(--brand-accent),0_20px_40px_-24px_rgb(228_186_66/0.5)]'
          : 'border-line hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.9)]'
      }`}
    >
      {photoId && (
        <div className="relative w-28 shrink-0 self-stretch sm:aspect-[16/9] sm:w-full">
          <Photo id={photoId} variant="tile" badge={false} sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 112px" className="absolute inset-0" imgClassName="transition-transform duration-700 group-hover:scale-[1.04]" />
          {selected && (
            <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-accent text-accent-ink sm:right-3 sm:top-3" aria-hidden>
              <Check className="size-4" />
            </span>
          )}
          <span className="absolute bottom-2 left-2 hidden rounded-full bg-black/70 px-2 py-0.5 text-[0.66rem] uppercase tracking-[0.1em] text-text sm:inline">Imagem ilustrativa</span>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-subtle">
            <span className="tabular-nums">{String(item.sourceOrder).padStart(2, '0')}</span>
            <span aria-hidden>·</span>
            <span className="truncate">{categoryLabel}</span>
          </p>
          <h3 className="mt-1.5 font-display text-[1.25rem] font-extrabold uppercase leading-tight text-text sm:text-[1.4rem]" style={{ fontStretch: '80%', letterSpacing: '0.01em' }}>
            {item.name}
          </h3>
          <p className="mt-1.5 hidden text-[0.9rem] leading-relaxed text-muted sm:line-clamp-2">{item.summary}</p>
          {item.note && (
            <p className="mt-2 hidden items-start gap-1.5 text-[0.78rem] leading-snug text-text/85 sm:flex">
              <Info className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
              {item.note}
            </p>
          )}
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
          <PriceTag item={item} note={observedLabel} />
          <div className="flex gap-2">
            <button type="button" onClick={onDetails} className="btn btn-ghost !min-h-10 !px-3.5 text-[0.85rem]" aria-label={`Detalhes de ${item.name}`}>
              <Info className="size-4" aria-hidden />
              <span className="hidden min-[400px]:inline sm:hidden lg:inline">Detalhes</span>
            </button>
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={selected}
              className={`btn !min-h-10 !px-4 text-[0.85rem] ${selected ? 'btn-primary' : 'btn-outline'}`}
            >
              {selected ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
              {selected ? 'Selecionado' : 'Adicionar'}
              <span className="sr-only"> {item.name}</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
