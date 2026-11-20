import { useId, useMemo, useRef } from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { formatBRLShort } from '../../../core/lib/format';
import { useInView } from '../../../core/hooks/dom';
import { useShop } from '../state/shop';
import { useModaSite } from '../state/site';
import { countActiveFilters, filterLooks, sortLabels, sortLooks, type SortMode } from '../lib/filter';
import { LookCard } from '../components/LookCard';
import { lengthLabels, paletteLabels } from '../components/FiltersPanel';

const sortModes = Object.keys(sortLabels) as SortMode[];

/** Foco visível do wrapper quando o <select> (invisível) recebe foco pelo teclado. */
const selectFocus =
  '[&:has(select:focus-visible)]:outline-2 [&:has(select:focus-visible)]:outline-offset-3 [&:has(select:focus-visible)]:outline-[var(--brand-text)] [&:has(select:focus-visible)]:[outline-style:solid]';

/** “Ordenar: Novidades ⌄” — <select> nativo (acessível e com o seletor do sistema no celular) sob uma pílula. */
function SortSelect({ compact = false }: { compact?: boolean }) {
  const { sort, setSort } = useShop();
  const id = useId();
  return (
    <div className={`m-pill relative ${compact ? '!min-h-11 !border-transparent !bg-transparent !px-3 !pr-8' : '!min-h-11 !pr-9'} ${selectFocus}`}>
      <label htmlFor={id} className="pointer-events-none">
        {compact ? 'Ordenar' : 'Ordenar:'} {!compact && <span className="font-semibold">{sortLabels[sort]}</span>}
      </label>
      <select
        id={id}
        value={sort}
        onChange={(e) => setSort(e.target.value as SortMode)}
        className="absolute inset-0 size-full cursor-pointer appearance-none opacity-0"
      >
        {sortModes.map((m) => (
          <option key={m} value={m}>
            {sortLabels[m]}
          </option>
        ))}
      </select>
      <ChevronDown className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 ${compact ? 'right-2.5' : 'right-3.5'}`} aria-hidden />
    </div>
  );
}

function FilterButton({ count, compact = false }: { count: number; compact?: boolean }) {
  const { open } = useShop();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => open({ kind: 'filters' })}
      className={`m-pill !min-h-11 ${compact ? '!border-transparent !bg-transparent !px-3' : ''}`}
      aria-label={count ? `Filtrar (${count} ${count === 1 ? 'filtro ativo' : 'filtros ativos'})` : 'Filtrar'}
    >
      <SlidersHorizontal className="size-4" aria-hidden />
      Filtrar
      {count > 0 ? (
        <span className="grid size-5 place-items-center rounded-full bg-accent text-[0.68rem] font-bold tabular-nums text-accent-ink">{count}</span>
      ) : (
        !compact && <span aria-hidden className="text-base leading-none">+</span>
      )}
    </button>
  );
}

/** Seção “Coleção”: cabeçalho, filtros/ordenação, chips ativos, grade de looks e barra fixa no celular. */
export function Collection() {
  const site = useModaSite();
  const { filters, setFilters, resetFilters, sort, query, setQuery, favorites, panel } = useShop();
  const results = useMemo(() => sortLooks(filterLooks(site.looks, filters, favorites, query), sort), [site.looks, filters, favorites, query, sort]);
  const active = countActiveFilters(filters);
  const title = site.collection.title.replace('{n}', String(site.looks.length));

  const toolbarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const toolbarInView = useInView(toolbarRef);
  const gridInView = useInView(gridRef, '-40% 0px -30% 0px');
  const showBar = gridInView && !toolbarInView && !panel;

  const catLabel = (id: string) => site.categories.find((c) => c.id === id)?.label ?? id;
  const chips = [
    ...filters.categories.map((c) => ({ key: `c-${c}`, label: catLabel(c), remove: () => setFilters({ categories: filters.categories.filter((x) => x !== c) }) })),
    ...filters.palettes.map((p) => ({ key: `p-${p}`, label: paletteLabels[p], remove: () => setFilters({ palettes: filters.palettes.filter((x) => x !== p) }) })),
    ...filters.lengths.map((l) => ({ key: `l-${l}`, label: `Comprimento ${lengthLabels[l].toLowerCase()}`, remove: () => setFilters({ lengths: filters.lengths.filter((x) => x !== l) }) })),
    ...(filters.maxPrice != null ? [{ key: 'price', label: `Até ${formatBRLShort(filters.maxPrice)}`, remove: () => setFilters({ maxPrice: null }) }] : []),
    ...(filters.onlyFavorites ? [{ key: 'fav', label: 'Somente favoritos', remove: () => setFilters({ onlyFavorites: false }) }] : []),
  ];
  const trimmedQuery = query.trim();
  const clearAll = () => {
    resetFilters();
    setQuery('');
  };

  return (
    <section id="colecao" aria-labelledby="colecao-title" className="py-14 md:py-20">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div className="min-w-0 max-w-2xl">
            <h2 id="colecao-title" className="m-bar m-h2 text-[var(--brand-text)]">
              {title}
            </h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{site.collection.intro}</p>
          </div>
          <div ref={toolbarRef} className="flex flex-wrap items-center gap-2.5">
            <FilterButton count={active} />
            <SortSelect />
          </div>
        </header>

        {(trimmedQuery || chips.length > 0) && (
          <div className="mt-7 flex flex-col gap-3">
            {trimmedQuery && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.95rem] text-[var(--brand-text)]">
                <Search className="size-4 text-muted" aria-hidden />
                <span className="min-w-0">
                  Resultados para <span className="font-semibold">“{trimmedQuery}”</span>
                </span>
                <button type="button" onClick={() => setQuery('')} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted underline underline-offset-4 hover:text-[var(--brand-text)]">
                  Limpar busca
                </button>
              </div>
            )}
            {chips.length > 0 && (
              <ul className="flex flex-wrap items-center gap-2" aria-label="Filtros aplicados">
                {chips.map((c) => (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={c.remove}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--brand-text)_7%,transparent)] py-2 pl-3.5 pr-2.5 text-[0.83rem] font-medium text-[var(--brand-text)] transition-colors hover:bg-[color-mix(in_srgb,var(--brand-text)_12%,transparent)] md:min-h-9"
                      aria-label={`Remover filtro: ${c.label}`}
                    >
                      {c.label}
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={resetFilters} className="inline-flex min-h-11 items-center px-2 text-[0.83rem] font-semibold text-[var(--brand-text)] underline underline-offset-4 md:min-h-9">
                    Limpar filtros
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-1 border-t border-line pt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <p aria-live="polite" className="shrink-0 text-[0.85rem] font-semibold tabular-nums text-[var(--brand-text)]">
            {results.length} {results.length === 1 ? 'look' : 'looks'}
            {results.length !== site.looks.length && <span className="font-normal text-muted"> de {site.looks.length}</span>}
          </p>
          <p className="min-w-0 text-xs leading-relaxed text-subtle sm:text-right">{site.collection.disclaimer}</p>
        </div>

        <div ref={gridRef} className="mt-6">
          {results.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-12" aria-label="Looks da coleção">
              {results.map((look, i) => (
                <LookCard key={look.id} look={look} priority={i < 3} revealDelay={i % 3} />
              ))}
            </ul>
          ) : (
            <div className="m-card flex flex-col items-center px-6 py-16 text-center md:py-24">
              <span className="mb-5 block h-[3px] w-11 rounded bg-accent" aria-hidden />
              <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--brand-text)] md:text-3xl">Nenhum look com essa combinação.</h3>
              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted">
                {filters.onlyFavorites && favorites.size === 0
                  ? 'Você ainda não marcou favoritos. Toque no coração de um look para salvá-lo aqui.'
                  : 'Tente remover algum filtro ou buscar por outra cor ou peça.'}
              </p>
              <button type="button" onClick={clearAll} className="m-btn m-btn-dark mt-7">
                Limpar filtros{trimmedQuery ? ' e busca' : ''}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Barra fixa compacta no celular, só enquanto a grade está na tela */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 transition-[opacity,transform] duration-300 motion-reduce:transition-none md:hidden ${
          showBar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 14px)' }}
        aria-hidden={!showBar}
        inert={!showBar}
      >
        <div className="flex items-center rounded-full border border-line bg-[color-mix(in_srgb,var(--brand-surface)_94%,transparent)] p-1 shadow-[0_14px_36px_-16px_rgb(0_0_0/0.4)] backdrop-blur-md">
          <FilterButton count={active} compact />
          <span className="h-5 w-px bg-line" aria-hidden />
          <SortSelect compact />
        </div>
      </div>
    </section>
  );
}
