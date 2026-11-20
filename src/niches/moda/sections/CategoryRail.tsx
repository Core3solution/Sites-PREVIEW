import { useModaSite } from '../state/site';
import { useShop } from '../state/shop';

/** Trilho de categorias (como no layout: “Leggings / Capris / …”): aplica o filtro e leva à coleção. */
export function CategoryRail() {
  const { categories, looks } = useModaSite();
  const { filters, setFilters } = useShop();
  const go = (id: string) => {
    const only = filters.categories.length === 1 && filters.categories[0] === id;
    setFilters({ categories: only ? [] : [id] });
    document.getElementById('colecao')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <nav id="categorias" aria-label="Categorias" className="scroll-mt-24 border-b border-line">
      <ul className="no-scrollbar container-x flex snap-x items-stretch justify-start gap-1 overflow-x-auto lg:justify-center">
        {categories.map((c, i) => {
          const n = looks.filter((l) => l.categories.includes(c.id)).length;
          const active = filters.categories.length === 1 && filters.categories[0] === c.id;
          return (
            <li key={c.id} className="flex shrink-0 snap-start items-center">
              {i > 0 && <span className="px-2 text-subtle sm:px-4" aria-hidden>/</span>}
              <button
                type="button"
                onClick={() => go(c.id)}
                aria-pressed={active}
                className={`relative min-h-14 px-2 text-[0.95rem] font-medium transition-colors after:absolute after:inset-x-2 after:bottom-0 after:h-[2px] after:origin-left after:bg-text after:transition-transform ${
                  active ? 'text-text after:scale-x-100' : 'text-muted after:scale-x-0 hover:text-text'
                }`}
              >
                {c.label} <span className="ml-0.5 text-[0.75rem] tabular-nums text-subtle">{n}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
