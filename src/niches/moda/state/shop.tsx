import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Look } from '../types';
import { emptyFilters, type LookFilters, type SortMode } from '../lib/filter';
import { lineKey, type BagLine } from '../lib/bag';

/**
 * Estado da loja de demonstração (nicho moda): favoritos, sacola de atendimento, filtros, ordenação, busca
 * e painéis abertos. Favoritos ficam no navegador do visitante (conveniência); a sacola só existe na página.
 * Nada é enviado, cobrado ou reservado.
 */
export type Panel =
  | { kind: 'look'; id: string }
  | { kind: 'finder' }
  | { kind: 'bag' }
  | { kind: 'favorites' }
  | { kind: 'filters' }
  | { kind: 'search' }
  | { kind: 'info'; id: string }
  | null;

interface ShopState {
  looks: Look[];
  lookById: (id: string) => Look | undefined;

  favorites: ReadonlySet<string>;
  toggleFavorite: (id: string) => void;

  bag: BagLine[];
  bagCount: number;
  addToBag: (lookId: string, size: string | null) => void;
  setLineSize: (index: number, size: string) => void;
  setLineQty: (index: number, qty: number) => void;
  removeLine: (index: number) => void;
  clearBag: () => void;

  filters: LookFilters;
  setFilters: (patch: Partial<LookFilters>) => void;
  resetFilters: () => void;
  sort: SortMode;
  setSort: (s: SortMode) => void;
  query: string;
  setQuery: (q: string) => void;

  panel: Panel;
  open: (p: Exclude<Panel, null>) => void;
  close: () => void;
}

const Ctx = createContext<ShopState | null>(null);

function readFavorites(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function ShopProvider({ looks, storageKey, children }: { looks: Look[]; storageKey: string; children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites(storageKey));
  const [bag, setBag] = useState<BagLine[]>([]);
  const [filters, setFiltersState] = useState<LookFilters>(emptyFilters);
  const [sort, setSort] = useState<SortMode>('novidades');
  const [query, setQuery] = useState('');
  const [panel, setPanel] = useState<Panel>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch {
      /* armazenamento indisponível: favoritos valem só nesta visita */
    }
  }, [favorites, storageKey]);

  const toggleFavorite = useCallback((id: string) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])), []);

  const addToBag = useCallback((lookId: string, size: string | null) => {
    setBag((b) => {
      const key = lineKey({ lookId, size });
      const i = b.findIndex((l) => lineKey(l) === key);
      if (i >= 0) return b.map((l, j) => (j === i ? { ...l, qty: Math.min(l.qty + 1, 9) } : l));
      return [...b, { lookId, size, qty: 1 }];
    });
  }, []);
  const setLineSize = useCallback((index: number, size: string) => setBag((b) => b.map((l, j) => (j === index ? { ...l, size } : l))), []);
  const setLineQty = useCallback((index: number, qty: number) => setBag((b) => b.map((l, j) => (j === index ? { ...l, qty: Math.max(1, Math.min(9, qty)) } : l))), []);
  const removeLine = useCallback((index: number) => setBag((b) => b.filter((_, j) => j !== index)), []);
  const clearBag = useCallback(() => setBag([]), []);

  const setFilters = useCallback((patch: Partial<LookFilters>) => setFiltersState((f) => ({ ...f, ...patch })), []);
  const resetFilters = useCallback(() => setFiltersState(emptyFilters), []);

  const open = useCallback((p: Exclude<Panel, null>) => setPanel(p), []);
  const close = useCallback(() => setPanel(null), []);

  const value = useMemo<ShopState>(() => {
    const map = new Map(looks.map((l) => [l.id, l]));
    return {
      looks,
      lookById: (id) => map.get(id),
      favorites: new Set(favorites),
      toggleFavorite,
      bag,
      bagCount: bag.reduce((n, l) => n + l.qty, 0),
      addToBag,
      setLineSize,
      setLineQty,
      removeLine,
      clearBag,
      filters,
      setFilters,
      resetFilters,
      sort,
      setSort,
      query,
      setQuery,
      panel,
      open,
      close,
    };
  }, [looks, favorites, toggleFavorite, bag, addToBag, setLineSize, setLineQty, removeLine, clearBag, filters, setFilters, resetFilters, sort, query, panel, open, close]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop(): ShopState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useShop precisa de <ShopProvider>');
  return v;
}
