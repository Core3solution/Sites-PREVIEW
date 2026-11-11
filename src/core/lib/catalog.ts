import type { CatalogItem, Category } from '../types';
import { normalize } from './format';

export type SortMode = 'source' | 'price-asc' | 'price-desc' | 'name';

export interface CatalogFilter {
  query: string;
  categoryId: string | 'all';
  sort: SortMode;
  onlySelected?: boolean;
  selectedIds?: ReadonlySet<string>;
}

export function filterCatalog(items: CatalogItem[], categories: Category[], f: CatalogFilter): CatalogItem[] {
  const q = normalize(f.query);
  const terms = q.split(/\s+/).filter(Boolean);
  const catLabel = new Map(categories.map((c) => [c.id, c.label]));
  const out = items.filter((it) => {
    if (f.categoryId !== 'all' && it.categoryId !== f.categoryId) return false;
    if (f.onlySelected && !f.selectedIds?.has(it.id)) return false;
    if (!terms.length) return true;
    const hay = normalize([it.name, it.sourceName, it.summary, it.sourceExcerpt, catLabel.get(it.categoryId) ?? ''].join(' '));
    return terms.every((t) => hay.includes(t));
  });
  const price = (it: CatalogItem) => it.price.amountCents ?? Number.POSITIVE_INFINITY;
  switch (f.sort) {
    case 'price-asc':
      return out.sort((a, b) => price(a) - price(b) || a.sourceOrder - b.sourceOrder);
    case 'price-desc':
      return out.sort((a, b) => price(b) - price(a) || a.sourceOrder - b.sourceOrder);
    case 'name':
      return out.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    default:
      return out.sort((a, b) => a.sourceOrder - b.sourceOrder);
  }
}

export function countByCategory(items: CatalogItem[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, it) => {
    acc[it.categoryId] = (acc[it.categoryId] ?? 0) + 1;
    return acc;
  }, {});
}
