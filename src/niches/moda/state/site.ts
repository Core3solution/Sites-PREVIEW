import { useSite } from '../../../core/state/site';
import type { ModaSiteConfig } from '../types';

/** Configuração do cliente ativo com o contrato do nicho moda. */
export const useModaSite = () => useSite<ModaSiteConfig>();
