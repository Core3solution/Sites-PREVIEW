import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CatalogItem } from '../types';
import { emptyVehicle, type VehicleInfo } from '../lib/quote';

/**
 * Estado da solicitação mantido apenas em memória (nada é persistido ou enviado).
 * Também carrega o filtro de categoria para que os cards de serviço possam abrir o catálogo filtrado.
 */
interface QuoteState {
  selectedIds: ReadonlySet<string>;
  selectedItems: CatalogItem[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  vehicle: VehicleInfo;
  setVehicle: (patch: Partial<VehicleInfo>) => void;
  category: string;
  setCategory: (id: string) => void;
}

const Ctx = createContext<QuoteState | null>(null);

export function QuoteProvider({ items, children }: { items: CatalogItem[]; children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [vehicle, setVehicleState] = useState<VehicleInfo>(emptyVehicle);
  const [category, setCategory] = useState<string>('all');

  const toggle = useCallback((id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }, []);
  const remove = useCallback((id: string) => setSelected((s) => s.filter((x) => x !== id)), []);
  const clear = useCallback(() => {
    setSelected([]);
    setVehicleState(emptyVehicle);
  }, []);
  const setVehicle = useCallback((patch: Partial<VehicleInfo>) => setVehicleState((v) => ({ ...v, ...patch })), []);

  const value = useMemo<QuoteState>(() => {
    const set = new Set(selected);
    // Mantém a ordem original do catálogo no resumo.
    const selectedItems = items.filter((it) => set.has(it.id));
    return { selectedIds: set, selectedItems, toggle, remove, clear, vehicle, setVehicle, category, setCategory };
  }, [selected, items, toggle, remove, clear, vehicle, setVehicle, category]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuote(): QuoteState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useQuote precisa de <QuoteProvider>');
  return v;
}
