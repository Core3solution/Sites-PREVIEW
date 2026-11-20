import type { BrandConfig, ThemeTokens } from '../types';

/**
 * Injeta os tokens da marca como variáveis CSS (consumidas pelo Tailwind via @theme),
 * o esquema de cor (claro/escuro) e as famílias tipográficas opcionais da marca.
 */
export function applyTheme(t: ThemeTokens, fonts?: BrandConfig['fonts'], root: HTMLElement = document.documentElement) {
  const map: Record<string, string> = {
    '--brand-bg': t.bg,
    '--brand-surface': t.surface,
    '--brand-surface-2': t.surface2,
    '--brand-line': t.line,
    '--brand-text': t.text,
    '--brand-muted': t.muted,
    '--brand-subtle': t.subtle,
    '--brand-accent': t.accent,
    '--brand-accent-ink': t.accentInk,
    '--brand-accent-soft': t.accentSoft,
  };
  if (fonts?.display) map['--brand-font-display'] = fonts.display;
  if (fonts?.body) map['--brand-font-body'] = fonts.body;
  for (const [k, v] of Object.entries(map)) root.style.setProperty(k, v);
  root.style.colorScheme = t.scheme ?? 'dark';
  root.dataset.scheme = t.scheme ?? 'dark';
}
