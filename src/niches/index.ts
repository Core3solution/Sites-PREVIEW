/**
 * Registro de nichos do template CORE 3.
 * Para criar um nicho: src/niches/<nicho>/{types.ts, Page.tsx, …} e registre abaixo.
 */
import type { ComponentType } from 'react';
import AutomotivoNiche from './automotivo/Page';
import ModaNiche from './moda/Page';
import type { AutoSiteConfig } from './automotivo/types';
import type { ModaSiteConfig } from './moda/types';

/** Configuração de qualquer cliente, discriminada por `niche`. */
export type SiteConfig = AutoSiteConfig | ModaSiteConfig;
export type Niche = SiteConfig['niche'];

export const nichePages: Record<Niche, ComponentType> = {
  automotivo: AutomotivoNiche,
  moda: ModaNiche,
};
