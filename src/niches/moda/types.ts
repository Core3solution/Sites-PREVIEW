/**
 * Contrato do nicho MODA (moda fitness / activewear premium): coleção de looks com filtros, favoritos,
 * visualização rápida, guia de tamanhos, “Encontrar meu look”, sacola de atendimento (sem checkout),
 * editorial e informações de atendimento.
 */
import type { BaseSiteConfig, Cta, PhotoId, Price } from '../../core/types';

export interface ColorSwatch {
  /** Nome da cor em texto (acessibilidade: a cor nunca é informada só pelo tom). */
  name: string;
  hex: string;
}

export type Palette = 'neutros' | 'pasteis' | 'vibrantes';
export type Length = 'curto' | 'medio' | 'longo';

export interface Look {
  id: string;
  /** Número do look na coleção (ordem de “Novidades”). */
  number: number;
  name: string;
  /** Preço do look completo, com fonte e data. */
  price: Price;
  photo: PhotoId;
  /** Cores das peças, na ordem em que aparecem no card. */
  colors: ColorSwatch[];
  /** Peças do look, descritas pelo que se vê na imagem (sem prometer tecido ou tecnologia). */
  pieces: string[];
  /** Ids de `categories` em que o look aparece (pode estar em várias). */
  categories: string[];
  /** Atributos objetivos para filtros e para o “Encontrar meu look”. */
  palette: Palette;
  length: Length;
  /** Atividades sugeridas (sugestão de estilo, não promessa técnica). */
  activities: string[];
}

export interface FinderOption {
  id: string;
  label: string;
  hint?: string;
}

export interface FinderQuestion {
  /** Atributo do look avaliado pela pergunta. */
  key: 'activity' | 'palette' | 'length';
  title: string;
  options: FinderOption[];
}

export interface InfoPanel {
  id: string;
  title: string;
  /** Linha curta exibida no rodapé/lista. */
  summary: string;
  /** Parágrafos do diálogo. Sem políticas inventadas: se não houver dado oficial, diga que está pendente. */
  body: string[];
  /** Conteúdo ainda não confirmado pela marca. */
  pending: boolean;
}

export interface ModaSiteConfig extends BaseSiteConfig {
  niche: 'moda';
  /** Faixa superior (ex.: “Nova coleção / Studio to street”). */
  announcement: string;
  hero: {
    /** Rótulo editorial sobre a imagem (ex.: “Movement / 01”). */
    kicker: string;
    /** Linhas do título. */
    title: string[];
    subtitle: string;
    /** Duas imagens lado a lado no desktop; a primeira é usada sozinha no celular. */
    photos: [PhotoId, PhotoId];
    primaryCta: Cta;
    /** Abre o “Encontrar meu look”. */
    finderCtaLabel: string;
  };
  categories: { id: string; label: string }[];
  collection: {
    eyebrow: string;
    /** Título (o número de looks pode ser inserido com {n}). */
    title: string;
    intro: string;
    /** Aviso exibido junto aos preços. */
    disclaimer: string;
  };
  looks: Look[];
  sizes: {
    options: string[];
    /** false enquanto a grade não for confirmada pela marca. */
    confirmed: boolean;
    note: string;
  };
  finder: {
    title: string;
    intro: string;
    questions: FinderQuestion[];
  };
  /** Destaque editorial “shop the look”. */
  spotlight: {
    eyebrow: string;
    title: string;
    text: string;
    lookIds: string[];
  };
  bag: {
    title: string;
    intro: string;
    greeting: string;
    closing: string;
    noWhatsappTitle: string;
    noWhatsappBody: string;
  };
  editorial: {
    title: string[];
    text: string;
    cta: Cta;
    photo: PhotoId;
  };
  info: InfoPanel[];
  footer: {
    tagline: string;
    credit: { label: string; text: string };
  };
}
