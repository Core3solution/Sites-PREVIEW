import { ArrowUpRight } from 'lucide-react';
import { useSite } from '../state/site';
import { useQuote } from '../state/quote';
import { useRichMotion, useTilt } from '../hooks/motion';
import { Photo } from '../components/Photo';
import { SectionHeading } from '../components/SectionHeading';
import { formatBRL } from '../lib/format';
import type { CatalogItem, Category } from '../types';

function priceRange(items: CatalogItem[]): string | null {
  const values = items.map((i) => i.price.amountCents).filter((v): v is number => v != null);
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const hasFrom = items.some((i) => i.price.kind === 'from');
  if (min === max) return `${hasFrom ? 'A partir de ' : ''}${formatBRL(min)}`;
  return `${formatBRL(min)} a ${formatBRL(max)}`;
}

function ServiceCard({ cat, items, index, onOpen }: { cat: Category; items: CatalogItem[]; index: number; onOpen: () => void }) {
  const rich = useRichMotion();
  const tilt = useTilt<HTMLDivElement>(rich, 4);
  const range = priceRange(items);
  return (
    <li className="w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none" data-reveal style={{ ['--d' as string]: index % 3 }}>
      <div ref={tilt} className="tilt h-full">
        <button
          type="button"
          onClick={onOpen}
          className="group relative flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-line bg-surface text-left transition-colors duration-500 hover:border-accent"
          aria-label={`${cat.label}: ver ${items.length} ${items.length === 1 ? 'item' : 'itens'} no catálogo`}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Photo
              id={cat.photo}
              variant="tile"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 78vw"
              className="absolute inset-0"
              imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface to-transparent" />
            <span className="absolute left-5 top-5 z-10 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[0.7rem] tabular-nums text-text/80 backdrop-blur">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-full border border-white/25 bg-black/40 text-text backdrop-blur transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
              <ArrowUpRight className="size-4" aria-hidden />
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-6 pt-2">
            <h3 className="font-display text-[1.45rem] font-semibold tracking-tight" style={{ fontStretch: '80%' }}>
              {cat.label}
            </h3>
            <p className="text-[0.93rem] leading-relaxed text-muted">{cat.description}</p>
            <div className="mt-auto flex flex-col gap-1 border-t border-line pt-4 text-[0.8rem] min-[1180px]:flex-row min-[1180px]:items-center min-[1180px]:justify-between min-[1180px]:gap-3">
              <span className="text-muted">
                {items.length} {items.length === 1 ? 'item' : 'itens'} no catálogo
              </span>
              {range && <span className="font-medium tabular-nums text-text">{range}</span>}
            </div>
          </div>
          <span className="tilt-glare pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
        </button>
      </div>
    </li>
  );
}

export function Services() {
  const { services, catalog } = useSite();
  const { setCategory } = useQuote();
  const open = (id: string) => {
    setCategory(id);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading id="servicos-title" eyebrow={services.eyebrow} title={services.title} intro={services.intro} />
      </div>
      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:container-x sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3">
        {services.categories.map((c, i) => (
          <ServiceCard key={c.id} cat={c} index={i} items={catalog.items.filter((it) => it.categoryId === c.id)} onOpen={() => open(c.id)} />
        ))}
      </ul>
      <p className="container-x mt-6 text-xs text-muted sm:hidden">Deslize para ver todos os serviços →</p>
    </section>
  );
}
