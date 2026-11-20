// QA no navegador real (Chromium/Playwright) contra o build de produção servido por `vite preview`.
// Uso: VITE_CLIENT=<pasta> npm run build && npx vite preview --port 4173 &  QA_CLIENT=<pasta> npm run qa
// Parâmetros do cliente: src/clients/<pasta>/qa.json. Capturas e resultados: clientes/<pasta>/evidencias/.
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLIENT = process.env.QA_CLIENT || process.env.VITE_CLIENT || 'company-auto-spa';
const cfg = JSON.parse(await readFile(path.join(root, 'src/clients', CLIENT, 'qa.json'), 'utf8'));
const out = path.join(root, 'clientes', CLIENT, 'evidencias');
const teclado = cfg.teclado ?? { cta: 'Montar orçamento', alvo: 'catalogo' };
const perfCfg = cfg.perf ?? { secao: 'catalogo', seletor: '#catalogo button[aria-pressed]' };
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const URL = process.env.QA_URL ?? 'http://localhost:4173/';
await mkdir(out, { recursive: true });

// Sobe `vite preview` automaticamente se não houver servidor no endereço (e encerra ao final).
let server = null;
const up = async () => { try { return (await fetch(URL)).ok; } catch { return false; } };
if (!(await up())) {
  const port = new globalThis.URL(URL).port || '4173';
  server = spawn('npx', ['vite', 'preview', '--port', port, '--strictPort'], { cwd: root, stdio: 'ignore', env: { ...process.env, VITE_CLIENT: CLIENT } });
  for (let i = 0; i < 50 && !(await up()); i++) await new Promise((r) => setTimeout(r, 200));
  if (!(await up())) throw new Error(`Servidor de prévia não respondeu em ${URL}. Rode o build antes (VITE_CLIENT=${CLIENT} npm run build).`);
}
const axeSrc = await readFile(path.join(root, 'node_modules/axe-core/axe.min.js'), 'utf8');

const results = [];
const check = (area, name, ok, detail = '') => {
  results.push({ area, name, ok: !!ok, detail: String(detail) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  [${area}] ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();

async function newPage(width, height, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: opts.dpr ?? 1, reducedMotion: opts.reducedMotion ?? 'no-preference', hasTouch: opts.touch ?? false, isMobile: opts.mobile ?? false });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new globalThis.URL(URL).origin });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(URL, { waitUntil: 'networkidle' });
  return { ctx, page, errors };
}

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.mouse.wheel(0, 500); await page.waitForTimeout(60); }
  await page.waitForTimeout(900);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); });
  await page.waitForTimeout(300);
}

const scrollTo = (page, sel) => page.evaluate((s) => { document.documentElement.style.scrollBehavior = 'auto'; document.querySelector(s).scrollIntoView(); }, sel);

// 1. Responsividade + capturas
for (const [w, h] of [[360, 780], [390, 844], [768, 1024], [1280, 800], [1440, 900]]) {
  const mobile = w < 768;
  const { ctx, page, errors } = await newPage(w, h, { dpr: w === 1440 || w === 390 ? 2 : 1, touch: mobile, mobile });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(out, `hero-${w}.png`) });
  await scrollThrough(page);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  check('Responsividade', `${w}px sem rolagem horizontal`, sw <= w, `scrollWidth=${sw}`);
  const tiny = await page.evaluate(() => {
    let n = 0; const list = [];
    for (const el of document.querySelectorAll('body *')) {
      if (!el.childNodes.length || ![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 10.5 && el.getBoundingClientRect().width > 0) { n++; list.push(el.textContent.trim().slice(0, 30)); }
    }
    return [n, list.slice(0, 3)];
  });
  check('Responsividade', `${w}px sem texto menor que 10,5px`, tiny[0] === 0, tiny[0] ? JSON.stringify(tiny[1]) : '');
  // Títulos e textos não podem ser cortados (conteúdo mais largo que a própria caixa)
  const cut = await page.evaluate(() => [...document.querySelectorAll('h1, h2, h3, p, a, button')]
      .filter((e) => e.offsetParent && !e.closest('.sr-only') && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== 'auto' && !e.closest('.marquee, .no-scrollbar'))
    .map((e) => e.textContent.trim().slice(0, 30)));
  check('Responsividade', `${w}px sem texto cortado`, cut.length === 0, cut.join(' | '));
  // Contraste real de cada texto sobre o fundo efetivo (axe-core, WCAG AA)
  await page.addScriptTag({ content: axeSrc });
  const axeV = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['color-contrast'] })).violations.flatMap((v) => v.nodes.map((n) => n.html.replace(/<[^>]+>/g, '').trim().slice(0, 30))));
  check('Acessibilidade', `${w}px contraste AA em todos os textos (axe-core)`, axeV.length === 0, axeV.join(' | '));
  if (mobile) {
    const small = await page.evaluate(() => [...document.querySelectorAll('main button, main a, header button, header a')]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 36 && r.width < 36); })
      .map((e) => (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 24)));
    check('Responsividade', `${w}px áreas de toque ≥ 36px`, small.length === 0, small.join(', '));
  }
  // página inteira em JPEG para manter o repositório leve
  await page.screenshot({ path: path.join(out, `pagina-inteira-${w}.jpg`), fullPage: true, type: 'jpeg', quality: 78 });
  check('Console', `${w}px sem erros de JavaScript`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 2–3. Interações específicas do nicho (scripts/qa/<nicho>.mjs)
const nicho = cfg.nicho ?? 'automotivo';
await (await import(`./qa/${nicho}.mjs`)).run({ browser, newPage, check, out, cfg, scrollTo, scrollThrough, URL, esc, path, writeFile });

{
  const { ctx, page } = await newPage(1280, 800);
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check('Teclado', 'Primeiro Tab foca "Pular para o conteúdo"', firstFocus === 'Pular para o conteúdo', firstFocus);
  let reached = false;
  for (let i = 0; i < 40 && !reached; i++) {
    await page.keyboard.press('Tab');
    reached = await page.evaluate((t) => document.activeElement?.textContent?.trim().startsWith(t), teclado.cta);
  }
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  check('Teclado', 'CTA principal alcançável por Tab com foco visível', reached && outline !== 'none', outline);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1200);
  const t = await page.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, teclado.alvo);
  check('Teclado', 'Enter no CTA leva ao catálogo', Math.abs(t - 84) < 40, `top=${Math.round(t)}`);
  await ctx.close();
}
{
  const { ctx, page } = await newPage(1280, 800, { reducedMotion: 'reduce' });
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => ({ reveal: document.documentElement.classList.contains('reveal-on'), p: getComputedStyle(document.getElementById('inicio')).getPropertyValue('--p').trim() }));
  check('Movimento', 'prefers-reduced-motion desativa revelação e parallax', !r.reveal && (r.p === '0' || r.p === ''), JSON.stringify(r));
  await ctx.close();
}

