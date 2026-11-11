import type { SiteConfig } from '../../core/types';
import { catalogItems, categories } from './catalog';
import { sources } from './sources';

/**
 * Configuração da demonstração conceitual CORE 3 para a Company Auto SPA.
 * NÃO é o site oficial da empresa. Dados com fonte e data em `sources.ts`.
 */
export const companyAutoSpa: SiteConfig = {
  meta: {
    lang: 'pt-BR',
    title: 'Company Auto Spa — Estética automotiva em São Caetano do Sul | Demonstração CORE 3',
    description:
      'Demonstração conceitual CORE 3: PPF, envelopamento, vitrificação, insulfilm, polimento técnico e lavagem premium em São Caetano do Sul. Não é o site oficial da Company Auto SPA.',
    demoNotice: {
      short: 'Demonstração conceitual CORE 3 — não é o site oficial da Company Auto SPA',
      full:
        'Esta é uma demonstração conceitual independente desenvolvida pela CORE 3. Não é o site oficial da Company Auto SPA, não foi contratada pela empresa e não envia mensagens, agenda serviços ou processa pagamentos.',
    },
  },
  brand: {
    name: 'Company Auto Spa',
    shortName: 'Company',
    wordmark: { primary: 'COMPANY', secondary: 'AUTO SPA', eyebrow: 'PREMIUM' },
    logo: null,
    logoPendingNote: 'Identificação textual provisória. O logotipo oficial em alta resolução ainda não foi fornecido.',
    // Paleta derivada do emblema visível no Instagram (preto, amarelo-ouro e branco).
    // Valores aproximados a partir de miniatura — confirmar com o manual/arquivo oficial da marca.
    theme: {
      bg: '#09090A',
      surface: '#111113',
      surface2: '#18181B',
      line: '#27272B',
      text: '#F4F2ED',
      muted: '#A6A39C',
      accent: '#E4BA42',
      accentInk: '#16130A',
      accentSoft: '#E4BA421F',
    },
  },
  contact: {
    // Número oficial NÃO confirmado: o fluxo de orçamento oferece apenas copiar a solicitação.
    whatsapp: null,
    instagram: { handle: '@company.autospa', url: 'https://www.instagram.com/company.autospa/', sourceId: 'instagram-perfil' },
    linkHub: { label: 'beacons.ai/companyautospa', url: 'https://beacons.ai/companyautospa', sourceId: 'instagram-perfil' },
    address: {
      street: 'Rua Pinheiro Machado, 34',
      district: 'Santa Paula',
      city: 'São Caetano do Sul',
      state: 'SP',
      sourceId: 'google-perfil',
    },
  },
  nav: [
    { id: 'servicos', label: 'Serviços' },
    { id: 'catalogo', label: 'Catálogo' },
    { id: 'galeria', label: 'Galeria' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'avaliacoes', label: 'Avaliações' },
    { id: 'localizacao', label: 'Localização' },
  ],
  hero: {
    eyebrow: 'Estética automotiva premium · São Caetano do Sul',
    title: 'Proteção, personalização e cuidado de alto padrão.',
    highlight: 'alto padrão.',
    subtitle:
      'PPF, envelopamento, vitrificação, insulfilm, polimento técnico e lavagem premium. Escolha os serviços, informe seu veículo e leve uma solicitação organizada para a equipe da Company.',
    media: 'hero',
    mediaCredit: 'Imagem ilustrativa gerada por computador (CORE 3). Não retrata veículo ou instalação da empresa.',
    primaryCta: { label: 'Montar orçamento', href: '#catalogo' },
    secondaryCta: { label: 'Conhecer serviços', href: '#servicos' },
    highlights: [
      { title: '4,9 no Google', detail: '55 avaliações · captura de 11/11/2026', sourceId: 'google-perfil' },
      { title: '5 modalidades de PPF', detail: 'Do veículo completo aos faróis', sourceId: 'whatsapp-catalogo' },
      { title: 'Santa Paula', detail: 'Rua Pinheiro Machado, 34', sourceId: 'google-perfil' },
    ],
  },
  services: {
    eyebrow: 'Serviços',
    title: 'Seis frentes de cuidado, um mesmo padrão.',
    intro: 'Organizado a partir do catálogo comercial da própria empresa. Toque em um serviço para ver os itens e valores de referência.',
    categories,
  },
  catalog: {
    eyebrow: 'Catálogo',
    title: 'Valores de referência, sem surpresa.',
    intro: 'Os dez itens do catálogo comercial, na ordem e com os valores em que foram observados. Pesquise, filtre e selecione o que deseja orçar.',
    disclaimer:
      'Valores observados no catálogo em 11/11/2026. Consulte a empresa para confirmar vigência, condições e aplicação ao seu veículo.',
    observedAtLabel: 'Valor observado em 11/11/2026',
    items: catalogItems,
  },
  quote: {
    eyebrow: 'Solicitação',
    title: 'Sua solicitação, pronta para enviar.',
    intro: 'Revise os serviços, informe o veículo e copie a mensagem. Nada é enviado automaticamente e nenhum dado é armazenado.',
    greeting: 'Olá, Company Auto Spa! Gostaria de solicitar um orçamento.',
    closing:
      'Os valores acima foram observados no catálogo em 11/11/2026. Entendo que vigência, condições e aplicação ao meu veículo precisam ser confirmadas por vocês.',
    noWhatsappTitle: 'Contato oficial ainda não confirmado',
    noWhatsappBody:
      'Esta demonstração não abre conversas no WhatsApp porque o número oficial da Company ainda não foi confirmado. Copie a solicitação abaixo e envie pelos canais oficiais da empresa.',
  },
  gallery: {
    eyebrow: 'Galeria',
    title: 'Luz, reflexo e acabamento.',
    intro: 'Estudos visuais sobre pintura, película, água e vidro — a linguagem de um estúdio de estética automotiva.',
    notice:
      'Ilustrações geradas por computador pela CORE 3 para esta demonstração. Não retratam veículos, serviços ou instalações da Company Auto SPA e devem ser substituídas por fotografias autorizadas.',
    items: [
      { media: 'hero', title: 'Linha de ombro', caption: 'Reflexos de tubos de LED sobre pintura preta.' },
      { media: 'ppf', title: 'Película', caption: 'Estudo de borda de película sobre verniz.' },
      { media: 'vitrificacao', title: 'Hidrofobia', caption: 'Gotas sobre superfície protegida.' },
      { media: 'polimento', title: 'Profundidade', caption: 'Reflexo nítido em pintura metálica.' },
      { media: 'envelopamento', title: 'Acetinado', caption: 'Luz difusa em superfície curva.' },
      { media: 'insulfilm', title: 'Vidro', caption: 'Película escura e serigrafia de borda.' },
      { media: 'lavagem', title: 'Água', caption: 'Microgotas sobre pintura escura.' },
      { media: 'estudio', title: 'Estúdio', caption: 'Linhas de LED refletidas em piso escuro.' },
    ],
    externalCta: { label: 'Ver trabalhos reais no Instagram', href: 'https://www.instagram.com/company.autospa/' },
  },
  about: {
    eyebrow: 'Sobre',
    title: 'Um centro de estética automotiva no coração do ABC.',
    paragraphs: [
      {
        text: 'A Company Auto Spa é um centro de estética automotiva em São Caetano do Sul voltado para cuidado de alto padrão, personalização e proteção de veículos.',
        sourceId: 'google-perfil',
      },
      {
        text: 'No Instagram, a empresa se apresenta como “Company Auto Spa | ABC” e destaca PPF, envelopamento e proteção — os mesmos pilares que organizam o seu catálogo comercial.',
        sourceId: 'instagram-perfil',
      },
    ],
    facts: [
      { label: 'Endereço', value: 'Rua Pinheiro Machado, 34 · Santa Paula', sourceId: 'google-perfil' },
      { label: 'Instagram', value: '@company.autospa · 12,1 mil seguidores', sourceId: 'instagram-perfil' },
      { label: 'Catálogo', value: '10 serviços com valores de referência', sourceId: 'whatsapp-catalogo' },
    ],
    pillars: [
      { title: 'Proteção', text: 'PPF em cinco modalidades e vitrificação das rodas.' },
      { title: 'Personalização', text: 'Envelopamento de teto e Insulfilm Carbon.' },
      { title: 'Cuidado', text: 'Polimento técnico e lavagem premium.' },
    ],
  },
  reputation: {
    eyebrow: 'Reputação pública',
    title: 'Avaliação no Google',
    platform: 'Google',
    rating: 4.9,
    reviewCount: 55,
    observedAt: '2026-11-11',
    sourceId: 'google-perfil',
    category: 'Serviço de envelopamento de veículos',
    profileUrl: 'https://www.google.com/search?q=Company+Auto+SPA+S%C3%A3o+Caetano+do+Sul',
    note: 'Dado histórico da captura de 11/11/2026; a nota e o total podem ter mudado. Depoimentos individuais não são reproduzidos sem autorização.',
  },
  location: {
    eyebrow: 'Localização',
    title: 'Santa Paula, São Caetano do Sul.',
    intro: 'Consulte a empresa sobre horários e disponibilidade antes da visita.',
    mapQuery: 'Company Auto Spa, Rua Pinheiro Machado, 34 - Santa Paula, São Caetano do Sul - SP',
  },
  finalCta: {
    eyebrow: 'Próximo passo',
    title: 'Seu carro merece um orçamento bem feito.',
    text: 'Selecione os serviços, informe o veículo e copie uma solicitação clara para enviar à Company.',
    primary: { label: 'Montar orçamento', href: '#catalogo' },
    secondary: { label: 'Instagram @company.autospa', href: 'https://www.instagram.com/company.autospa/' },
  },
  footer: {
    tagline: 'Estética automotiva · PPF · Envelopamento · Proteção',
    credit: { label: 'CORE 3', text: 'Transformar processos empresariais utilizando tecnologia.' },
  },
  sources,
};
