import type { CatalogItem, Category } from '../../core/types';

/**
 * Catálogo transcrito visualmente de anexos/02 e anexos/03 (WhatsApp, 11/11/2026).
 * - Ordem, nomes e valores preservados exatamente como na fonte.
 * - PPF FULL GSWF e PPF FULL são itens distintos e NÃO devem ser mesclados.
 * - Envelopamento de teto mantém “a partir de”.
 * - Resumos são neutros: nada de condições, garantias ou prazos não visíveis na fonte.
 */
const observedAt = '2026-11-11';
const sourceId = 'whatsapp-catalogo';

export const categories: Category[] = [
  {
    id: 'ppf',
    label: 'Proteção PPF',
    description: 'Película de proteção de pintura em cinco modalidades no catálogo — do veículo completo aos faróis.',
    media: 'ppf',
  },
  {
    id: 'envelopamento',
    label: 'Envelopamento',
    description: 'Personalização com envelopamento. No catálogo, o teto aparece a partir de R$ 1.500,00.',
    media: 'envelopamento',
  },
  {
    id: 'vitrificacao',
    label: 'Vitrificação',
    description: 'Vitrificação das rodas disponível no catálogo atual.',
    media: 'vitrificacao',
  },
  {
    id: 'insulfilm',
    label: 'Insulfilm',
    description: 'Película Insulfilm da linha Carbon.',
    media: 'insulfilm',
  },
  {
    id: 'polimento',
    label: 'Polimento técnico',
    description: 'Polimento técnico listado no catálogo comercial.',
    media: 'polimento',
  },
  {
    id: 'lavagem',
    label: 'Lavagem premium',
    description: 'Lavagem premium, primeiro item do catálogo da empresa.',
    media: 'lavagem',
  },
];

export const catalogItems: CatalogItem[] = [
  {
    id: 'lavagem-premium',
    name: 'Lavagem Premium',
    sourceName: 'Lavagem Premium 🫧',
    categoryId: 'lavagem',
    summary: 'Lavagem premium do veículo. Etapas e produtos a confirmar com a empresa.',
    sourceExcerpt: 'Nossa lavagem premium, é u…',
    price: { kind: 'fixed', amountCents: 25000, sourceId, observedAt },
    sourceOrder: 1,
  },
  {
    id: 'ppf-full-gswf',
    name: 'PPF FULL GSWF',
    sourceName: 'PPF FULL GSWF',
    categoryId: 'ppf',
    summary: 'Proteção com PPF apresentada no catálogo como “proteção total do seu veículo”.',
    sourceExcerpt: 'Proteção total do seu veículo…',
    price: { kind: 'fixed', amountCents: 1490000, sourceId, observedAt },
    note: 'Item diferente do PPF FULL (R$ 10.900,00). Confirme com a empresa o que distingue as duas versões.',
    sourceOrder: 2,
  },
  {
    id: 'envelopamento-teto',
    name: 'Envelopamento de teto',
    sourceName: 'Envelopamento de teto',
    categoryId: 'envelopamento',
    summary: 'Envelopamento do teto. O catálogo informa preços a partir de R$ 1.500,00.',
    sourceExcerpt: 'Preços a partir de $1.500, co…',
    price: { kind: 'from', amountCents: 150000, sourceId, observedAt },
    sourceOrder: 3,
  },
  {
    id: 'vitrificacao-rodas',
    name: 'Vitrificação das rodas',
    sourceName: 'Vitrificação das rodas',
    categoryId: 'vitrificacao',
    summary: 'Vitrificação aplicada às rodas do veículo.',
    sourceExcerpt: 'Nossa vitrificação das rodas…',
    price: { kind: 'fixed', amountCents: 49900, sourceId, observedAt },
    sourceOrder: 4,
  },
  {
    id: 'ppf-farol',
    name: 'PPF NO FAROL',
    sourceName: 'PPF NO FAROL 🚥',
    categoryId: 'ppf',
    summary: 'Película de proteção (PPF) aplicada aos faróis.',
    sourceExcerpt: 'A melhor proteção para o se…',
    price: { kind: 'fixed', amountCents: 39900, sourceId, observedAt },
    sourceOrder: 5,
  },
  {
    id: 'ppf-smoke-farol',
    name: 'PPF SMOKE NO FAROL',
    sourceName: 'PPF *SMOKE* NO FAROL…',
    truncatedInSource: true,
    categoryId: 'ppf',
    summary: 'PPF na versão smoke aplicado aos faróis.',
    sourceExcerpt: 'Com o PPF SMOKE além da …',
    price: { kind: 'fixed', amountCents: 49900, sourceId, observedAt },
    note: 'O nome aparece abreviado no catálogo.',
    sourceOrder: 6,
  },
  {
    id: 'ppf-full',
    name: 'PPF FULL',
    sourceName: 'PPF FULL 🔒🔒',
    categoryId: 'ppf',
    summary: 'Proteção de pintura com PPF na modalidade Full.',
    sourceExcerpt: 'Nosso PPF FULL está inclus…',
    price: { kind: 'fixed', amountCents: 1090000, sourceId, observedAt },
    note: 'Item diferente do PPF FULL GSWF (R$ 14.900,00). Confirme com a empresa o que distingue as duas versões.',
    sourceOrder: 7,
  },
  {
    id: 'ppf-frontal',
    name: 'PPF FRONTAL',
    sourceName: 'PPF FRONTAL 🔒',
    categoryId: 'ppf',
    summary: 'Proteção com PPF na região frontal do veículo.',
    sourceExcerpt: 'Nosso PPF Frontal possui ap…',
    price: { kind: 'fixed', amountCents: 449900, sourceId, observedAt },
    sourceOrder: 8,
  },
  {
    id: 'insulfilm-carbon',
    name: 'Insulfilm Carbon',
    sourceName: 'Insulfilm Carbon',
    categoryId: 'insulfilm',
    summary: 'Película Insulfilm da linha Carbon.',
    sourceExcerpt: 'Insulfilm com adicional do p…',
    price: { kind: 'fixed', amountCents: 60000, sourceId, observedAt },
    sourceOrder: 9,
  },
  {
    id: 'polimento-tecnico',
    name: 'Polimento técnico',
    sourceName: 'Polimento técnico (Corre…',
    truncatedInSource: true,
    categoryId: 'polimento',
    summary: 'Polimento técnico. O complemento do nome aparece cortado no catálogo.',
    sourceExcerpt: 'Nosso polimento é realizado…',
    price: { kind: 'fixed', amountCents: 108000, sourceId, observedAt },
    note: 'Nome completo truncado na fonte: “Polimento técnico (Corre…”.',
    sourceOrder: 10,
  },
];
