/**
 * Contrato do template CORE 3 para estética automotiva.
 * Tudo que é específico de uma empresa (marca, textos, serviços, preços, links, imagens)
 * vive em `src/clients/<empresa>/` e é entregue aos componentes por um `SiteConfig`.
 */

/** Chave de uma imagem registrada em `core/generated/visuals.manifest.json` ou em `media` do cliente. */
export type MediaKey = string;

export interface Source {
  id: string;
  label: string;
  kind: 'captura' | 'web' | 'briefing';
  /** Data da observação no formato ISO (AAAA-MM-DD). */
  observedAt?: string;
  /** Arquivo de evidência dentro do repositório (ex.: anexos/...). */
  file?: string;
  url?: string;
  note?: string;
}

export type PriceKind = 'fixed' | 'from' | 'on-request';

export interface Price {
  kind: PriceKind;
  /** Valor em centavos. Obrigatório para `fixed` e `from`. */
  amountCents?: number;
  sourceId: string;
  observedAt: string;
}

export interface Category {
  id: string;
  label: string;
  /** Texto curto para o card de serviço. Não incluir condições técnicas não confirmadas. */
  description: string;
  media: MediaKey;
}

export interface CatalogItem {
  id: string;
  /** Nome exibido. */
  name: string;
  /** Nome exatamente como aparece na fonte (para auditoria). */
  sourceName: string;
  /** Quando o nome/descrição aparece cortado na fonte. */
  truncatedInSource?: boolean;
  categoryId: string;
  /** Resumo neutro, sem inventar condições. */
  summary: string;
  /** Trecho visível na fonte, como foi lido (pode terminar com reticências). */
  sourceExcerpt: string;
  price: Price;
  /** Observação específica (ex.: diferença entre variantes). */
  note?: string;
  /** Posição original no catálogo da fonte. */
  sourceOrder: number;
}

export interface ThemeTokens {
  /** Cores em hex. São injetadas como variáveis CSS em :root. */
  bg: string;
  surface: string;
  surface2: string;
  line: string;
  text: string;
  muted: string;
  accent: string;
  accentInk: string;
  accentSoft: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface Cta {
  label: string;
  /** `#id` de seção, URL externa ou ação interna (`action:quote`). */
  href: string;
}

export interface GalleryItem {
  media: MediaKey;
  title: string;
  caption: string;
}

export interface Fact {
  label: string;
  value: string;
  sourceId?: string;
}

export interface SiteConfig {
  meta: {
    lang: string;
    title: string;
    description: string;
    /** Aviso obrigatório quando o site é uma demonstração não oficial. */
    demoNotice?: { short: string; full: string };
  };
  brand: {
    name: string;
    shortName: string;
    wordmark: { primary: string; secondary: string; eyebrow?: string };
    /** Logo oficial; `null` mantém o wordmark textual provisório. */
    logo: { src: string; alt: string } | null;
    logoPendingNote?: string;
    theme: ThemeTokens;
  };
  contact: {
    /** Somente preencher com número oficial confirmado (formato E.164 sem +, ex.: 5511999999999). */
    whatsapp: { number: string; confirmedAt: string; sourceId: string } | null;
    instagram?: { handle: string; url: string; sourceId: string };
    linkHub?: { label: string; url: string; sourceId: string };
    address: {
      street: string;
      district: string;
      city: string;
      state: string;
      sourceId: string;
    };
  };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    title: string;
    /** Trecho do título destacado com a cor de acento. */
    highlight?: string;
    subtitle: string;
    media: MediaKey;
    mediaCredit: string;
    primaryCta: Cta;
    secondaryCta: Cta;
    highlights: { title: string; detail: string; sourceId?: string }[];
  };
  services: {
    eyebrow: string;
    title: string;
    intro: string;
    categories: Category[];
  };
  catalog: {
    eyebrow: string;
    title: string;
    intro: string;
    disclaimer: string;
    observedAtLabel: string;
    items: CatalogItem[];
  };
  quote: {
    eyebrow: string;
    title: string;
    intro: string;
    greeting: string;
    closing: string;
    noWhatsappTitle: string;
    noWhatsappBody: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    intro: string;
    notice: string;
    items: GalleryItem[];
    externalCta?: Cta;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: { text: string; sourceId?: string }[];
    facts: Fact[];
    pillars: { title: string; text: string }[];
  };
  reputation: {
    eyebrow: string;
    title: string;
    platform: string;
    rating: number;
    reviewCount: number;
    observedAt: string;
    sourceId: string;
    category?: string;
    profileUrl: string;
    note: string;
  } | null;
  location: {
    eyebrow: string;
    title: string;
    intro: string;
    mapQuery: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    text: string;
    primary: Cta;
    secondary?: Cta;
  };
  footer: {
    tagline: string;
    credit: { label: string; text: string };
  };
  sources: Source[];
}
