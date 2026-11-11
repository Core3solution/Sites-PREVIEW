import { createContext, useContext, type ReactNode } from 'react';
import type { SiteConfig } from '../types';

const Ctx = createContext<SiteConfig | null>(null);

export function SiteProvider({ config, children }: { config: SiteConfig; children: ReactNode }) {
  return <Ctx.Provider value={config}>{children}</Ctx.Provider>;
}

export function useSite(): SiteConfig {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSite precisa de <SiteProvider>');
  return v;
}
