import type { Source } from '../../core/types';

/**
 * [PREENCHER] Registre aqui cada evidência usada (capturas, site, Instagram, briefing).
 * Todo preço e dado factual do site deve apontar para um `id` desta lista.
 * Guarde os arquivos em clientes/<pasta>/anexos/ e confira o hash se houver manifesto.
 */
export const sources: Source[] = [
  {
    id: 'catalogo',
    label: '[PREENCHER] Catálogo comercial da empresa (captura de tela)',
    kind: 'captura',
    observedAt: '2026-01-01',
    file: 'clientes/<pasta>/anexos/<arquivo>',
    note: '[PREENCHER] Data real da observação e o que a fonte mostra.',
  },
];
