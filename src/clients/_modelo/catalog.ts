import type { CatalogItem, Category } from '../../core/types';

/**
 * [PREENCHER] Catálogo da empresa.
 * Regras: transcrever nomes e valores exatamente como na fonte; não mesclar variantes; manter “a partir de”;
 * resumos neutros, sem inventar garantias, prazos ou condições; registrar trechos truncados em `sourceExcerpt`.
 * Enquanto não houver valores verificados, use `kind: 'on-request'` (exibe “Sob consulta”).
 */
const observedAt = '2026-01-01';
const sourceId = 'catalogo';

export const categories: Category[] = [
  { id: 'ppf', label: 'Proteção PPF', description: '[PREENCHER] Descrição curta baseada no catálogo.', photo: 'ppf' },
  { id: 'vitrificacao', label: 'Vitrificação', description: '[PREENCHER] Descrição curta baseada no catálogo.', photo: 'vitrificacao' },
  { id: 'polimento', label: 'Polimento', description: '[PREENCHER] Descrição curta baseada no catálogo.', photo: 'polimento' },
];

export const catalogItems: CatalogItem[] = [
  {
    id: 'servico-exemplo-1',
    name: '[PREENCHER] Serviço exemplo 1',
    sourceName: '[PREENCHER] Nome exatamente como na fonte',
    categoryId: 'ppf',
    summary: '[PREENCHER] Resumo neutro.',
    sourceExcerpt: '[PREENCHER] Trecho visível na fonte…',
    price: { kind: 'on-request', sourceId, observedAt },
    sourceOrder: 1,
  },
  {
    id: 'servico-exemplo-2',
    name: '[PREENCHER] Serviço exemplo 2',
    sourceName: '[PREENCHER] Nome exatamente como na fonte',
    categoryId: 'vitrificacao',
    summary: '[PREENCHER] Resumo neutro.',
    sourceExcerpt: '[PREENCHER] Trecho visível na fonte…',
    price: { kind: 'on-request', sourceId, observedAt },
    sourceOrder: 2,
  },
  {
    id: 'servico-exemplo-3',
    name: '[PREENCHER] Serviço exemplo 3',
    sourceName: '[PREENCHER] Nome exatamente como na fonte',
    categoryId: 'polimento',
    summary: '[PREENCHER] Resumo neutro.',
    sourceExcerpt: '[PREENCHER] Trecho visível na fonte…',
    price: { kind: 'on-request', sourceId, observedAt },
    sourceOrder: 3,
  },
];