// 4. Robustez a CSS externo: simula o esqueleto da prévia (reset sem camada com texto preto e fundo branco)
for (const [w, h] of [[360, 800], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.route(URL, async (route) => {
    const res = await route.fetch();
    const html = (await res.text()).replace('<head>', '<head><style>:root{color-scheme:light}body{margin:0;font:14px system-ui;color:#000;background:#fff}img{max-width:100%}</style>');
    await route.fulfill({ response: res, body: html, headers: { ...res.headers(), 'content-type': 'text/html' } });
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const c = await page.evaluate(() => {
    const lum = (s) => { const [r, g, b] = s.match(/\d+(\.\d+)?/g).slice(0, 3).map((v) => +v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const h1 = document.querySelector('h1');
    const spans = [...h1.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    // fundo efetivo do título: primeiro ancestral com cor de fundo opaca
    let el = h1, bg = 'rgb(255, 255, 255)';
    while (el) { const c = getComputedStyle(el).backgroundColor; if (!/rgba\(.*, 0\)$|transparent/.test(c)) { bg = c; break; } el = el.parentElement; }
    const [a, b] = [lum(getComputedStyle(h1).color), lum(bg)].sort((x, y) => y - x);
    const scheme = document.documentElement.dataset.scheme || 'dark';
    const pageBg = lum(getComputedStyle(document.body).backgroundColor);
    return { contraste: +((a + 0.05) / (b + 0.05)).toFixed(2), scheme, fundoPagina: +pageBg.toFixed(3) };
  });
  check('Contraste', `${w}px título do hero legível mesmo com CSS externo agressivo`, c.contraste >= 7 && (c.scheme === 'light' ? c.fundoPagina > 0.8 : c.fundoPagina < 0.05), JSON.stringify(c));
  await page.screenshot({ path: path.join(out, `hero-css-externo-${w}.png`) });
  await ctx.close();
}

// 5. Desempenho (laboratório): celular emulado com CPU 4× mais lenta e rede ~4G. Não são dados de campo.
const perf = {};
for (const [label, w, h, slow] of [['celular-4g', 390, 844, true], ['desktop', 1440, 900, false]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: slow ? 3 : 1, isMobile: slow, hasTouch: slow });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (slow) {
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (4 * 1024 * 1024) / 8, uploadThroughput: (1.5 * 1024 * 1024) / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(1200);
  // latência de uma interação (clique em "Adicionar") medida do evento ao próximo quadro pintado
  await page.evaluate((id) => { document.documentElement.style.scrollBehavior = 'auto'; document.getElementById(id).scrollIntoView(); }, perfCfg.secao);
  await page.waitForTimeout(400);
  const inp = await page.evaluate((sel) => new Promise((resolve) => {
    const btn = [...document.querySelectorAll(sel)][0];
    const t0 = performance.now();
    btn.click();
    requestAnimationFrame(() => setTimeout(() => resolve(performance.now() - t0), 0));
  }), perfCfg.seletor);
  const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3) }));
  perf[label] = { ...m, interacaoMs: Math.round(inp) };
  check('Desempenho', `${label}: LCP ≤ 2,5 s, CLS ≤ 0,1, interação ≤ 200 ms (laboratório)`, m.lcp <= 2500 && m.cls <= 0.1 && inp <= 200, JSON.stringify(perf[label]));
  await ctx.close();
}
await writeFile(path.join(out, 'desempenho-laboratorio.json'), JSON.stringify(perf, null, 2));

await browser.close();
server?.kill();
const passed = results.filter((r) => r.ok).length;
await writeFile(path.join(out, 'resultados-qa.json'), JSON.stringify({ url: URL, executadoEm: new Date().toISOString(), aprovados: passed, total: results.length, resultados: results }, null, 2));
console.log(`\n${passed}/${results.length} verificações aprovadas`);
process.exit(passed === results.length ? 0 : 1);
