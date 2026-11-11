import { formatBRL } from '../../lib/format';
import type { CatalogItem } from '../../types';

/** Preço observado com o rótulo “A partir de” quando aplicável. */
export function PriceTag({ item, note, size = 'md' }: { item: CatalogItem; note?: string; size?: 'md' | 'lg' }) {
  const p = item.price;
  return (
    <div className="flex flex-col gap-0.5">
      {p.kind === 'from' && <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent">A partir de</span>}
      <span
        className={`font-display font-extrabold tabular-nums leading-none text-text ${size === 'lg' ? 'text-[2.4rem]' : 'text-[1.6rem]'}`}
        style={{ fontStretch: '80%' }}
      >
        {p.amountCents != null ? formatBRL(p.amountCents) : 'Sob consulta'}
      </span>
      {note && <span className="mt-1 text-[0.72rem] text-subtle">{note}</span>}
    </div>
  );
}
