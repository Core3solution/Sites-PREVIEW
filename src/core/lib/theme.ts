import type { ThemeTokens } from '../types';

/** Injeta os tokens da marca como variáveis CSS (consumidas pelo Tailwind via @theme). */
export function applyTheme(t: ThemeTokens, root: HTMLElement = document.documentElement) {
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
  for (const [k, v] of Object.entries(map)) root.style.setProperty(k, v);
}
