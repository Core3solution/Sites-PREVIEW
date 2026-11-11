// Gera a prévia em página única (para publicar como página privada, ex.: Artifact no claude.ai).
// Uso: npm run previa -- <pasta-do-cliente>
// Saída: previa/<pasta>/index.html (CSS+JS embutidos) + previa/<pasta>/clientes/<pasta>/… (imagens)
//        previa/<pasta>/arquivos.json (mapa caminho publicado → arquivo local, para publicar junto da página)
// Verificação automática: abre a página com um reset externo agressivo (como o esqueleto do claude.ai)
// e exige título claro, fundo escuro e nenhum erro de JavaScript.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
if (!slug) {
  console.error('Uso: npm run previa -- <pasta-do-cliente>');
  process.exit(1);
}
const out = path.join(root, 'previa', slug);
const tmp = path.join(root, 'previa', `.build-${slug}`);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// 1) Build com base relativa, sem copiar public/ inteiro e com tudo embutido
const cfg = path.join(root, `vite.previa.${slug}.tmp.config.ts`);
await writeFile(cfg, `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ plugins: [react(), tailwindcss()], base: './', publicDir: false,
  build: { assetsInlineLimit: 100_000_000, cssCodeSplit: false, outDir: ${JSON.stringify(tmp)}, emptyOutDir: true, modulePreload: false } });
`);
try {
  execFileSync('npx', ['vite', 'build', '--config', cfg], { cwd: root, stdio: 'inherit', env: { ...process.env, VITE_CLIENT: slug } });
} finally {
  await rm(cfg, { force: true });
}

// 2) Página única: <title> + <style> + raiz + <script type="module"> (sem <html>/<head>, o host adiciona o esqueleto)
const assets = await readdir(path.join(tmp, 'assets'));
const js = (await readFile(path.join(tmp, 'assets', assets.find((f) => f.endsWith('.js'))), 'utf8')).replaceAll('</script', '<\\/script');
const css = await readFile(path.join(tmp, 'assets', assets.find((f) => f.endsWith('.css'))), 'utf8');
const html = `<title>Prévia ${slug}</title>\n<style>${css}</style>\n<div id="root"></div>\n<script type="module">${js}</script>\n`;
await writeFile(path.join(out, 'index.html'), html);
await rm(tmp, { recursive: true, force: true });

// 3) Imagens e ícone do cliente
const pub = path.join(root, 'public/clientes', slug);
await cp(pub, path.join(out, 'clientes', slug), { recursive: true, filter: (p) => !p.endsWith('.gitkeep') });
const files = {};
const walk = async (dir) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else files[path.relative(out, p).split(path.sep).join('/')] = p;
  }
};
await walk(path.join(out, 'clientes'));
await writeFile(path.join(out, 'arquivos.json'), JSON.stringify(files, null, 2));

// 4) Verificação com reset externo agressivo
const { chromium } = createRequire(import.meta.url)('playwright');
const skeleton = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui;color:#000;background:#fff}img{max-width:100%}[hidden]{display:none!important}</style></head><body>';
await writeFile(path.join(out, '.teste.html'), skeleton + html + '</body></html>');
const browser = await chromium.launch();
let ok = true;
for (const w of [360, 1440]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + path.join(out, '.teste.html'));
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => {
    const lum = (s) => { const [r, g, b] = s.match(/\d+(\.\d+)?/g).slice(0, 3).map((v) => +v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const imgs = [...document.querySelectorAll('main img')];
    return { titulo: lum(getComputedStyle(document.querySelector('h1')).color), fundo: lum(getComputedStyle(document.body).backgroundColor), imagens: imgs.length, quebradas: imgs.filter((i) => i.complete && !i.naturalWidth).length, largura: document.documentElement.scrollWidth };
  });
  const pass = r.titulo > 0.7 && r.fundo < 0.05 && !errors.length && r.largura <= w;
  ok &&= pass;
  console.log(`${pass ? 'OK  ' : 'FALHA'} ${w}px: ${JSON.stringify(r)}${errors.length ? ' erros: ' + errors.join(' | ') : ''}`);
}
await browser.close();
await rm(path.join(out, '.teste.html'));
console.log(`\nPrévia em previa/${slug}/index.html (${Math.round(html.length / 1024)} KB) + ${Object.keys(files).length} arquivos (previa/${slug}/arquivos.json).`);
process.exit(ok ? 0 : 1);
