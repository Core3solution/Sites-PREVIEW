import { Check, Info, Plus } from 'lucide-react';
import { Dialog } from '../Dialog';
import { Photo } from '../Photo';
import { PriceTag } from './PriceTag';
import type { CatalogItem } from '../../types';

interface Props {
  item: CatalogItem | null;
  photoId?: string;
  categoryLabel: string;
  selected: boolean;
  disclaimer: string;
  observedLabel: string;
  onToggle: () => void;
  onClose: () => void;
}

/** Ficha do serviço: tudo o que se sabe do catálogo, sem inventar condições. */
export function ServiceDetailsDialog({ item, photoId, categoryLabel, selected, disclaimer, observedLabel, onToggle, onClose }: Props) {
  return (
    <Dialog open={!!item} onClose={onClose} title={item?.name ?? ''} size="lg">
      {item && (
        <div className="flex flex-col gap-5">
          {photoId && <Photo id={photoId} variant="tile" badge="top-left" sizes="(min-width: 768px) 720px, 100vw" className="aspect-[16/8] rounded-2xl border border-line" />}
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-accent">{categoryLabel}</p>
          <p className="-mt-2 text-[1rem] leading-relaxed text-muted">{item.summary}</p>
          {item.note && (
            <p className="flex items-start gap-2 rounded-xl border border-line bg-bg/60 px-4 py-3 text-sm text-text/90">
              <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              {item.note}
            </p>
          )}
          <div className="rounded-xl border border-line px-4 py-3 text-[0.82rem] text-muted">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-subtle">Como aparece no catálogo</p>
            <p className="mt-1.5">
              <span className="text-text">“{item.sourceName}”</span> — “{item.sourceExcerpt}”
            </p>
            {item.truncatedInSource && <p className="mt-1 text-subtle">Nome cortado na captura do catálogo.</p>}
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
            <PriceTag item={item} note={observedLabel} size="lg" />
            <button type="button" onClick={onToggle} aria-pressed={selected} className={`btn ${selected ? 'btn-primary' : 'btn-outline'}`}>
              {selected ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
              {selected ? 'Selecionado para a solicitação' : 'Adicionar à solicitação'}
            </button>
          </div>
          <p className="text-[0.75rem] leading-relaxed text-subtle">{disclaimer}</p>
        </div>
      )}
    </Dialog>
  );
}
