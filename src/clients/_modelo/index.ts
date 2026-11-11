import type { SiteConfig } from '../../core/types';
import { catalogItems, categories } from './catalog';
import { photos } from './photos';
import { sources } from './sources';

/**
 * CLIENTE-MODELO do template CORE 3 para estética automotiva.
 * `npm run novo-cliente -- <pasta> "Nome da Empresa"` copia esta pasta. Substitua todo “[PREENCHER]”.
 * Nada aqui é dado real: não publique este cliente.
 */
const site: SiteConfig = {
  meta: {
    lang: 'pt-BR',
    title: '[PREENCHER] Nome da Empresa — Demonstração CORE 3',
    description: 'Demonstração conceitual CORE 3 — não é o site oficial da [PREENCHER] Nome da Empresa.',
    demoNotice: {
      short: 'Demonstração conceitual CORE 3 — não é o site oficial da [PREENCHER] Nome da Empresa',
      full: 'Esta é uma demonstração conceitual independente desenvolvida pela CORE 3. Não é o site oficial da empresa, não foi contratada por ela e não envia mensagens, agenda serviços ou processa pagamentos.',
    },
  },
  brand: {
    name: '[PREENCHER] Nome da Empresa',
    shortName: '[PREENCHER]',
    wordmark: { primary: 'EMPRESA', secondary: 'ESTÉTICA AUTOMOTIVA' },
    logo: null,
    logoPendingNote: 'Identificação textual provisória. O logotipo oficial ainda não foi fornecido.',
    // [PREENCHER] Cores da identidade real (Instagram, fachada, logo). Neutro até haver referência.
    theme: {
      bg: '#0A0A0A',
      surface: '#151515',
      surface2: '#1D1D1D',
      line: '#363636',
      text: '#F7F5EF',
      muted: '#C2BFB7',
      subtle: '#A09D95',
      accent: '#D9D6CF',
      accentInk: '#111111',
      accentSoft: '#D9D6CF29',
    },
  },
  contact: {
    whatsapp: null, // somente número oficial CONFIRMADO
    address: { street: '[PREENCHER] Rua, número', district: '[PREENCHER] Bairro', city: '[PREENCHER] Cidade', state: 'UF', sourceId: 'catalogo' },
  },
  nav: [
    { id: 'servicos', label: 'Serviços' },
    { id: 'catalogo', label: 'Catálogo' },
    { id: 'galeria', label: 'Inspiração' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'localizacao', label: 'Localização' },
  ],
  hero: {
    eyebrow: '[PREENCHER] Especialidade · Cidade',
    title: '[PREENCHER] Título principal com destaque.',
    highlight: 'destaque.',
    subtitle: '[PREENCHER] Subtítulo com os serviços reais da empresa e o convite para montar a solicitação.',
    subtitleShort: '[PREENCHER] Versão curta para celular.',
    photo: 'hero',
    primaryCta: { label: 'Montar orçamento', href: '#catalogo' },
    secondaryCta: { label: 'Conhecer serviços', href: '#servicos' },
    highlights: [],
  },
  services: { eyebrow: 'Serviços', title: '[PREENCHER] Título da seção.', intro: '[PREENCHER] Introdução.', categories },
  catalog: {
    eyebrow: 'Catálogo',
    title: 'Valores de referência, sem surpresa.',
    intro: '[PREENCHER] Introdução do catálogo.',
    disclaimer: 'Valores observados no catálogo em [PREENCHER DATA]. Consulte a empresa para confirmar vigência, condições e aplicação ao seu veículo.',
    observedAtLabel: 'Valor observado em [PREENCHER DATA]',
    items: catalogItems,
  },
  quote: {
    eyebrow: 'Solicitação',
    title: 'Sua solicitação, pronta para enviar.',
    intro: 'Revise os serviços, informe o veículo e copie a mensagem. Nada é enviado automaticamente e nenhum dado é armazenado.',
    greeting: 'Olá, [PREENCHER] Nome da Empresa! Gostaria de solicitar um orçamento.',
    closing: 'Os valores acima foram observados no catálogo em [PREENCHER DATA]. Entendo que vigência, condições e aplicação ao meu veículo precisam ser confirmadas por vocês.',
    noWhatsappTitle: 'Contato oficial ainda não confirmado',
    noWhatsappBody: 'Esta demonstração não abre conversas no WhatsApp porque o número oficial ainda não foi confirmado. Copie a solicitação e envie pelos canais oficiais da empresa.',
  },
  gallery: {
    eyebrow: 'Inspiração',
    title: '[PREENCHER] Título da galeria.',
    intro: '[PREENCHER] Introdução.',
    notice: 'Espaços reservados para fotografias autorizadas. Imagens ilustrativas devem ser sinalizadas como tais.',
    items: [
      { photo: 'galeria-1', title: 'Detalhe 1' },
      { photo: 'galeria-2', title: 'Detalhe 2' },
      { photo: 'galeria-3', title: 'Detalhe 3' },
    ],
  },
  about: {
    photo: 'ambiente',
    eyebrow: 'Sobre',
    title: '[PREENCHER] Título institucional.',
    paragraphs: [{ text: '[PREENCHER] Texto institucional com fonte verificável.', sourceId: 'catalogo' }],
    facts: [{ label: 'Endereço', value: '[PREENCHER]', sourceId: 'catalogo' }],
    pillars: [
      { title: 'Proteção', text: '[PREENCHER]' },
      { title: 'Acabamento', text: '[PREENCHER]' },
      { title: 'Cuidado', text: '[PREENCHER]' },
    ],
  },
  reputation: null, // preencher somente com nota e total verificados, com fonte e data
  location: { eyebrow: 'Localização', title: '[PREENCHER] Bairro, Cidade.', intro: 'Consulte a empresa sobre horários e disponibilidade antes da visita.', mapQuery: '[PREENCHER] Endereço completo' },
  finalCta: {
    eyebrow: 'Próximo passo',
    title: '[PREENCHER] Chamada final.',
    text: 'Selecione os serviços, informe o veículo e copie uma solicitação clara.',
    primary: { label: 'Montar orçamento', href: '#catalogo' },
  },
  footer: { tagline: '[PREENCHER] Especialidades', credit: { label: 'CORE 3', text: 'Transformar processos empresariais utilizando tecnologia.' } },
  photos,
  status: { preliminary: true, note: 'Cliente-modelo: dados de exemplo.' },
  sources,
};

export default site;
