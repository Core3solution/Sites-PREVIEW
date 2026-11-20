import type { Look, ModaSiteConfig } from '../../niches/moda/types';
import type { Price } from '../../core/types';
import { photos } from './photos';
import { sources } from './sources';

/**
 * VYRA — demonstração conceitual CORE 3 (nicho moda fitness, público médio-alto).
 * NÃO é o site oficial da marca. Nomes, preços e cores dos looks: layout de referência do briefing (20/11/2026).
 */
const observedAt = '2026-11-20';
const price = (reais: number): Price => ({ kind: 'fixed', amountCents: reais * 100, sourceId: 'briefing-vyra', observedAt });

const c = {
  salvia: { name: 'Sálvia', hex: '#A9B49B' },
  grafite: { name: 'Grafite', hex: '#4B4B4E' },
  manteiga: { name: 'Amarelo-manteiga', hex: '#F2E49A' },
  ardosia: { name: 'Ardósia', hex: '#646E8E' },
  azulClaro: { name: 'Azul-claro', hex: '#A6BCE4' },
  lilas: { name: 'Lilás', hex: '#B89BE0' },
  pistache: { name: 'Pistache', hex: '#CFE0A8' },
  offWhite: { name: 'Off-white', hex: '#EEE8DC' },
  marrom: { name: 'Marrom', hex: '#5A3E31' },
  amarelo: { name: 'Amarelo', hex: '#F1D650' },
  rosa: { name: 'Rosa', hex: '#E893B3' },
  azulLavanda: { name: 'Azul-lavanda', hex: '#8EA2E8' },
  marinho: { name: 'Marinho', hex: '#1F2648' },
  vermelho: { name: 'Vermelho', hex: '#B5161F' },
  coral: { name: 'Coral', hex: '#F27D5E' },
  preto: { name: 'Preto', hex: '#1C1C1E' },
  aqua: { name: 'Aqua', hex: '#8ED8C6' },
  lavanda: { name: 'Lavanda', hex: '#A88BD0' },
  rose: { name: 'Rosê', hex: '#DA9AA6' },
  bordo: { name: 'Bordô', hex: '#6F2633' },
  verdeClaro: { name: 'Verde-claro', hex: '#BFD39A' },
};

const L = (
  n: number,
  name: string,
  reais: number,
  colors: Look['colors'],
  pieces: string[],
  categories: string[],
  palette: Look['palette'],
  length: Look['length'],
  activities: string[],
): Look => {
  const id = `look-${String(n).padStart(2, '0')}`;
  return { id, number: n, name, price: price(reais), photo: id, colors, pieces, categories, palette, length, activities };
};

const looks: Look[] = [
  L(1, 'Layer sálvia', 790, [c.salvia, c.grafite], ['Top de manga longa ombro a ombro sálvia', 'Legging grafite'], ['leggings', 'sobreposicoes'], 'neutros', 'longo', ['pilates', 'diaadia']),
  L(2, 'Treino essencial', 490, [c.manteiga, c.grafite], ['Camiseta cropped amarelo-manteiga', 'Short de compressão grafite com vivo'], ['shorts'], 'pasteis', 'curto', ['funcional', 'corrida']),
  L(3, 'Capri ardósia', 690, [c.ardosia, c.azulClaro], ['Regata drapeada ardósia', 'Capri ardósia'], ['capris', 'regatas'], 'neutros', 'medio', ['pilates', 'funcional']),
  L(4, 'Lilás & pistache', 590, [c.lilas, c.pistache], ['Regata frente única lilás', 'Capri pistache'], ['capris', 'regatas'], 'pasteis', 'medio', ['pilates']),
  L(5, 'Camadas leves', 790, [c.offWhite, c.marrom], ['Blusa ombro a ombro off-white sobre top azul', 'Legging marrom com vivos azuis'], ['leggings', 'sobreposicoes'], 'neutros', 'longo', ['pilates', 'diaadia']),
  L(6, 'Energia retrô', 490, [c.amarelo, c.rosa], ['Regata amarela com vivo marinho', 'Short duplo rosa listrado'], ['shorts', 'regatas'], 'vibrantes', 'curto', ['corrida', 'funcional']),
  L(7, 'Movimento livre', 890, [c.azulLavanda, c.marinho], ['Regata decote V azul', 'Calça wide marinho com faixa creme'], ['regatas'], 'vibrantes', 'longo', ['diaadia']),
  L(8, 'Vermelho em ação', 590, [c.vermelho, c.offWhite], ['Regata vermelha com vivo off-white', 'Bermuda vermelha com vivos'], ['shorts', 'regatas'], 'vibrantes', 'medio', ['funcional', 'diaadia']),
  L(9, 'Ritmo coral', 690, [c.coral, c.preto], ['Regata coral com vivo vermelho', 'Calça preta com faixa vermelha'], ['regatas'], 'vibrantes', 'longo', ['corrida', 'diaadia']),
  L(10, 'Aqua leve', 490, [c.aqua, c.offWhite], ['Regata aqua com vivo off-white', 'Short duplo aqua'], ['shorts', 'regatas'], 'pasteis', 'curto', ['corrida']),
  L(11, 'Flare lavanda', 890, [c.manteiga, c.lavanda], ['Camiseta cropped amarelo-manteiga', 'Legging flare lavanda com bolso'], ['leggings'], 'pasteis', 'longo', ['pilates', 'diaadia']),
  L(12, 'Studio azul', 690, [c.ardosia, c.azulClaro], ['Regata drapeada ardósia sobre top azul-claro', 'Bermuda de compressão ardósia'], ['shorts', 'regatas'], 'neutros', 'medio', ['funcional']),
  L(13, 'Rosê & bordô', 790, [c.rose, c.bordo], ['Blusa de manga longa rosê com recortes', 'Capri bordô com vivos'], ['capris'], 'pasteis', 'medio', ['corrida', 'funcional']),
  L(14, 'Aquecimento', 690, [c.offWhite, c.verdeClaro], ['Jaqueta cropped off-white', 'Regata verde-claro', 'Short de compressão verde-claro'], ['shorts', 'regatas', 'sobreposicoes'], 'pasteis', 'curto', ['pilates', 'diaadia']),
  L(15, 'Flow azul', 890, [c.marrom, c.azulClaro], ['Regata decote V marrom com vivo azul', 'Legging flare azul-claro'], ['leggings', 'regatas'], 'neutros', 'longo', ['pilates', 'diaadia']),
];

