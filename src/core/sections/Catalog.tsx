import { useId, useMemo, useState } from 'react';
import { Check, Info, Plus, Search, X, ArrowRight } from 'lucide-react';
import { useSite } from '../state/site';
import { useQuote } from '../state/quote';
import { SectionHeading } from '../components/SectionHeading';
import { countByCategory, filterCatalog, type SortMode } from '../lib/catalog';
import { formatBRL } from '../lib/format';
import type { CatalogItem } from '../types';

function PriceTag({ item, label }: { item: CatalogItem; label: string }) {
  const p = item.price;
  return (
    <div className="flex flex-col items-start gap-0.5 sm:items-end">
      {p.kind === 'from' && <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">A partir de</span>}
      <span className="font-display text-[1.55rem] font-semibold tabular-nums tracking-tight" style={{ fontStretch: '80%' }}>
        {p.amountCents != null ? formatBRL(p.amountCents) : 'Sob consulta'}
      </span>
      <span className="text-[0.7rem] text-muted">{label}</span>
    </div>
  );
}

function ItemRow({ item, categoryLabel, selected, onToggle, observedLabel }: {
  item: CatalogItem;
  categoryLabel: string;
  selected: boolean;
  onToggle: () => void;
  observedLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  return (
    <li
      className={`group relative rounded-[20px] border transition-[border-color,background-color] duration-300 ${
        selected ? 'border-accent/60 bg-accent-soft' : 'border-line bg-surface hover:border-white/25'
      }`}
    >
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-muted">
            <span className="tabular-nums text-subtle">{String(item.sourceOrder).padStart(2, '0')}</span>
            <span aria-hidden>·</span>
            <span>{categoryLabel}</span>
          </div>
          <h3 className="mt-2 font-display text-[1.3rem] font-semibold leading-tight tracking-tight sm:text-[1.4rem]" style={{ fontStretch: '80%' }}>
            {item.name}
          </h3>
          <p className="mt-1.5 text-[0.93rem] leading-relaxed text-muted">{item.summary}</p>
          {item.note && (
            <p className="mt-2.5 inline-flex items-start gap-2 text-[0.8rem] leading-snug text-text/80">
              <Info className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
              {item.note}
            </p>
          )}
          <button
            type="button"
            className="mt-3 block text-[0.78rem] text-muted underline decoration-white/20 underline-offset-4 hover:text-text"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Ocultar trecho do catálogo' : 'Ver trecho do catálogo'}
          </button>
          {open && (
            <p id={detailsId} className="mt-2 rounded-xl border border-line bg-bg/60 px-3.5 py-2.5 text-[0.8rem] text-muted">
              <span className="text-text/80">“{item.sourceName}”</span> — “{item.sourceExcerpt}”
              <span className="block pt-1 text-[0.72rem] text-subtle">Texto como aparece, truncado, na captura do catálogo.</span>
            </p>
          )}
        </div>
        <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
          <PriceTag item={item} label={observedLabel} />
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={selected}
            className={`btn !min-h-11 shrink-0 ${selected ? 'btn-primary' : 'btn-ghost'}`}
          >
            {selected ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
            {selected ? 'Selecionado' : 'Adicionar'}
            <span className="sr-only"> {item.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}

export function Catalog() {
  const { catalog, services } = useSite();
  const { selectedIds, toggle, category, setCategory, selectedItems } = useQuote();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortMode>('source');
  const [onlySelected, setOnlySelected] = useState(false);
  const counts = useMemo(() => countByCategory(catalog.items), [catalog.items]);
  const labels = useMemo(() => new Map(services.categories.map((c) => [c.id, c.label])), [services.categories]);
  const results = useMemo(
    () => filterCatalog(catalog.items, services.categories, { query, categoryId: category, sort, onlySelected, selectedIds }),
    [catalog.items, services.categories, query, category, sort, onlySelected, selectedIds],
  );
  const hasFilters = query !== '' || category !== 'all' || onlySelected || sort !== 'source';
  const reset = () => {
    setQuery('');
    setCategory('all');
    setSort('source');
    setOnlySelected(false);
  };

  return (
    <section id="catalogo" aria-labelledby="catalogo-title" className="relative border-t border-line/60 bg-[linear-gradient(180deg,var(--brand-surface)_0%,var(--brand-bg)_320px)] py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading id="catalogo-title" eyebrow={catalog.eyebrow} title={catalog.title} intro={catalog.intro} />

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3.5 text-[0.88rem] leading-relaxed text-text/90 sm:px-5" role="note" data-reveal>
          <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <p>{catalog.disclaimer}</p>
        </div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div className="min-w-0">
            {/* Controles */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">Buscar serviço</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
                  <input
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
                  <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className="field !rounded-full appearance-none pr-10">
                    <option value="source">Ordem do catálogo</option>
                    <option value="price-asc">Menor valor</option>
                    <option value="price-desc">Maior valor</option>
                    <option value="name">Nome (A–Z)</option>
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden>▾</span>
                </label>
              </div>
              <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por categoria">
                <button type="button" className="chip" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
                  Todos <span className="tabular-nums opacity-70">{catalog.items.length}</span>
                </button>
                {services.categories.map((c) => (
                  <button key={c.id} type="button" className="chip" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
                    {c.label} <span className="tabular-nums opacity-70">{counts[c.id] ?? 0}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
                <p aria-live="polite">
                  {results.length === catalog.items.length && !onlySelected
                    ? `${results.length} serviços`
                    : `${results.length} de ${catalog.items.length} serviços`}
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
            </div>

            {/* Lista */}
            {results.length ? (
              <ul className="mt-6 flex flex-col gap-3">
                {results.map((it) => (
                  <ItemRow
                    key={it.id}
                    item={it}
                    categoryLabel={labels.get(it.categoryId) ?? ''}
                    selected={selectedIds.has(it.id)}
                    onToggle={() => toggle(it.id)}
                    observedLabel={catalog.observedAtLabel}
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
                <ul className="mt-4 flex flex-col gap-3">
                  {selectedItems.map((it) => (
                    <li key={it.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="leading-snug">{it.name}</span>
                      <button type="button" onClick={() => toggle(it.id)} className="grid size-7 shrink-0 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-text" aria-label={`Remover ${it.name}`}>
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
              <p className="mt-4 text-[0.72rem] leading-relaxed text-muted">Sem pagamento, sem envio automático. Os valores não são somados nem constituem orçamento final.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
