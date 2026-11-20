// QA — interações do nicho MODA (coleção, filtros, ordenação, busca, favoritos, visualização rápida,
// sacola de atendimento, “Encontrar meu look”, informações). Chamado por scripts/qa-browser.mjs.
export async function run({ newPage, check, out, cfg, scrollTo, scrollThrough, esc, path, writeFile }) {
  const shot = async (page, name) => {
    await page.waitForTimeout(650);
    await page.screenshot({ path: path.join(out, name) });
  };
  const colecaoTop = (page) => page.evaluate(() => document.getElementById('colecao').getBoundingClientRect().top);

  // ---------- Desktop ----------
  {
    const { ctx, page } = await newPage(1440, 900);
    const col = page.locator('#colecao');
    const cards = () => col.locator('ul[aria-label="Looks da coleção"] > li').count();

    // Navegação
    await page.click('header nav a[href="#colecao"]');
    await page.waitForTimeout(1200);
    check('Navegação', 'Menu "Novidades" rola até a coleção', Math.abs((await colecaoTop(page)) - 84) < 90, `top=${Math.round(await colecaoTop(page))}`);
    check('Coleção', `${cfg.totalLooks} looks exibidos`, (await cards()) === cfg.totalLooks);

    // Trilho de categorias
    await scrollTo(page, '#categorias');
    await page.locator('#categorias').getByRole('button', { name: new RegExp('^' + esc(cfg.categoria.rotulo)) }).click();
    await page.waitForTimeout(900);
    check('Coleção', `Categoria "${cfg.categoria.rotulo}" → ${cfg.categoria.esperado} looks`, (await cards()) === cfg.categoria.esperado);
    check('Coleção', 'Chip do filtro aplicado aparece', (await col.getByRole('button', { name: `Remover filtro: ${cfg.categoria.rotulo}` }).count()) === 1);
    await col.getByRole('button', { name: `Remover filtro: ${cfg.categoria.rotulo}` }).click();
    check('Coleção', 'Remover chip restaura a coleção', (await cards()) === cfg.totalLooks);

    // Ordenação (só faz sentido com preços verificados)
    if (cfg.precoMaximo) {
    await col.locator('select').first().selectOption('maior-preco');
    const first = (await col.locator('ul[aria-label="Looks da coleção"] > li').first().innerText()).split('\n').find((t) => t.includes('Look'));
    check('Coleção', `Maior preço → ${cfg.maisCaroPrimeiro} primeiro`, first?.includes(cfg.maisCaroPrimeiro), first);
    await col.locator('select').first().selectOption('novidades');
    }

    // Painel de filtros
    await col.getByRole('button', { name: /^Filtrar/ }).first().click();
    const fp = page.getByRole('dialog', { name: 'Filtrar looks' });
    check('Filtros', 'Painel de filtros abre', await fp.isVisible());
    if (cfg.precoMaximo) {
    await fp.getByRole('radio', { name: cfg.precoMaximo.rotulo }).or(fp.getByRole('button', { name: new RegExp(esc(cfg.precoMaximo.rotulo)) })).first().click();
    const verBtn = fp.getByRole('button', { name: /^Ver \d+ looks?$/ });
    const verTxt = await verBtn.innerText();
    check('Filtros', `Preço até ${cfg.precoMaximo.rotulo} → ${cfg.precoMaximo.esperado} looks (contagem ao vivo)`, verTxt.includes(String(cfg.precoMaximo.esperado)), verTxt);
    await shot(page, 'filtros-1440.png');
    await verBtn.click();
    check('Filtros', '"Ver N looks" fecha e aplica', !(await fp.isVisible()) && (await cards()) === cfg.precoMaximo.esperado);
    await col.getByRole('button', { name: /Limpar filtros/ }).first().click();
    } else {
      await shot(page, 'filtros-1440.png');
      await page.keyboard.press('Escape');
    }
    check('Filtros', '"Limpar filtros" restaura', (await cards()) === cfg.totalLooks);

    // Favoritos
    await col.getByRole('button', { name: `Adicionar ${cfg.look.rotulo} aos favoritos` }).click();
    check('Favoritos', 'Coração marca o look (aria-pressed)', (await col.getByRole('button', { name: `Remover ${cfg.look.rotulo} dos favoritos` }).getAttribute('aria-pressed')) === 'true');
    await page.locator('header').getByRole('button', { name: /^Favoritos/ }).click();
    const fav = page.getByRole('dialog', { name: 'Favoritos' });
    check('Favoritos', 'Painel lista o favorito', (await fav.innerText()).includes(cfg.look.rotulo.split(' · ')[1]));
    await page.keyboard.press('Escape');
    await page.reload({ waitUntil: 'networkidle' });
    check('Favoritos', 'Favorito persiste após recarregar (navegador)', (await page.locator('#colecao').getByRole('button', { name: `Remover ${cfg.look.rotulo} dos favoritos` }).count()) === 1);

    // Visualização rápida
    await scrollTo(page, '#colecao');
    await page.locator('#colecao').getByRole('button', { name: new RegExp('^' + esc(cfg.look.rotulo)) }).first().click();
    const qv = page.getByRole('dialog').filter({ hasText: cfg.look.pecas });
    await page.waitForTimeout(500);
    const qvText = await qv.innerText();
    check('Quick view', 'Abre com peças, preço e aviso', qvText.includes(cfg.look.pecas) && qvText.includes(cfg.look.preco) && /confirmar/i.test(qvText));
    await qv.getByRole('button', { name: /Adicionar à sacola/ }).first().click();
    check('Quick view', 'Sem tamanho: erro e nada adicionado', (await qv.getByRole('alert').count()) > 0 && !(await page.locator('header').getByRole('button', { name: /^Sua seleção \(/ }).count()));
    await qv.getByRole('button', { name: 'M', exact: true }).click();
    await shot(page, 'quick-view-1440.png');
    await qv.getByRole('button', { name: /Adicionar à sacola/ }).first().click();
    await page.waitForTimeout(300);
    check('Quick view', 'Com tamanho: adiciona à seleção (contador 1)', (await page.locator('header').getByRole('button', { name: 'Sua seleção (1)' }).count()) === 1);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    check('Quick view', 'Seta → próximo look', (await page.getByRole('dialog').innerText()).includes(cfg.look.proximo.split(' · ')[1]));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    check('Acessibilidade', 'Esc fecha a visualização rápida', (await page.getByRole('dialog').count()) === 0);

    // Encontrar meu look
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('#inicio').getByRole('button', { name: 'Encontrar meu look' }).click();
    const fd = page.getByRole('dialog', { name: 'Encontrar meu look' });
    for (const opt of cfg.finder) {
      await fd.getByRole('button', { name: new RegExp('^' + esc(opt)) }).click();
      await page.waitForTimeout(250);
    }
    const fdText = await fd.innerText();
    check('Encontrar meu look', `3 respostas → sugere ${cfg.finderPrimeiro}`, fdText.includes(cfg.finderPrimeiro.split(' · ')[1]), fdText.slice(0, 200).replace(/\s+/g, ' '));
    await shot(page, 'encontrar-meu-look-1440.png');
    await fd.getByRole('button', { name: /^Ver look/ }).first().click();
    await page.waitForTimeout(400);
    check('Encontrar meu look', '"Ver look" abre a visualização rápida', (await page.getByRole('dialog').innerText()).includes(cfg.finderPrimeiro.split(' · ')[1]));
    const qv2 = page.getByRole('dialog');
    await qv2.getByRole('button', { name: 'P', exact: true }).click();
    await qv2.getByRole('button', { name: /Adicionar à sacola/ }).first().click();
    await page.keyboard.press('Escape');

    // Sacola de atendimento
    await page.locator('header').getByRole('button', { name: /^Sua seleção/ }).click();
    const bag = page.getByRole('dialog', { name: /seleção/i });
    const msg = await bag.locator('textarea').inputValue();
    check('Sacola', 'Mensagem com looks, tamanhos e referências', cfg.mensagemContem.every((t) => msg.includes(t)), msg.split('\n').slice(0, 4).join(' | '));
    check('Sacola', 'Não exibe total nem soma', !/total|subtotal/i.test(await bag.innerText()));
    await page.evaluate(() => navigator.clipboard.writeText('—'));
    await bag.getByRole('button', { name: /Copiar solicitação/ }).first().click();
    await page.waitForTimeout(300);
    check('Sacola', 'Copiar: área de transferência recebe a mensagem exata', (await page.evaluate(() => navigator.clipboard.readText())) === msg);
    await shot(page, 'sacola-1440.png');
    await bag.getByRole('button', { name: /Como enviar/ }).click();
    const ce = page.getByRole('dialog', { name: /Canal oficial/ });
    check('Sacola', '"Como enviar" abre modal (sem WhatsApp confirmado)', await ce.isVisible());
    check('Sacola', 'Nenhum link wa.me na página', (await page.locator('a[href*="wa.me"], a[href*="api.whatsapp"]').count()) === 0);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    if (await page.getByRole('dialog').count()) await page.keyboard.press('Escape');

    // Busca
    await page.locator('header').getByRole('button', { name: 'Buscar looks' }).click();
    await page.keyboard.type(cfg.busca.termo);
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1200);
    check('Busca', `"${cfg.busca.termo}" → ${cfg.busca.esperado} look(s) na coleção`, (await cards()) === cfg.busca.esperado);
    await col.getByRole('button', { name: /Limpar busca|Limpar filtros/ }).first().click();

    // Informações (sem políticas inventadas)
    await page.locator('footer').getByRole('button', { name: /^Guia de tamanhos/ }).click();
    const info = page.getByRole('dialog', { name: 'Guia de tamanhos' });
    const infoTxt = await info.innerText();
    check('Informações', 'Guia de tamanhos sinaliza pendência, sem tabela de medidas', /pendente|confirmar/i.test(infoTxt) && !/\d+\s?cm/.test(infoTxt));
    await page.keyboard.press('Escape');

    // Imagens: carregadas e sem ampliação excessiva
    await scrollThrough(page);
    const ph = await page.evaluate(() => [...document.querySelectorAll('main img')].map((i) => ({ src: i.currentSrc.split('/').pop(), ok: i.complete && i.naturalWidth > 0, escala: +(Math.max(i.getBoundingClientRect().width / i.naturalWidth, i.getBoundingClientRect().height / i.naturalHeight)).toFixed(2) })));
    const pend = await page.locator('[data-photo-status="pendente"]').count();
    check('Imagens', `${ph.length} imagens carregadas (${pend} espaços pendentes identificados)`, ph.length + pend > 0 && ph.every((p) => p.ok), ph.filter((p) => !p.ok).map((p) => p.src).join(', '));
    const big = ph.filter((p) => p.escala > 1.7);
    check('Imagens', 'Nenhuma imagem ampliada mais de 1,7× (desktop)', big.length === 0, big.map((p) => `${p.src}:${p.escala}`).join(', '));
    await writeFile(path.join(out, 'imagens-escala-1440.json'), JSON.stringify(ph, null, 2));

    // Links e botões
    const links = await page.$$eval('a[href^="http"]', (as) => as.map((a) => ({ href: a.href, target: a.target, rel: a.rel })));
    check('Links', `${links.length} links externos seguros e previstos`, links.every((l) => l.target === '_blank' && l.rel.includes('noopener') && cfg.linksPermitidos.some((r) => new RegExp(r).test(l.href))));
    const anchors = await page.$$eval('a[href^="#"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
    const missing = await page.evaluate((list) => list.filter((h) => h !== '#' && !document.getElementById(h.slice(1))), anchors);
    check('Links', `${anchors.length} âncoras internas válidas`, missing.length === 0, missing.join(', '));
    const reactless = await page.$$eval('button', (bs) => bs.filter((b) => b.offsetParent && !Object.keys(b).some((k) => k.startsWith('__reactProps') && b[k].onClick) && b.type !== 'submit').map((b) => b.textContent.trim()));
    check('CTA', 'Todos os botões visíveis possuem ação', reactless.length === 0, reactless.join(', '));

    await ctx.close();
  }

  // ---------- Movimento (página nova, sem estado de painéis anteriores) ----------
  {
    const { ctx, page } = await newPage(1440, 900);
      // Parallax
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(600);
    const p = await page.evaluate(() => parseFloat(getComputedStyle(document.getElementById('inicio')).getPropertyValue('--p')));
    check('Movimento', 'Profundidade do hero responde ao scroll', p > 0.03, `--p=${p}`);
    await ctx.close();
  }

  // ---------- Celular ----------
  {
    const { ctx, page } = await newPage(390, 844, { dpr: 2, touch: true, mobile: true });
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    const menu = page.getByRole('dialog', { name: 'Menu' });
    check('Menu mobile', 'Abre', await menu.isVisible());
    await shot(page, 'menu-mobile-390.png');
    await menu.getByRole('link', { name: /Novidades/ }).click();
    await page.waitForFunction(() => Math.abs(document.getElementById('colecao').getBoundingClientRect().top - 72) < 90, null, { timeout: 5000 }).catch(() => {});
    check('Menu mobile', 'Link fecha o menu e rola até a coleção', !(await menu.isVisible()) && Math.abs((await colecaoTop(page)) - 72) < 90, `top=${Math.round(await colecaoTop(page))}`);
    const grid = await page.evaluate(() => getComputedStyle(document.querySelector('#colecao ul[aria-label="Looks da coleção"]')).gridTemplateColumns.split(' ').length);
    check('Mobile', 'Grade com 2 colunas', grid === 2, `colunas=${grid}`);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(600);
    await shot(page, 'colecao-390.png');
    await page.locator('#colecao').getByRole('button', { name: new RegExp('^' + esc(cfg.look.rotulo)) }).first().click();
    await page.waitForTimeout(600);
    const add = page.getByRole('dialog').getByRole('button', { name: /Adicionar à sacola/ }).first();
    const box = await add.boundingBox();
    check('Mobile', 'Visualização rápida com "Adicionar à sacola" visível na tela', !!box && box.y + box.height <= 844 && box.y >= 0, JSON.stringify(box));
    await shot(page, 'quick-view-390.png');
    await ctx.close();
  }
}
