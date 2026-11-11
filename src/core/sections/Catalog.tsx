import { useMemo, useState } from 'react';
import { ArrowRight, Info, Search, X } from 'lucide-react';
import { useSite } from '../state/site';
import { useQuote } from '../state/quote';
import { SectionHeading } from '../components/SectionHeading';
import { CatalogCard } from '../components/catalog/CatalogCard';
import { ServiceDetailsDialog } from '../components/catalog/ServiceDetailsDialog';
import { countByCategory, filterCatalog, type SortMode } from '../lib/catalog';
import { formatPrice } from '../lib/format';

export function Catalog() {
  const { catalog, services, photos } = useSite();
  const { selectedIds, toggle, category, setCategory, selectedItems } = useQuote();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortMode>('source');
  const [onlySelected, setOnlySelected] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const counts = useMemo(() => countByCategory(catalog.items), [catalog.items]);
  const categoryById = useMemo(() => new Map(services.categories.map((c) => [c.id, c])), [services.categories]);
  const results = useMemo(
    () => filterCatalog(catalog.items, services.categories, { query, categoryId: category, sort, onlySelected, selectedIds }),
    [catalog.items, services.categories, query, category, sort, onlySelected, selectedIds],
  );
  const photoFor = (id: string) => {
    const it = catalog.items.find((i) => i.id === id);
    const pid = it?.photo ?? categoryById.get(it?.categoryId ?? '')?.photo;
    return pid && photos[pid] ? pid : undefined;
  };
  const details = detailsId ? catalog.items.find((i) => i.id === detailsId) ?? null : null;
  const hasFilters = query !== '' || category !== 'all' || onlySelected || sort !== 'source';
  const reset = () => {
    setQuery('');
    setCategory('all');
    setSort('source');
    setOnlySelected(false);
  };

  return (
    <section id="catalogo" aria-labelledby="catalogo-title" className="relative border-t border-line/60 bg-[linear-gradient(180deg,var(--brand-surface)_0%,var(--brand-bg)_360px)] py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading id="catalogo-title" eyebrow={catalog.eyebrow} title={catalog.title} intro={catalog.intro} />

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent-soft px-4 py-3.5 text-[0.9rem] leading-relaxed text-text sm:px-5" role="note" data-reveal>
          <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <p>{catalog.disclaimer}</p>
        </div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <div className="min-w-0">
            {/* Categorias em destaque */}
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por categoria">
              <button type="button" className="chip chip-lg" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
                Todos <span className="tabular-nums opacity-70">{catalog.items.length}</span>
              </button>
              {services.categories.map((c) => (
                <button key={c.id} type="button" className="chip chip-lg" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
                  {c.label} <span className="tabular-nums opacity-70">{counts[c.id] ?? 0}</span>
                </button>
              ))}
            </div>

            {/* Busca e ordenação */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Buscar serviço</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  id="busca-catalogo"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar: PPF, farol, teto, rodas…"
                  className="field !rounded-full !pl-11 !pr-11"
                  autoComplete="off"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-text" aria-label="Limpar busca">
                    <X className="size-4" aria-hidden />
                  </button>
                )}
              </label>
              <label className="relative sm:w-56">
                <span className="sr-only">Ordenar</span>
                <select id="ordem-catalogo" value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className="field !rounded-full appearance-none pr-10">
                  <option value="source">Ordem do catálogo</option>
                  <option value="price-asc">Menor valor</option>
                  <option value="price-desc">Maior valor</option>
                  <option value="name">Nome (A–Z)</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden>▾</span>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
              <p aria-live="polite">
                {results.length === catalog.items.length && !onlySelected ? `${results.length} serviços` : `${results.length} de ${catalog.items.length} serviços`}
              </p>
              <div className="flex items-center gap-1">
                <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-3 hover:text-text">
                  <input type="checkbox" checked={onlySelected} onChange={(e) => setOnlySelected(e.target.checked)} className="size-4 accent-[var(--brand-accent)]" />
                  Somente selecionados
                </label>
                {hasFilters && (
                  <button type="button" onClick={reset} className="btn btn-quiet">
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>

            {results.length ? (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
                {results.map((it) => (
                  <CatalogCard
                    key={it.id}
                    item={it}
                    photoId={photoFor(it.id)}
                    categoryLabel={categoryById.get(it.categoryId)?.label ?? ''}
                    selected={selectedIds.has(it.id)}
                    observedLabel={catalog.observedAtLabel}
                    onToggle={() => toggle(it.id)}
                    onDetails={() => setDetailsId(it.id)}
                  />
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-[20px] border border-dashed border-line px-6 py-14 text-center">
                <p className="font-display text-xl">Nenhum serviço encontrado.</p>
                <p className="mt-2 text-sm text-muted">Tente outro termo ou limpe os filtros.</p>
                <button type="button" onClick={reset} className="btn btn-ghost mt-6">
                  Limpar filtros
                </button>
              </div>
            )}
          </div>

          {/* Resumo lateral (desktop) */}
          <aside className="hidden lg:block" aria-label="Seleção atual">
            <div className="panel sticky top-[calc(var(--header-h)+24px)] p-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted">Sua seleção</p>
              {selectedItems.length ? (
                <ul className="mt-4 flex flex-col divide-y divide-line">
                  {selectedItems.map((it) => (
                    <li key={it.id} className="flex items-start justify-between gap-3 py-3 text-sm first:pt-0">
                      <span className="min-w-0">
                        <span className="block font-medium leading-snug text-text">{it.name}</span>
                        <span className="text-[0.78rem] text-subtle">{formatPrice(it.price)}</span>
                      </span>
                      <button type="button" onClick={() => toggle(it.id)} className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-text" aria-label={`Remover ${it.name}`}>
                        <X className="size-3.5" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-muted">Adicione um ou mais serviços para montar a sua solicitação.</p>
              )}
              <a
                href="#solicitacao"
                className={`btn btn-primary mt-6 w-full ${selectedItems.length ? '' : 'pointer-events-none opacity-45'}`}
                aria-disabled={!selectedItems.length}
                tabIndex={selectedItems.length ? undefined : -1}
              >
                Revisar solicitação
                <ArrowRight className="size-4" aria-hidden />
              </a>
              <p className="mt-4 text-[0.75rem] leading-relaxed text-subtle">Sem pagamento, sem envio automático. Os valores não são somados nem constituem orçamento final.</p>
            </div>
          </aside>
        </div>
      </div>

      <ServiceDetailsDialog
        item={details}
        photoId={details ? photoFor(details.id) : undefined}
        categoryLabel={details ? categoryById.get(details.categoryId)?.label ?? '' : ''}
        selected={details ? selectedIds.has(details.id) : false}
        disclaimer={catalog.disclaimer}
        observedLabel={catalog.observedAtLabel}
        onToggle={() => details && toggle(details.id)}
        onClose={() => setDetailsId(null)}
      />
    </section>
  );
}
