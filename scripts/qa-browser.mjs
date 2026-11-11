// QA no navegador real (Chromium/Playwright) contra o build de produção servido por `vite preview`.
// Uso: npm run build && npx vite preview --port 4173 & npm run qa
// Gera capturas e resultados em evidencias/.
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'evidencias');
const URL = process.env.QA_URL ?? 'http://localhost:4173/';
await mkdir(out, { recursive: true });
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

// 2. Interações (desktop)
{
  const { ctx, page } = await newPage(1440, 900);
  // Navegação do header
  await page.click('header nav a[href="#catalogo"]');
  await page.waitForTimeout(1200);
  const top = await page.evaluate(() => document.getElementById('catalogo').getBoundingClientRect().top);
  check('Navegação', 'Menu "Catálogo" rola até a seção', Math.abs(top - 84) < 40, `top=${Math.round(top)}`);
  const current = await page.getAttribute('header nav a[href="#catalogo"]', 'aria-current');
  check('Navegação', 'Item ativo destacado (scroll-spy)', current === 'true');

  // Busca e filtros
  const cat = page.locator('#catalogo');
  const count = () => cat.locator('li button[aria-pressed]').count();
  check('Catálogo', '10 itens exibidos', (await count()) === 10);
  await cat.getByRole('searchbox').fill('farol');
  check('Catálogo', 'Busca "farol" → 2 itens', (await count()) === 2);
  await cat.getByRole('searchbox').fill('vitrificacao');
  check('Catálogo', 'Busca sem acento "vitrificacao" → 1 item', (await count()) === 1);
  await cat.getByRole('button', { name: 'Limpar busca' }).click();
  await cat.getByRole('button', { name: /^Proteção PPF/ }).click();
  check('Catálogo', 'Filtro "Proteção PPF" → 5 itens', (await count()) === 5);
  await cat.locator('select').selectOption('price-desc');
  const first = await cat.locator('li h3').first().textContent();
  check('Catálogo', 'Ordenar por maior valor → PPF FULL GSWF primeiro', first === 'PPF FULL GSWF', first);
  await cat.getByRole('button', { name: 'Limpar filtros' }).first().click();
  check('Catálogo', '"Limpar filtros" restaura 10 itens', (await count()) === 10);
  const teto = await cat.locator('li', { hasText: 'Envelopamento de teto' }).innerText();
  check('Catálogo', 'Teto exibe "A partir de R$ 1.500,00"', /A PARTIR DE\s*R\$ 1\.500,00/i.test(teto));
  await cat.getByRole('button', { name: 'Ver trecho do catálogo' }).first().click();
  check('Catálogo', 'Trecho do catálogo expande', await cat.getByText('Texto como aparece, truncado').first().isVisible());

  // Card de serviço → catálogo filtrado
  await scrollTo(page, '#servicos');
  await page.locator('#servicos button', { hasText: 'Insulfilm' }).click();
  await page.waitForTimeout(1200);
  const pressed = await cat.getByRole('button', { name: /^Insulfilm/ }).getAttribute('aria-pressed');
  check('Serviços', 'Card "Insulfilm" abre o catálogo filtrado', pressed === 'true' && (await count()) === 1);
  await cat.getByRole('button', { name: /^Todos/ }).click();

  // Seleção
  await cat.getByRole('button', { name: /Adicionar\s*PPF FULL$/ }).click();
  await cat.getByRole('button', { name: /Adicionar\s*Envelopamento de teto$/ }).click();
  check('Seleção', '2 serviços marcados', (await cat.locator('button[aria-pressed="true"]', { hasText: 'Selecionado' }).count()) === 2);
  const badge = await page.locator('header a[href="#solicitacao"]').innerText();
  check('Seleção', 'Contador no header = 2', badge.includes('2'), badge.replace(/\s+/g, ' '));
  await cat.getByRole('checkbox', { name: 'Somente selecionados' }).check();
  check('Seleção', '"Somente selecionados" → 2 itens', (await count()) === 2);
  await cat.getByRole('checkbox', { name: 'Somente selecionados' }).uncheck();

  // Veículo + resumo + cópia
  const q = page.locator('#solicitacao');
  await scrollTo(page, '#solicitacao');
  await q.getByPlaceholder('Ex.: Porsche').fill('BMW');
  await q.getByPlaceholder('Ex.: 911 Carrera').fill('M3 Competition');
  await q.getByPlaceholder('Ex.: 2023').fill('20a24');
  await q.getByPlaceholder('Ex.: Preto').fill('Azul');
  const year = await q.getByPlaceholder('Ex.: 2023').inputValue();
  check('Formulário', 'Ano aceita só dígitos (máx. 4)', year === '2024', year);
  const msg = await q.locator('#quote-preview').inputValue();
  check('Resumo', 'Mensagem contém serviços, veículo e aviso', msg.includes('PPF FULL — referência no catálogo: R$ 10.900,00') && msg.includes('A partir de R$ 1.500,00') && msg.includes('Veículo: BMW M3 Competition · 2024 · Azul') && msg.includes('11/11/2026'));
  await q.getByRole('button', { name: /Copiar solicitação/ }).click();
  await page.waitForTimeout(300);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  check('Cópia', 'Área de transferência recebe a mensagem exata', clip === msg);
  check('Cópia', 'Feedback "Solicitação copiada" exibido', await page.getByText('Solicitação copiada').isVisible());
  await page.waitForTimeout(700); // aguarda animações de entrada
  await page.screenshot({ path: path.join(out, 'fluxo-solicitacao-1440.png') });

  // Como enviar (sem WhatsApp confirmado)
  await q.getByRole('button', { name: /Como enviar/ }).click();
  const dlg = page.getByRole('dialog', { name: 'Contato oficial ainda não confirmado' });
  check('CTA', '"Como enviar" abre modal com resumo', await dlg.isVisible());
  check('CTA', 'Nenhum link wa.me na página', (await page.locator('a[href*="wa.me"], a[href*="api.whatsapp"]').count()) === 0);
  await page.waitForTimeout(700); // aguarda animações de entrada
  await page.screenshot({ path: path.join(out, 'modal-como-enviar-1440.png') });
  await page.keyboard.press('Escape');
  check('Acessibilidade', 'Esc fecha o modal', !(await dlg.isVisible()));

  // Galeria
  await scrollTo(page, '#galeria');
  await page.getByRole('button', { name: /: PPF no farol$/ }).click();
  check('Galeria', 'Lightbox abre (especificação da foto pendente)', await page.getByRole('dialog', { name: 'PPF no farol' }).isVisible());
  await page.keyboard.press('ArrowRight');
  check('Galeria', 'Seta → avança item', await page.getByRole('dialog', { name: 'PPF frontal' }).isVisible());
  check('Galeria', 'Especificação mostra direção de arte e situação', await page.getByText('Aguardando foto autorizada').isVisible());
  await page.waitForTimeout(700); // aguarda animações de entrada
  await page.screenshot({ path: path.join(out, 'galeria-lightbox-1440.png') });
  await page.keyboard.press('Escape');

  // Fotografias: nada de imagem sem aprovação
  const imgs = await page.locator('main img').count();
  const pend = await page.locator('[data-photo-status="pendente"]').count();
  check('Fotografias', 'Nenhuma imagem sem fotografia aprovada; placeholders identificados', imgs === 0 && pend > 10, `img=${imgs}, pendentes=${pend}`);

  // Localização
  await scrollTo(page, '#localizacao');
  await page.getByRole('button', { name: 'Copiar endereço' }).click();
  await page.waitForTimeout(200);
  const addr = await page.evaluate(() => navigator.clipboard.readText());
  check('Localização', 'Copiar endereço', addr.includes('Rua Pinheiro Machado, 34'), addr);
  await page.getByRole('button', { name: 'Carregar mapa interativo' }).click();
  const src = await page.locator('#localizacao iframe').getAttribute('src');
  check('Localização', 'Mapa interativo carregado sob demanda', src?.startsWith('https://www.google.com/maps?q='), src);

  // Links externos
  const links = await page.$$eval('a[href^="http"]', (as) => as.map((a) => ({ href: a.href, target: a.target, rel: a.rel, text: a.textContent.trim().slice(0, 40) })));
  const unsafe = links.filter((l) => l.target !== '_blank' || !l.rel.includes('noopener'));
  check('Links', `${links.length} links externos com nova aba + noopener`, unsafe.length === 0, unsafe.map((l) => l.href).join(', '));
  const allowed = [/^https:\/\/www\.instagram\.com\/company\.autospa\/$/, /^https:\/\/beacons\.ai\/companyautospa$/, /^https:\/\/www\.google\.com\/(maps|search)/, /^https:\/\/waze\.com\/ul\?/];
  const unknown = [...new Set(links.map((l) => l.href))].filter((h) => !allowed.some((r) => r.test(h)));
  check('Links', 'Somente destinos conhecidos (Instagram, beacons, Google, Waze)', unknown.length === 0, unknown.join(', '));
  await writeFile(path.join(out, 'links-externos.json'), JSON.stringify([...new Map(links.map((l) => [l.href, l])).values()], null, 2));

  // Âncoras internas
  const anchors = await page.$$eval('a[href^="#"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
  const missing = await page.evaluate((list) => list.filter((h) => h !== '#' && !document.getElementById(h.slice(1))), anchors);
  check('Links', `${anchors.length} âncoras internas apontam para seções existentes`, missing.length === 0, missing.join(', '));

  // Botões sem ação: todo <button> visível precisa ter handler React ou estar num form
  const reactless = await page.$$eval('button', (bs) => bs.filter((b) => b.offsetParent && !Object.keys(b).some((k) => k.startsWith('__reactProps') && b[k].onClick) && b.type !== 'submit').map((b) => b.textContent.trim()));
  check('CTA', 'Todos os botões visíveis possuem ação', reactless.length === 0, reactless.join(', '));

  // Limpar
  await scrollTo(page, '#solicitacao');
  await q.getByRole('button', { name: /Limpar solicitação/ }).click();
  check('Resumo', '"Limpar solicitação" zera seleção e veículo', (await page.locator('#catalogo button[aria-pressed="true"]', { hasText: 'Selecionado' }).count()) === 0 && (await q.getByPlaceholder('Ex.: Porsche').inputValue()) === '');

  // Parallax
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.mouse.wheel(0, 350);
  await page.waitForTimeout(700);
  const p = await page.evaluate(() => parseFloat(getComputedStyle(document.getElementById('inicio')).getPropertyValue('--p')));
  check('Movimento', 'Parallax do hero responde ao scroll', p > 0.05, `--p=${p}`);

  // Contraste (WCAG) dos pares principais
  const contrast = await page.evaluate(() => {
    const hex = (h) => h.match(/\w\w/g).map((x) => parseInt(x, 16) / 255);
    const lum = (rgb) => { const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const ratio = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((m, n) => n - m); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
    const v = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim().slice(1, 7);
    return { textoBg: ratio(v('--brand-text'), v('--brand-bg')), mutedBg: ratio(v('--brand-muted'), v('--brand-bg')), mutedSurface: ratio(v('--brand-muted'), v('--brand-surface-2')), accentBg: ratio(v('--brand-accent'), v('--brand-bg')), inkAccent: ratio(v('--brand-accent-ink'), v('--brand-accent')) };
  });
  check('Acessibilidade', 'Contraste ≥ 4,5:1 nos pares de texto', Object.values(contrast).every((r) => r >= 4.5), JSON.stringify(contrast));
  await ctx.close();
}

// 3. Mobile: menu, barra fixa, teclado
{
  const { ctx, page } = await newPage(390, 844, { dpr: 2, touch: true, mobile: true });
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  check('Menu mobile', 'Abre', await menu.isVisible());
  await page.waitForTimeout(700); // aguarda animações de entrada
  await page.screenshot({ path: path.join(out, 'menu-mobile-390.png') });
  await page.keyboard.press('Escape');
  check('Menu mobile', 'Esc fecha', !(await menu.isVisible()));
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await menu.getByRole('link', { name: /Galeria/ }).click();
  // rolagem suave longa (~8000px no mobile): aguarda estabilizar
  await page.waitForFunction(() => Math.abs(document.getElementById('galeria').getBoundingClientRect().top - 84) < 50, null, { timeout: 5000 }).catch(() => {});
  const gTop = await page.evaluate(() => document.getElementById('galeria').getBoundingClientRect().top);
  check('Menu mobile', 'Link fecha o menu e rola até a seção', !(await menu.isVisible()) && Math.abs(gTop - 84) < 50, `top=${Math.round(gTop)}`);
  await scrollTo(page, '#catalogo');
  await page.locator('#catalogo').getByRole('button', { name: /Adicionar\s*PPF FRONTAL$/ }).click();
  const bar = page.getByRole('link', { name: /Revisar solicitação · 1 serviço/ });
  check('Mobile', 'Barra fixa "Revisar solicitação" aparece após seleção', await bar.isVisible());
  await page.waitForTimeout(700); // aguarda animações de entrada
  await page.screenshot({ path: path.join(out, 'catalogo-selecao-390.png') });
  await bar.click();
  await page.waitForTimeout(1200);
  check('Mobile', 'Barra leva à solicitação e se oculta', !(await bar.isVisible()));
  await page.waitForTimeout(700); // aguarda animações de entrada
  await page.screenshot({ path: path.join(out, 'solicitacao-390.png') });
  await ctx.close();
}
{
  const { ctx, page } = await newPage(1280, 800);
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check('Teclado', 'Primeiro Tab foca "Pular para o conteúdo"', firstFocus === 'Pular para o conteúdo', firstFocus);
  let reached = false;
  for (let i = 0; i < 40 && !reached; i++) {
    await page.keyboard.press('Tab');
    reached = await page.evaluate(() => document.activeElement?.textContent?.trim().startsWith('Montar orçamento'));
  }
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  check('Teclado', 'CTA principal alcançável por Tab com foco visível', reached && outline !== 'none', outline);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1200);
  const t = await page.evaluate(() => document.getElementById('catalogo').getBoundingClientRect().top);
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

await browser.close();
const passed = results.filter((r) => r.ok).length;
await writeFile(path.join(out, 'resultados-qa.json'), JSON.stringify({ url: URL, executadoEm: new Date().toISOString(), aprovados: passed, total: results.length, resultados: results }, null, 2));
console.log(`\n${passed}/${results.length} verificações aprovadas`);
process.exit(passed === results.length ? 0 : 1);
