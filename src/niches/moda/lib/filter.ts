import type { Length, Look, Palette } from '../types';
import { normalize } from '../../../core/lib/format';

export type SortMode = 'novidades' | 'menor-preco' | 'maior-preco' | 'nome';

export const sortLabels: Record<SortMode, string> = {
  novidades: 'Novidades',
  'menor-preco': 'Menor preço',
  'maior-preco': 'Maior preço',
  nome: 'Nome (A–Z)',
};

export interface LookFilters {
  categories: string[];
  palettes: Palette[];
  lengths: Length[];
  /** Preço máximo em centavos (null = sem limite). */
  maxPrice: number | null;
  onlyFavorites: boolean;
}

export const emptyFilters: LookFilters = { categories: [], palettes: [], lengths: [], maxPrice: null, onlyFavorites: false };

/** Quantidade de filtros ativos (para o contador do botão “Filtrar”). */
export function countActiveFilters(f: LookFilters): number {
  return f.categories.length + f.palettes.length + f.lengths.length + (f.maxPrice != null ? 1 : 0) + (f.onlyFavorites ? 1 : 0);
}

/** Busca tolerante a acentos em nome, número, peças e cores. */
export function matchesQuery(look: Look, query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = normalize([`look ${String(look.number).padStart(2, '0')}`, look.name, ...look.pieces, ...look.colors.map((c) => c.name)].join(' '));
  return terms.every((t) => hay.includes(t));
}

export function filterLooks(looks: Look[], f: LookFilters, favorites: ReadonlySet<string>, query = ''): Look[] {
  return looks.filter((l) => {
    if (f.categories.length && !l.categories.some((c) => f.categories.includes(c))) return false;
    if (f.palettes.length && !f.palettes.includes(l.palette)) return false;
    if (f.lengths.length && !f.lengths.includes(l.length)) return false;
    if (f.maxPrice != null && (l.price.amountCents ?? Infinity) > f.maxPrice) return false;
    if (f.onlyFavorites && !favorites.has(l.id)) return false;
    return matchesQuery(l, query);
  });
}

export function sortLooks(looks: Look[], mode: SortMode): Look[] {
  const p = (l: Look) => l.price.amountCents ?? Number.POSITIVE_INFINITY;
  const out = [...looks];
  switch (mode) {
    case 'menor-preco':
      return out.sort((a, b) => p(a) - p(b) || a.number - b.number);
    case 'maior-preco':
      return out.sort((a, b) => p(b) - p(a) || a.number - b.number);
    case 'nome':
      return out.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    default:
      return out.sort((a, b) => a.number - b.number);
  }
}

/** Faixas de preço distintas da coleção (para o filtro “até R$ …”). */
export function priceSteps(looks: Look[]): number[] {
  return [...new Set(looks.map((l) => l.price.amountCents).filter((v): v is number => v != null))].sort((a, b) => a - b);
}
