/**
 * Seleciona a empresa ativa do template pela variável de ambiente VITE_CLIENT (nome da pasta em src/clients/).
 *   VITE_CLIENT=company-auto-spa npm run dev
 * Sem a variável, usa DEFAULT_CLIENT. Cada pasta de cliente exporta `default` um SiteConfig.
 * Para criar um cliente: `npm run novo-cliente -- <pasta> "Nome da Empresa"` (ver docs/modelo/PLAYBOOK_PREVIAS_AUTOMOTIVAS.md).
 */
import type { SiteConfig } from './core/types';

export const DEFAULT_CLIENT = 'company-auto-spa';

const modules = import.meta.glob<{ default: SiteConfig }>('./clients/*/index.ts', { eager: true });

/** Clientes disponíveis: { pasta: SiteConfig }. */
export const clients: Record<string, SiteConfig> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.split('/')[2], mod.default]),
);

const requested = import.meta.env.VITE_CLIENT || DEFAULT_CLIENT;
if (!clients[requested]) {
  throw new Error(`Cliente "${requested}" não encontrado em src/clients/. Disponíveis: ${Object.keys(clients).join(', ')}`);
}

export const activeClient = requested;
export const site: SiteConfig = clients[requested];
