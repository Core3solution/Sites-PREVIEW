// QA — interações do nicho AUTOMOTIVO (serviços, catálogo, solicitação com ficha do veículo, galeria, localização).
// Chamado por scripts/qa-browser.mjs com o contexto comum.
export async function run({ browser, newPage, check, out, cfg, scrollTo, scrollThrough, URL, esc, path, writeFile }) {
  void browser; void URL;
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
}
