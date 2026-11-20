/**
 * Contrato do nicho AUTOMOTIVO (estética automotiva): serviços, catálogo de preços, solicitação de orçamento
 * com ficha do veículo, galeria, reputação e localização.
 */
import type { Address, BaseContact, BaseSiteConfig, Cta, Fact, PhotoId, Price } from '../../core/types';

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

export interface GalleryItem {
  photo: PhotoId;
  title: string;
}

export interface AutoSiteConfig extends BaseSiteConfig {
  niche: 'automotivo';
  contact: BaseContact & { address: Address };
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
}
