/**
 * Contrato do template CORE 3 para estética automotiva.
 * Tudo que é específico de uma empresa (marca, textos, serviços, preços, links, imagens)
 * vive em `src/clients/<empresa>/` e é entregue aos componentes por um `SiteConfig`.
 */

/** Identificador de um espaço de fotografia definido em `SiteConfig.photos`. */
export type PhotoId = string;

/** Fotografia aprovada para uso (autorizada pela empresa ou licenciada). */
export interface ApprovedPhoto {
  /** Arquivo em `public/` (ex.: '/fotos/hero-2400.webp'). */
  src: string;
  /** Variações responsivas opcionais: [{ src, width }]. */
  variants?: { src: string; width: number }[];
  width: number;
  height: number;
  alt: string;
  /** Autor/origem e licença ou autorização (exibido em legenda quando relevante). */
  credit: string;
  /** Imagem ilustrativa (ex.: gerada por IA): o site exibe o selo “Imagem ilustrativa”. */
  illustrative?: boolean;
  sourceId?: string;
}

/**
 * Espaço reservado para uma fotografia real.
 * Enquanto `photo` for `null`, o site exibe um placeholder identificado com a direção de arte esperada —
 * nunca uma ilustração que simule fotografia.
 */
export interface PhotoSlot {
  id: PhotoId;
  /** Nome curto do espaço (ex.: "Fotografia principal"). */
  label: string;
  /** O que a fotografia precisa mostrar (direção de arte). */
  brief: string;
  /** Proporção alvo, ex.: '16:9'. */
  aspect: string;
  /** Largura mínima recomendada em pixels. */
  minWidth: number;
  photo: ApprovedPhoto | null;
}

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
  photo: PhotoId;
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
  /** Imagem do item; sem ela, usa a imagem da categoria. */
  photo?: PhotoId;
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
  /** Texto terciário (legendas, fontes). Deve manter contraste ≥ 4,5:1 sobre surface2. */
  subtle: string;
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
  photo: PhotoId;
  title: string;
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
    /** Versão curta do subtítulo para celulares (primeira dobra mais leve). */
    subtitleShort?: string;
    photo: PhotoId;
    /** Versão vertical para celulares (opcional). */
    mobilePhoto?: PhotoId;
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
    photo: PhotoId;
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
    photo?: PhotoId;
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
  /** Espaços de fotografia (aprovadas ou pendentes) usados pelas seções. */
  photos: Record<PhotoId, PhotoSlot>;
  /** Pendências de dados a sinalizar no site enquanto a versão for preliminar. */
  status?: { preliminary: boolean; note: string };
  sources: Source[];
}
