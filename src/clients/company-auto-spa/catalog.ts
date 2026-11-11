import type { CatalogItem, Category } from '../../core/types';

/**
 * TRANSCRIÇÃO PROVISÓRIA — feita visualmente a partir de anexos/02 e anexos/03 (WhatsApp, 11/11/2026).
 * Deve ser substituída/confrontada com docs/CATALOGO_FONTE_10_SERVICOS.json quando o arquivo for recebido.
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
    photo: 'ppf',
  },
  {
    id: 'envelopamento',
    label: 'Envelopamento',
    description: 'Personalização com envelopamento. No catálogo, o teto aparece a partir de R$ 1.500,00.',
    photo: 'envelopamento',
  },
  {
    id: 'vitrificacao',
    label: 'Vitrificação',
    description: 'Vitrificação das rodas disponível no catálogo atual.',
    photo: 'vitrificacao',
  },
  {
    id: 'insulfilm',
    label: 'Insulfilm',
    description: 'Película Insulfilm da linha Carbon.',
    photo: 'insulfilm',
  },
  {
    id: 'polimento',
    label: 'Polimento técnico',
    description: 'Polimento técnico listado no catálogo comercial.',
    photo: 'polimento',
  },
  {
    id: 'lavagem',
    label: 'Lavagem premium',
    description: 'Lavagem premium, primeiro item do catálogo da empresa.',
    photo: 'lavagem',
  },
];

export const catalogItems: CatalogItem[] = [
  {
    id: 'lavagem-premium',
    photo: 'lavagem',
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
    photo: 'ppf',
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
    photo: 'envelopamento',
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
    photo: 'vitrificacao',
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
    photo: 'inspiracao-farol',
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
    photo: 'inspiracao-farol',
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
    photo: 'inspiracao-espelho',
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
    photo: 'inspiracao-frontal',
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
    photo: 'insulfilm',
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
    photo: 'polimento',
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
