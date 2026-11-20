import type { Look, ModaSiteConfig } from '../../niches/moda/types';
import type { Price } from '../../core/types';
import { photos } from './photos';
import { sources } from './sources';

/**
 * CLIENTE-MODELO do nicho MODA. `npm run novo-cliente -- <pasta> "Nome" --nicho moda` copia esta pasta.
 * Substitua todo “[PREENCHER]”. Nada aqui é dado real: não publique este cliente.
 */
const observedAt = '2026-01-01';
const ref: Price = { kind: 'on-request', sourceId: 'briefing', observedAt };

const look = (n: number, categories: string[], palette: Look['palette'], length: Look['length']): Look => ({
  id: `look-0${n}`,
  number: n,
  name: `[PREENCHER] Look ${n}`,
  price: ref,
  photo: `look-0${n}`,
  colors: [
    { name: '[PREENCHER] Cor 1', hex: '#9A9A96' },
    { name: '[PREENCHER] Cor 2', hex: '#4B4B4E' },
  ],
  pieces: ['[PREENCHER] Peça de cima', '[PREENCHER] Peça de baixo'],
  categories,
  palette,
  length,
  activities: ['treino'],
});

const site: ModaSiteConfig = {
  niche: 'moda',
  meta: {
    lang: 'pt-BR',
    title: '[PREENCHER] Marca — Demonstração CORE 3',
    description: 'Demonstração conceitual CORE 3 — não é o site oficial da [PREENCHER] Marca.',
    demoNotice: {
      short: 'Demonstração conceitual CORE 3 — não é o site oficial da [PREENCHER] Marca',
      full: 'Demonstração conceitual independente desenvolvida pela CORE 3. Não é a loja oficial: não vende, não processa pagamentos e não envia mensagens.',
    },
  },
  brand: {
    name: '[PREENCHER] Marca',
    shortName: 'MARCA',
    wordmark: { primary: 'MARCA', secondary: '' },
    logo: null,
    logoPendingNote: 'Identificação textual provisória. O logotipo oficial ainda não foi fornecido.',
    fonts: { display: "'Outfit Variable', 'Inter Variable', ui-sans-serif, system-ui, sans-serif" },
    // [PREENCHER] Cores reais da marca. Neutro claro até haver referência.
    theme: {
      scheme: 'light',
      bg: '#F4F4F0',
      surface: '#FFFFFF',
      surface2: '#ECECE6',
      line: '#D9D9D2',
      text: '#18181A',
      muted: '#4E4E52',
      subtle: '#626266',
      accent: '#D9D6CF',
      accentInk: '#18181A',
      accentSoft: '#D9D6CF55',
    },
  },
  contact: { whatsapp: null },
  nav: [
    { id: 'colecao', label: 'Novidades' },
    { id: 'categorias', label: 'Roupas' },
    { id: 'studio', label: 'Coleções' },
  ],
  announcement: '[PREENCHER] Nova coleção',
  hero: {
    kicker: '[PREENCHER] Coleção / 01',
    title: ['[PREENCHER] Título', 'em duas linhas.'],
    subtitle: '[PREENCHER] Subtítulo curto.',
    photos: ['look-01', 'look-02'],
    primaryCta: { label: 'Explorar coleção', href: '#colecao' },
    finderCtaLabel: 'Encontrar meu look',
  },
  categories: [
    { id: 'leggings', label: 'Leggings' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'tops', label: 'Tops' },
  ],
  collection: {
    eyebrow: '[PREENCHER] Coleção',
    title: '{n} looks para se mover.',
    intro: 'Explore a coleção completa.',
    disclaimer: 'Valores do briefing de demonstração ([PREENCHER DATA]). Preços, tamanhos e disponibilidade a confirmar com a marca.',
  },
  looks: [look(1, ['leggings', 'tops'], 'neutros', 'longo'), look(2, ['shorts'], 'pasteis', 'curto'), look(3, ['tops'], 'vibrantes', 'medio')],
  sizes: { options: ['PP', 'P', 'M', 'G', 'GG'], confirmed: false, note: 'Grade de referência. Tamanhos e medidas a confirmar com a marca.' },
  finder: {
    title: 'Encontrar meu look',
    intro: 'Três respostas rápidas para sugerir looks. É uma sugestão de estilo.',
    questions: [
      { key: 'activity', title: 'Para que momento é o look?', options: [{ id: 'treino', label: 'Treino' }, { id: 'diaadia', label: 'Dia a dia' }] },
      { key: 'palette', title: 'Qual paleta combina com você?', options: [{ id: 'neutros', label: 'Neutros' }, { id: 'pasteis', label: 'Pastéis' }, { id: 'vibrantes', label: 'Vibrantes' }] },
      { key: 'length', title: 'Qual comprimento você prefere?', options: [{ id: 'curto', label: 'Curto' }, { id: 'medio', label: 'Médio' }, { id: 'longo', label: 'Longo' }] },
    ],
  },
  spotlight: { eyebrow: '[PREENCHER]', title: '[PREENCHER] Título editorial.', text: '[PREENCHER] Texto.', lookIds: ['look-01', 'look-02', 'look-03'] },
  bag: {
    title: 'Sua seleção',
    intro: 'Revise os looks, escolha os tamanhos e copie a solicitação para o atendimento. Nada é cobrado ou enviado.',
    greeting: 'Olá, [PREENCHER] Marca! Tenho interesse nos looks abaixo.',
    closing: 'Gostaria de confirmar preço, tamanhos e disponibilidade.',
    noWhatsappTitle: 'Canal oficial ainda não confirmado',
    noWhatsappBody: 'Copie a solicitação e envie pelos canais oficiais da marca.',
  },
  editorial: { title: ['[PREENCHER]', 'chamada final.'], text: '[PREENCHER] Texto.', cta: { label: 'Conheça a coleção', href: '#colecao' }, photo: 'look-03' },
  info: [
    { id: 'tamanhos', title: 'Guia de tamanhos', summary: 'Grade de referência', body: ['[PREENCHER] Tabela oficial pendente.'], pending: true },
    { id: 'atendimento', title: 'Atendimento', summary: 'Copie sua seleção', body: ['[PREENCHER] Canal oficial pendente.'], pending: true },
    { id: 'entregas', title: 'Entregas e trocas', summary: 'Condições a confirmar', body: ['Esta demonstração não define condições de entrega ou troca.'], pending: true },
  ],
  footer: { tagline: '[PREENCHER]', credit: { label: 'CORE 3', text: 'Transformar processos empresariais utilizando tecnologia.' } },
  photos,
  status: { preliminary: true, note: 'Cliente-modelo: dados de exemplo.' },
  sources,
};

export default site;
