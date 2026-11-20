import { createContext, useContext, type ReactNode } from 'react';
import type { BaseSiteConfig } from '../types';

const Ctx = createContext<BaseSiteConfig | null>(null);

export function SiteProvider({ config, children }: { config: BaseSiteConfig; children: ReactNode }) {
  return <Ctx.Provider value={config}>{children}</Ctx.Provider>;
}

/** Configuração do cliente ativo. Cada nicho expõe um hook tipado (ex.: `useAutoSite`, `useModaSite`). */
export function useSite<T extends BaseSiteConfig = BaseSiteConfig>(): T {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSite precisa de <SiteProvider>');
  return v as T;
}
