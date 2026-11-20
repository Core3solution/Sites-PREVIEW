import { useSite } from '../../../core/state/site';
import type { AutoSiteConfig } from '../types';

/** Configuração do cliente ativo com o contrato do nicho automotivo. */
export const useAutoSite = () => useSite<AutoSiteConfig>();