const site: ModaSiteConfig = {
  niche: 'moda',
  meta: {
    lang: 'pt-BR',
    title: 'VYRA — Studio to street | Demonstração CORE 3',
    description: 'Demonstração conceitual CORE 3 para a VYRA, moda fitness do studio para a rua. Não é o site oficial da marca.',
    demoNotice: {
      short: 'Demonstração conceitual CORE 3 — não é o site oficial da VYRA',
      full: 'Esta é uma demonstração conceitual desenvolvida pela CORE 3 a partir do briefing visual da marca. Não é a loja oficial: não vende, não processa pagamentos, não reserva estoque e não envia mensagens.',
    },
  },
  brand: {
    name: 'VYRA',
    shortName: 'VYRA',
    wordmark: { primary: 'VYRA', secondary: '' },
    logo: null,
    logoPendingNote: 'Wordmark reproduzido em texto a partir do layout de referência; arquivo vetorial oficial pendente.',
    favicon: `${import.meta.env.BASE_URL ?? '/'}clientes/vyra/favicon.svg`,
    fonts: {
      display: "'Outfit Variable', 'Inter Variable', ui-sans-serif, system-ui, sans-serif",
      body: "'Inter Variable', ui-sans-serif, system-ui, sans-serif",
    },
    // Cores amostradas do layout de referência: off-white, grafite-esverdeado e verde-limão.
    theme: {
      scheme: 'light',
      bg: '#F4F4F0',
      surface: '#FFFFFF',
      surface2: '#ECECE6',
      line: '#D9D9D2',
      text: '#181C18',
      muted: '#4E524C',
      subtle: '#62665F',
      accent: '#D8F05C',
      accentInk: '#181C18',
      accentSoft: '#D8F05C40',
    },
  },
  contact: { whatsapp: null },
  nav: [
    { id: 'colecao', label: 'Novidades' },
    { id: 'categorias', label: 'Roupas' },
    { id: 'studio', label: 'Coleções' },
  ],
  announcement: 'Nova coleção / Studio to street',
  hero: {
    kicker: 'Movement / 01',
    title: ['Seu ritmo.', 'Sua evolução.'],
    subtitle: 'Looks completos para treinar, se mover e seguir o dia, do studio para a rua.',
    photos: ['look-01', 'look-04'],
    primaryCta: { label: 'Explorar coleção', href: '#colecao' },
    finderCtaLabel: 'Encontrar meu look',
  },
  categories: [
    { id: 'leggings', label: 'Leggings' },
    { id: 'capris', label: 'Capris' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'regatas', label: 'Regatas' },
    { id: 'sobreposicoes', label: 'Sobreposições' },
  ],
  collection: {
    eyebrow: 'Movement / 01',
    title: '{n} formas de se mover.',
    intro: 'Explore a coleção completa.',
    disclaimer: 'Valores de referência do briefing de demonstração (20/11/2026). Preços, tamanhos e disponibilidade a confirmar com a marca.',
  },
  looks,
  sizes: {
    options: ['PP', 'P', 'M', 'G', 'GG'],
    confirmed: false,
    note: 'Grade de referência para a demonstração. Tamanhos e medidas a confirmar com a marca.',
  },
  finder: {
    title: 'Encontrar meu look',
    intro: 'Três respostas rápidas para sugerir looks da coleção. É uma sugestão de estilo.',
    questions: [
      {
        key: 'activity',
        title: 'Para que momento é o look?',
        options: [
          { id: 'pilates', label: 'Pilates e yoga' },
          { id: 'funcional', label: 'Treino e funcional' },
          { id: 'corrida', label: 'Corrida e cardio' },
          { id: 'diaadia', label: 'Do studio para a rua' },
        ],
      },
      {
        key: 'palette',
        title: 'Qual paleta combina com você?',
        options: [
          { id: 'neutros', label: 'Neutros', hint: 'Grafite, ardósia, off-white, marrom' },
          { id: 'pasteis', label: 'Pastéis', hint: 'Lilás, pistache, manteiga, aqua' },
          { id: 'vibrantes', label: 'Vibrantes', hint: 'Coral, vermelho, amarelo, azul' },
        ],
      },
      {
        key: 'length',
        title: 'Qual comprimento você prefere?',
        options: [
          { id: 'curto', label: 'Curto', hint: 'Shorts' },
          { id: 'medio', label: 'Médio', hint: 'Capri e bermuda' },
          { id: 'longo', label: 'Longo', hint: 'Legging e calça' },
        ],
      },
    ],
  },
  spotlight: {
    eyebrow: 'Studio to street',
    title: 'Do primeiro alongamento ao fim do dia.',
    text: 'Camadas que entram e saem do treino sem perder o estilo. Escolha um look e veja as peças.',
    lookIds: ['look-05', 'look-14', 'look-07'],
  },
  bag: {
    title: 'Sua seleção',
    intro: 'Revise os looks, escolha os tamanhos e copie a solicitação para o atendimento da marca. Nada é cobrado ou enviado automaticamente.',
    greeting: 'Olá, VYRA! Tenho interesse nos looks abaixo.',
    closing: 'Valores de referência vistos em 20/11/2026. Gostaria de confirmar preço, tamanhos e disponibilidade.',
    noWhatsappTitle: 'Canal oficial ainda não confirmado',
    noWhatsappBody: 'Esta demonstração não abre conversas porque o canal oficial de atendimento da VYRA ainda não foi confirmado. Copie a solicitação e envie pelos canais oficiais da marca.',
  },
  editorial: {
    title: ['Do studio', 'para o seu dia.'],
    text: 'Looks completos pensados para acompanhar o seu ritmo, dentro e fora do treino.',
    cta: { label: 'Conheça a coleção', href: '#colecao' },
    photo: 'look-05',
  },
  info: [
    {
      id: 'tamanhos',
      title: 'Guia de tamanhos',
      summary: 'Grade PP–GG de referência',
      body: [
        'A tabela de medidas oficial da VYRA ainda não foi fornecida para esta demonstração.',
        'Os tamanhos exibidos (PP a GG) são uma grade de referência e precisam ser confirmados com a marca antes de qualquer compra.',
      ],
      pending: true,
    },
    {
      id: 'atendimento',
      title: 'Atendimento',
      summary: 'Copie sua seleção e fale com a marca',
      body: [
        'Monte sua seleção, escolha os tamanhos e copie uma solicitação organizada para enviar ao atendimento.',
        'O canal oficial de atendimento da VYRA ainda não foi confirmado nesta demonstração.',
      ],
      pending: true,
    },
    {
      id: 'entregas',
      title: 'Entregas e trocas',
      summary: 'Condições a confirmar com a marca',
      body: [
        'Prazos, frete e política de trocas e devoluções serão informados pela marca.',
        'Esta demonstração não define condições de entrega, troca ou devolução.',
      ],
      pending: true,
    },
  ],
  footer: {
    tagline: 'Studio to street.',
    credit: { label: 'CORE 3', text: 'Transformar processos empresariais utilizando tecnologia.' },
  },
  photos,
  status: {
    preliminary: true,
    note: 'Prévia: imagens e valores do briefing; tamanhos, políticas e canal de atendimento a confirmar.',
  },
  sources,
};

export default site;
