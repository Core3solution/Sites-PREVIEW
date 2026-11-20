/**
 * Contrato BASE do template CORE 3 (comum a todos os nichos).
 * Cada nicho (src/niches/<nicho>/types.ts) estende `BaseSiteConfig` com as próprias seções.
 * Tudo que é específico de uma empresa vive em `src/clients/<empresa>/`.
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
  /** Esquema de cor (padrão 'dark'): define `color-scheme` e o contraste dos controles nativos. */
  scheme?: 'dark' | 'light';
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

export interface Fact {
  label: string;
  value: string;
  sourceId?: string;
}

export interface Address {
  street: string;
  district: string;
  city: string;
  state: string;
  sourceId: string;
}

export interface BaseContact {
  /** Somente preencher com número oficial confirmado (formato E.164 sem +, ex.: 5511999999999). */
  whatsapp: { number: string; confirmedAt: string; sourceId: string } | null;
  instagram?: { handle: string; url: string; sourceId: string };
  linkHub?: { label: string; url: string; sourceId: string };
  address?: Address;
}

export interface BrandConfig {
  name: string;
  shortName: string;
  wordmark: { primary: string; secondary: string; eyebrow?: string };
  /** Logo oficial; `null` mantém o wordmark textual provisório. */
  logo: { src: string; alt: string } | null;
  logoPendingNote?: string;
  /** Ícone da aba (arquivo em public/), opcional. */
  favicon?: string;
  /** Famílias tipográficas (CSS font-family). Sem valor, usa as do template. */
  fonts?: { display?: string; body?: string };
  theme: ThemeTokens;
}

/** Campos comuns a todo cliente, de qualquer nicho. */
export interface BaseSiteConfig {
  /** Nicho que define o layout e as regras (src/niches/<nicho>/). */
  niche: string;
  meta: {
    lang: string;
    title: string;
    description: string;
    /** Aviso obrigatório quando o site é uma demonstração não oficial. */
    demoNotice?: { short: string; full: string };
  };
  brand: BrandConfig;
  contact: BaseContact;
  nav: NavItem[];
  /** Espaços de fotografia (aprovadas ou pendentes) usados pelas seções. */
  photos: Record<PhotoId, PhotoSlot>;
  /** Pendências de dados a sinalizar no site enquanto a versão for preliminar. */
  status?: { preliminary: boolean; note: string };
  sources: Source[];
}
