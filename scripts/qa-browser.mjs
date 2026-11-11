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
  const total = cfg.totalItens;
  check('Catálogo', `${total} itens exibidos`, (await count()) === total);
  await cat.getByRole('searchbox').fill(cfg.busca.termo);
  check('Catálogo', `Busca "${cfg.busca.termo}" → ${cfg.busca.esperado} itens`, (await count()) === cfg.busca.esperado);
  if (cfg.buscaSemAcento) {
    await cat.getByRole('searchbox').fill(cfg.buscaSemAcento.termo);
    check('Catálogo', `Busca sem acento "${cfg.buscaSemAcento.termo}" → ${cfg.buscaSemAcento.esperado}`, (await count()) === cfg.buscaSemAcento.esperado);
  }
  await cat.getByRole('button', { name: 'Limpar busca' }).click();
  await cat.getByRole('button', { name: new RegExp('^' + esc(cfg.filtroCategoria.rotulo)) }).click();
  check('Catálogo', `Filtro "${cfg.filtroCategoria.rotulo}" → ${cfg.filtroCategoria.esperado} itens`, (await count()) === cfg.filtroCategoria.esperado);
  if (cfg.maiorValorPrimeiro) {
    await cat.locator('select').selectOption('price-desc');
    const first = await cat.locator('li h3').first().textContent();
    check('Catálogo', `Ordenar por maior valor → ${cfg.maiorValorPrimeiro} primeiro`, first === cfg.maiorValorPrimeiro, first);
  }
  await cat.getByRole('button', { name: 'Limpar filtros' }).first().click();
  check('Catálogo', `"Limpar filtros" restaura ${total} itens`, (await count()) === total);
  if (cfg.itemAPartirDe) {
    const t = await cat.locator('li', { hasText: cfg.itemAPartirDe.nome }).first().innerText();
    check('Catálogo', `${cfg.itemAPartirDe.nome} exibe "A partir de ${cfg.itemAPartirDe.valor}"`, new RegExp('A PARTIR DE\\s*' + esc(cfg.itemAPartirDe.valor), 'i').test(t));
  }

  // Card de serviço → catálogo filtrado
  await scrollTo(page, '#servicos');
  await page.locator('#servicos button', { hasText: cfg.cardServico.rotulo }).first().click();
  await page.waitForTimeout(1200);
  const pressed = await cat.getByRole('button', { name: new RegExp('^' + esc(cfg.cardServico.rotulo)) }).getAttribute('aria-pressed');
  check('Serviços', `Card "${cfg.cardServico.rotulo}" abre o catálogo filtrado`, pressed === 'true' && (await count()) === cfg.cardServico.esperado);
  await cat.getByRole('button', { name: /^Todos/ }).click();

  // Ficha de detalhes
  await cat.getByRole('button', { name: `Detalhes de ${cfg.detalhes.item}` }).click();
  const det = page.getByRole('dialog', { name: cfg.detalhes.item });
  const detText = await det.innerText();
  check('Catálogo', '"Detalhes" abre a ficha com preço e aviso de data', detText.includes(cfg.detalhes.preco) && detText.includes(cfg.dataObservacao));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, 'ficha-servico-1440.png') });
  await det.getByRole('button', { name: 'Adicionar à solicitação' }).click();
  check('Catálogo', 'Ficha mostra o texto original do catálogo', detText.includes(cfg.detalhes.textoOriginal));
  check('Catálogo', 'Ficha permite selecionar o serviço', (await det.getByRole('button', { name: 'Selecionado para a solicitação' }).count()) === 1);
  await det.getByRole('button', { name: 'Selecionado para a solicitação' }).click();
  await page.keyboard.press('Escape');

  // Seleção
  for (const nome of cfg.selecionar) await cat.getByRole('button', { name: new RegExp('Adicionar\\s*' + esc(nome) + '$') }).click();
  check('Seleção', '2 serviços marcados', (await cat.locator('button[aria-pressed="true"]', { hasText: 'Selecionado' }).count()) === 2);
  const badge = await page.locator('header a[href="#solicitacao"]').innerText();
  check('Seleção', 'Contador no header = 2', badge.includes('2'), badge.replace(/\s+/g, ' '));
  await cat.getByRole('checkbox', { name: 'Somente selecionados' }).check();
  check('Seleção', '"Somente selecionados" → 2 itens', (await count()) === 2);
  await cat.getByRole('checkbox', { name: 'Somente selecionados' }).uncheck();

  // Veículo + resumo + cópia
  const q = page.locator('#solicitacao');
  await scrollTo(page, '#solicitacao');
  await page.evaluate(() => navigator.clipboard.writeText('—'));
  await q.getByRole('button', { name: /Copiar solicitação/ }).click();
  check('Formulário', 'Sem marca/modelo: pede confirmação antes de copiar', (await q.getByText(/Marca e modelo ajudam/).isVisible()) && (await page.evaluate(() => navigator.clipboard.readText())) === '—');
  await q.getByPlaceholder('Ex.: 2023').fill('1890');
  check('Formulário', 'Ano inválido exibe erro', await q.getByText(/Informe um ano entre 1950/).isVisible());
  await q.getByRole('button', { name: 'Copiar mesmo assim' }).click();
  check('Formulário', 'Ano inválido bloqueia a cópia', (await page.evaluate(() => navigator.clipboard.readText())) === '—');
  await q.getByPlaceholder('Ex.: Porsche').fill('BMW');
  await q.getByPlaceholder('Ex.: 911 Carrera').fill('M3 Competition');
  await q.getByPlaceholder('Ex.: 2023').fill('20a24');
  await q.getByPlaceholder('Ex.: Preto').fill('Azul');
  const year = await q.getByPlaceholder('Ex.: 2023').inputValue();
  check('Formulário', 'Ano aceita só dígitos (máx. 4)', year === '2024', year);
  const msg = await q.locator('#quote-preview').inputValue();
  check('Resumo', 'Mensagem contém serviços, veículo e aviso', cfg.mensagemContem.every((t) => msg.includes(t)) && msg.includes('Veículo: BMW M3 Competition · 2024 · Azul') && msg.includes(cfg.dataObservacao));
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
  const [g1, g2] = cfg.galeria;
  await page.getByRole('button', { name: new RegExp(': ' + esc(g1) + '$') }).click();
  check('Galeria', 'Lightbox abre', await page.getByRole('dialog', { name: g1 }).isVisible());
  await page.keyboard.press('ArrowRight');
  check('Galeria', 'Seta → avança item', await page.getByRole('dialog', { name: g2 }).isVisible());
  if (cfg.galeriaComImagens) {
    const lb = await page.locator('[role=dialog] img').evaluate((i) => ({ ok: i.complete && i.naturalWidth > 0, scale: i.getBoundingClientRect().width / i.naturalWidth }));
    check('Galeria', 'Imagem ampliada carregada sem ampliar mais que 1,5×', lb.ok && lb.scale <= 1.51, `escala=${lb.scale.toFixed(2)}`);
  }
  await page.waitForTimeout(700); // aguarda animações de entrada
  await page.screenshot({ path: path.join(out, 'galeria-lightbox-1440.png') });
  await page.keyboard.press('Escape');

  // Fotografias: toda imagem é aprovada, carregada e, se ilustrativa, sinalizada
  await scrollThrough(page);
  const ph = await page.evaluate(() => [...document.querySelectorAll('main img')].map((i) => {
    const w = i.closest('[data-photo-status]');
    return { src: i.currentSrc.split('/').pop(), ok: i.complete && i.naturalWidth > 0, aprovada: w?.getAttribute('data-photo-status') === 'aprovada', ilustrativa: w?.getAttribute('data-photo-illustrative') === 'sim', escala: +(i.getBoundingClientRect().width / i.naturalWidth).toFixed(2) };
  }));
  check('Fotografias', `${ph.length} imagens carregadas e aprovadas`, ph.every((p) => p.ok && p.aprovada), ph.filter((p) => !p.ok || !p.aprovada).map((p) => p.src).join(', '));
  const pend = await page.locator('[data-photo-status="pendente"]').count();
  check('Fotografias', 'Espaços sem foto aprovada mostram placeholder identificado (sem imagem falsa)', ph.length + pend > 0, `aprovadas=${ph.length}, pendentes=${pend}`);
  const selos = (await page.getByText('Imagem ilustrativa', { exact: true }).count()) + (await page.getByText('Ilustrativa', { exact: true }).count());
  check('Fotografias', 'Imagens ilustrativas sinalizadas no site', selos >= cfg.selosIlustrativosMinimo && (!cfg.legendaHeroIA || (await page.evaluate(() => [...document.querySelectorAll('#inicio p')].filter((p) => p.offsetParent && p.textContent.includes('Imagem ilustrativa gerada por IA')).length)) === 1), `selos=${selos}`);
  await writeFile(path.join(out, 'imagens-escala-1440.json'), JSON.stringify(ph, null, 2));

  // Localização
  await scrollTo(page, '#localizacao');
  await page.getByRole('button', { name: 'Copiar endereço' }).click();
  await page.waitForTimeout(200);
  const addr = await page.evaluate(() => navigator.clipboard.readText());
  check('Localização', 'Copiar endereço', addr.includes(cfg.enderecoContem), addr);
  await page.getByRole('button', { name: 'Carregar mapa interativo' }).click();
  const src = await page.locator('#localizacao iframe').getAttribute('src');
  check('Localização', 'Mapa interativo carregado sob demanda', src?.startsWith('https://www.google.com/maps?q='), src);

  // Links externos
  const links = await page.$$eval('a[href^="http"]', (as) => as.map((a) => ({ href: a.href, target: a.target, rel: a.rel, text: a.textContent.trim().slice(0, 40) })));
  const unsafe = links.filter((l) => l.target !== '_blank' || !l.rel.includes('noopener'));
  check('Links', `${links.length} links externos com nova aba + noopener`, unsafe.length === 0, unsafe.map((l) => l.href).join(', '));
  const allowed = cfg.linksPermitidos.map((r) => new RegExp(r));
  const unknown = [...new Set(links.map((l) => l.href))].filter((h) => !allowed.some((r) => r.test(h)));
  check('Links', 'Somente destinos externos previstos em qa.json', unknown.length === 0, unknown.join(', '));
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
  await menu.getByRole('link', { name: new RegExp(esc(cfg.menuMobileLink)) }).click();
  // rolagem suave longa (~8000px no mobile): aguarda estabilizar
  await page.waitForFunction(() => Math.abs(document.getElementById('galeria').getBoundingClientRect().top - 84) < 50, null, { timeout: 5000 }).catch(() => {});
  const gTop = await page.evaluate(() => document.getElementById('galeria').getBoundingClientRect().top);
  check('Menu mobile', 'Link fecha o menu e rola até a seção', !(await menu.isVisible()) && Math.abs(gTop - 84) < 50, `top=${Math.round(gTop)}`);
  await scrollTo(page, '#catalogo');
  await page.locator('#catalogo').getByRole('button', { name: new RegExp('Adicionar\\s*' + esc(cfg.itemMobile) + '$') }).click();
  const bar = page.getByRole('link', { name: /Revisar solicitação · 1 serviço/ });
  await page.waitForTimeout(300);
  // A barra fixa só aparece quando a seção de solicitação ainda não está na tela (catálogos curtos já a mostram).
  const barVisible = await bar.isVisible();
  const solVisible = await page.evaluate(() => document.getElementById('solicitacao').getBoundingClientRect().top < innerHeight * 0.7);
  check('Mobile', 'Após seleção: barra "Revisar solicitação" visível, ou solicitação já na tela', barVisible || solVisible, `barra=${barVisible}, solicitação na tela=${solVisible}`);
  await page.waitForTimeout(700); // aguarda animações de entrada
  await page.screenshot({ path: path.join(out, 'catalogo-selecao-390.png') });
  if (barVisible) {
    await bar.click();
    await page.waitForTimeout(1200);
    check('Mobile', 'Barra leva à solicitação e se oculta', !(await bar.isVisible()));
  }
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
    return { h1: lum(getComputedStyle(h1).color), body: lum(getComputedStyle(document.body).backgroundColor), textoH1: spans.length };
  });
  check('Contraste', `${w}px título do hero claro mesmo com CSS externo agressivo`, c.h1 > 0.7 && c.body < 0.02, JSON.stringify(c));
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
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.getElementById('catalogo').scrollIntoView(); });
  await page.waitForTimeout(400);
  const inp = await page.evaluate(() => new Promise((resolve) => {
    const btn = [...document.querySelectorAll('#catalogo button[aria-pressed]')][0];
    const t0 = performance.now();
    btn.click();
    requestAnimationFrame(() => setTimeout(() => resolve(performance.now() - t0), 0));
  }));
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
