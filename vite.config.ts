/// <reference types="vitest/config" />
import { existsSync } from 'node:fs';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Injeta no index.html o preload da imagem principal do cliente ativo, por convenção:
 * public/clientes/<cliente>/fotos/hero.webp (+ hero-768.webp, se existir).
 */
function heroPreload(client: string): Plugin {
  let base = '/';
  return {
    name: 'core3-hero-preload',
    configResolved(cfg) {
      base = cfg.base;
    },
    transformIndexHtml(html) {
      const dir = `public/clientes/${client}/fotos`;
      if (!existsSync(`${dir}/hero.webp`)) return html;
      const p = `${base}clientes/${client}/fotos`;
      const small = existsSync(`${dir}/hero-768.webp`) ? `${p}/hero-768.webp 768w, ` : '';
      const tag = `<link rel="preload" as="image" type="image/webp" href="${p}/hero.webp" imagesrcset="${small}${p}/hero.webp 1536w" imagesizes="100vw" fetchpriority="high" />`;
      return html.replace('</head>', `    ${tag}\n  </head>`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const client = env.VITE_CLIENT || 'company-auto-spa';
  return {
    plugins: [react(), tailwindcss(), heroPreload(client)],
    server: { host: true, port: 5173 },
    preview: { host: true, port: 4173 },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      include: ['tests/**/*.test.{ts,tsx}'],
    },
  };
});
