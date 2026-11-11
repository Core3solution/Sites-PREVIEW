# Relatório de entrega — Company Auto Spa (demonstração conceitual CORE 3)

**Data:** 11/11/2026 · **Branch:** `claude/company-auto-spa-website-4vdyho`
**Status:** site navegável, build de produção aprovado, 30/30 testes unitários e de componente, 59/59 verificações em navegador real.

> Demonstração conceitual CORE 3 — não é o site oficial da Company Auto SPA. Não foi publicada em domínio público.

---

## 1. Auditoria inicial

### Materiais recebidos e conferidos

| Item | Situação |
|---|---|
| `CLAUDE.md` | Recebido. Hash confere com `MANIFESTO.txt`. |
| `anexos/01` Google, `02`/`03` WhatsApp, `04` referência Car Flex | Recebidos. Hashes conferem com o manifesto. Examinados visualmente. |
| `anexos/05`/`06` Instagram @company.autospa | Recebidos depois, por mensagem. Examinados. |
| `00_LEIA_PRIMEIRO.md`, `01_COMANDO_INICIAL.md`, `02_PROMPT_REVISAO_FINAL.md`, `docs/01…06*.md`, `docs/CATALOGO_FONTE_10_SERVICOS.json`, `docs/RELATORIO_FONTES_MODELO.md`, `.claude/agents/revisor-visual.md` | **Não recebidos** (constam no manifesto, mas não estavam no repositório nem nos anexos). O trabalho seguiu `CLAUDE.md` e as instruções das mensagens. O catálogo foi transcrito diretamente das capturas. |

### Fatos confirmados (com fonte)

- Endereço: Rua Pinheiro Machado, 34, Santa Paula, São Caetano do Sul/SP (Google e Instagram).
- Google: **4,9 ★, 55 avaliações**, categoria “Serviço de envelopamento de veículos” (captura de 11/11/2026).
- Instagram: **@company.autospa**, “Company Auto Spa | ABC”, bio com PPF / Envelopamento / Proteção e link `beacons.ai/companyautospa`.
- Catálogo do WhatsApp: **10 serviços** com valores (tabela em `docs/RELATORIO_FONTES.md`).
- Identidade observada: emblema preto/amarelo-ouro/branco (só em miniatura).

### Pendências (não confirmadas)

Ver a seção 9.

---

## 2. Arquitetura

- **Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Lucide. Fontes auto-hospedadas via Fontsource
  (Archivo variável com eixo de largura e Inter). Sem backend, sem API paga e sem bibliotecas 3D.
- **Template × cliente:** `src/core/` é genérico; `src/clients/company-auto-spa/` contém marca, paleta, textos,
  catálogo, links e fontes. A troca de empresa é feita em `src/site.config.ts` (ver `docs/REUTILIZACAO_TEMPLATE.md`).
- **Estado:** seleção, veículo e filtro de categoria ficam só em memória (`QuoteProvider`). Nada é persistido ou enviado.
- **Tema:** tokens da marca injetados como variáveis CSS (`applyTheme`) e consumidos pelo Tailwind (`@theme inline`).
- **Imagens:** ilustrações procedurais originais geradas por `scripts/render-visuals.mjs` (shader WebGL2 em
  Chromium headless, supersampling 2×, WebP em duas larguras, placeholder desfocado). Total: cerca de 0,8 MB.

### Código criado

```
index.html, package.json, vite.config.ts, tsconfig*.json, .gitignore, README.md
src/main.tsx, src/App.tsx, src/index.css, src/site.config.ts
src/core/types.ts                         contrato SiteConfig
src/core/components/                      Wordmark, Media, SmartLink, SectionHeading, Dialog
src/core/sections/                        Header(+DemoBar, menu mobile), Hero, TrustStrip, Services, Catalog,
                                          Quote, Gallery, About, Reputation, Location, Closing(FinalCta, Footer, MobileQuoteBar)
src/core/hooks/                           motion.ts (reduced-motion, parallax, reveal, tilt), dom.ts (scroll-spy, diálogo)
src/core/state/                           site, quote, toast
src/core/lib/                             format, catalog, quote, clipboard, links, theme, media
src/core/generated/visuals.manifest.json  registro das imagens geradas
src/clients/company-auto-spa/             index.ts, catalog.ts, sources.ts
scripts/render-visuals.mjs, scripts/visuals/{shader.frag,scenes.mjs}
scripts/qa-browser.mjs                    QA em navegador + capturas
tests/                                    catalog-data, lib, app (Vitest + Testing Library)
public/favicon.svg, public/media/visuals/*.webp
docs/RELATORIO_ENTREGA.md, docs/RELATORIO_FONTES.md, docs/REUTILIZACAO_TEMPLATE.md
anexos/01…06, evidencias/
```

---

## 3. Como abrir (comandos executados nesta sessão)

```bash
npm install
npm run dev        # http://localhost:5173 (verificado: HTML e módulos servidos com status 200)
npm run build      # gera dist/ (verificado)
npm run preview    # http://localhost:4173 (verificado; QA executado contra este servidor)
```

Abrir `dist/index.html` direto do disco não funciona, pois os módulos ES exigem um servidor. Use `npm run preview`
ou qualquer servidor estático apontando para `dist/`.

---

## 4. Testes realizados e resultados reais

| Verificação | Comando | Resultado |
|---|---|---|
| TypeScript | `npm run typecheck` | Sem erros |
| Unitários e componente | `npm test` | **30/30 aprovados** (3 arquivos) |
| Build de produção | `npm run build` | Aprovado. JS 308 kB (94 kB gzip), CSS 65 kB (12 kB gzip) |
| Navegador real (Chromium 1440/1280/768/390/360) | `npm run qa` | **59/59 aprovados** (`evidencias/resultados-qa.json`) |

O que os testes cobrem:

- **Dados:** 10 itens na ordem da fonte; nomes e valores exatos; PPF FULL ≠ PPF FULL GSWF; teto “A partir de
  R$ 1.500,00”; todo preço com fonte e data; texto exato do aviso de preços; 4,9/55; WhatsApp nulo; nenhuma menção à Car Flex.
- **Responsividade (5 larguras):** sem rolagem horizontal, nenhum texto abaixo de 10,5 px, áreas de toque ≥ 36 px
  no mobile e nenhum erro de JavaScript no console.
- **Navegação:** links do header rolam até a seção certa, scroll-spy marca o item ativo, as 10 âncoras internas
  existem, o menu mobile abre, fecha com Esc e leva à seção ao clicar no link.
- **Catálogo:** busca (inclusive sem acento), filtros por categoria, ordenação, “Somente selecionados”, “Limpar
  filtros”, “Ver trecho do catálogo”; o card de serviço abre o catálogo já filtrado.
- **Solicitação:** seleção múltipla, contador no header, ano aceita só dígitos, mensagem com serviços, veículo e
  aviso. A cópia foi conferida lendo a área de transferência: o texto colado é idêntico ao da revisão. Há aviso
  visual, erro ao copiar sem serviço, “Limpar solicitação”, e o modal “Como enviar” com cópia. Não existe nenhum link `wa.me`.
- **Galeria:** lightbox, navegação por setas, imagem em alta resolução, Esc fecha.
- **Localização:** copiar endereço (área de transferência conferida), mapa do Google carregado só após o clique, Maps e Waze.
- **Links externos:** todos abrem em nova aba com `noopener noreferrer` e apontam só para destinos conhecidos
  (Instagram, beacons.ai, Google, Waze). Lista em `evidencias/links-externos.json`.
- **Botões:** todo `<button>` visível tem ação.
- **Teclado:** “Pular para o conteúdo” é o primeiro foco, o CTA principal é alcançável por Tab com foco visível, e Enter leva ao catálogo.
- **Contraste (WCAG):** texto/fundo 17,8:1; texto secundário 7,0–7,9:1; acento/fundo 10,8:1; texto escuro sobre acento 10,1:1.
- **Movimento:** o parallax do hero responde ao scroll; `prefers-reduced-motion` desativa revelação e parallax.

### Limitações dos testes (não executados)

- Os destinos externos (Instagram, Google, Waze, beacons) **não foram abertos**, porque a rede do ambiente bloqueia
  esses domínios. Foram validados apenas o formato e a segurança dos links. O iframe do Google Maps também não carrega neste ambiente.
- Não houve teste em Safari/iOS, Firefox nem em aparelhos físicos. O mobile foi emulado no Chromium.
- Lighthouse não foi executado.

---

## 5. Capturas (pasta `evidencias/`)

| Arquivo | Conteúdo |
|---|---|
| `hero-1440.png` (2×), `hero-1280.png`, `hero-768.png`, `hero-390.png` (2×), `hero-360.png` | Primeira dobra em cada largura |
| `pagina-inteira-{1440,1280,768,390,360}.jpg` | Página completa |
| `fluxo-solicitacao-1440.png` | Solicitação preenchida após a cópia |
| `modal-como-enviar-1440.png` | Modal sem WhatsApp confirmado |
| `galeria-lightbox-1440.png` | Galeria ampliada |
| `menu-mobile-390.png`, `catalogo-selecao-390.png`, `solicitacao-390.png` | Fluxo mobile |
| `resultados-qa.json`, `links-externos.json` | Resultados brutos |

---

## 6. Revisão crítica e problemas corrigidos

Comparação com a referência de acabamento (Car Flex, só composição) e com o checklist de `CLAUDE.md`.
`docs/05_CRITERIOS_DE_ACEITE.md` não foi recebido.

| # | Problema encontrado | Correção |
|---|---|---|
| 1 | Primeira versão dos visuais: grade densa de tubos, efeito moiré, aspecto de “túnel futurista” | Ambiente de luz refeito com poucas linhas de LED longas, como no teto do estúdio real visto no Instagram, e mais espaço negativo |
| 2 | Gotas d’água pareciam furos escuros | Sombreamento de lente convexa com reflexo e borda |
| 3 | Visual “estúdio” com feixe vertical artificial | Cena substituída por superfície curva |
| 4 | Hero escuro demais, reflexos quase invisíveis | Exposição +55% e reenquadramento |
| 5 | Grid de serviços fora do container no desktop (`sm:container-x` não funciona com classe de componente no Tailwind 4) | `container-x` convertido em `@utility` |
| 6 | Fundo do CTA final empurrava o conteúdo (wrapper `relative` sobrescrevia `absolute`) | `Media` só aplica `relative` quando não há posicionamento |
| 7 | Mosaico da galeria com lacunas e item órfão | Grade fixa 4×3 no desktop e 2 colunas sem lacunas no mobile |
| 8 | **Rolagem horizontal no mobile** (scrollWidth 1038 em 390 px): a linha de chips expandia o grid | `grid-cols-[minmax(0,1fr)]` + `min-w-0` |
| 9 | Faixa de preço quebrando (“R$ 399,0…”) nos cards de serviço | Rodapé do card em coluna até 1180 px |
| 10 | Textos de 8,8–9,9 px (wordmark “AUTO SPA”, selo “Ilustração”) | Mínimo de 10,5 px |
| 11 | No menu mobile, a devolução de foco interrompia a rolagem suave | `focus({ preventScroll: true })` + rolagem após fechar o menu |
| 12 | Link do Waze com travessão no endereço | Usa a mesma consulta do Google Maps |

### Checklist da revisão

- **Identidade:** nenhum nome, logo, foto, texto, dado ou depoimento da Car Flex (há teste automático). O amarelo-ouro
  vem do emblema real da Company, e não da referência. O wordmark é textual e sinalizado como provisório no rodapé.
- **Imagens:** todas são ilustrações geradas por computador, rotuladas “Ilustração” na galeria e com legenda no hero,
  no Sobre e no lightbox. Nenhuma foi atribuída à empresa. As miniaturas dos prints não foram ampliadas para uso no site.
- **Preços:** os 10 valores conferem com os prints. Aparece o aviso “Valores observados no catálogo em 11/11/2026…”
  e cada preço traz “Valor observado em 11/11/2026”. Os valores não são somados e não há checkout, desconto ou parcelamento.
- **Reputação:** só 4,9/55 com fonte e data, e um botão para o perfil público. Nenhum depoimento inventado.
- **3D e movimento:** pilha de vidro com perspectiva no hero, inclinação sutil dos cards (só com mouse), parallax da
  imagem inteira no hero e no Sobre, revelação no scroll e uma varredura de luz única. Nada sequestra o scroll. Há
  fallback para reduced-motion e para aparelhos modestos (`saveData`, memória ≤ 2 GB, ≤ 2 núcleos).

---

## 7. Fontes e licenças dos materiais

| Material | Origem | Licença / uso |
|---|---|---|
| Dados da empresa | Capturas `anexos/01–06` e pesquisa pública | Ver `docs/RELATORIO_FONTES.md` |
| Ilustrações (`public/media/visuals`) | Geradas pela CORE 3 com `scripts/render-visuals.mjs` | Originais deste projeto. Sem fotos de terceiros. |
| Inter, Archivo | Fontsource (auto-hospedadas) | SIL OFL 1.1 |
| Ícones | lucide-react | ISC |
| React, Vite, Tailwind CSS | npm | MIT |
| Referência Car Flex (`anexos/04`) | Fornecida pelo cliente CORE 3 | Só referência interna de composição. Não usada no site. |

Custo adicional: **zero**. Não há serviços pagos nem chaves de API. O mapa do Google é um embed público carregado por clique.

---

## 8. Funcionalidades entregues (todas demonstrativas)

1. Aviso de demonstração no topo e no rodapé, com “Saiba mais” ancorado.
2. Header fixo com scroll-spy, contador da seleção e menu mobile acessível (foco preso, Esc).
3. Hero com parallax, CTAs, nota do Google, endereço e pilha de destaques em vidro com profundidade.
4. Faixa animada das frentes de serviço (pausa no hover, estática em reduced-motion).
5. Seis cards de serviço com contagem de itens e faixa de preço calculadas a partir do catálogo, que abrem o catálogo filtrado.
6. Catálogo com os 10 itens: busca, filtros, ordenação, “somente selecionados”, trecho original da fonte, notas sobre PPF FULL/GSWF e nomes truncados.
7. Solicitação em 3 passos: serviços, veículo (marca/modelo/ano/cor/observações, sem dados pessoais) e revisão, com **Copiar solicitação**, **Como enviar** (modal) e **Limpar**.
8. Barra fixa “Revisar solicitação” no mobile.
9. Galeria em mosaico com lightbox navegável por teclado.
10. Sobre com fatos e fontes; reputação com fonte e data; localização com Maps, Waze, copiar endereço e mapa sob demanda.
11. CTA final, rodapé com fontes dos dados e crédito CORE 3.

---

## 9. Materiais pendentes

| Pendência | Impacto | Onde ajustar |
|---|---|---|
| **Logo oficial** em vetor ou alta resolução | Wordmark textual provisório em uso | `brand.logo` em `src/clients/company-auto-spa/index.ts` |
| **Cores oficiais** (manual da marca) | `#E4BA42` estimado a partir de miniatura | `brand.theme` |
| **Fotografias autorizadas** em alta resolução | Galeria e hero usam ilustrações | Manifesto de mídia (`docs/REUTILIZACAO_TEMPLATE.md`, passo 4) |
| **WhatsApp comercial confirmado** | Botão “Como enviar” abre modal, sem link direto | `contact.whatsapp` |
| Vigência, condições e descrições completas dos 10 serviços | Resumos neutros, com nomes truncados sinalizados | `catalog.ts` |
| Significado de “GSWF” e diferença entre PPF FULL e PPF FULL GSWF | Nota pedindo confirmação | `catalog.ts` |
| Confirmação do site atual (`companyautospa.com.br`) | Não acessível no ambiente | `sources.ts` |
| Data exata das capturas do Instagram | Registrado como “recebidas em 11/11/2026” | `sources.ts` |
| Texto institucional oficial | Usado o texto da visão geral do Google (gerada por IA), com fonte | `about.paragraphs` |
| Horários de funcionamento | Não exibidos | `location.intro` |
| Arquivos do pacote V4 não recebidos (`00_LEIA_PRIMEIRO.md`, `docs/01–06`, JSON do catálogo, agente revisor) | Critérios de aceite formais não conferidos item a item | Reenviar para nova conferência |

---

## 10. Próximas melhorias sugeridas

1. Trocar as ilustrações por fotos autorizadas do estúdio (teto de LED, piso quadriculado, grafite) e usar parallax em camadas com recorte real.
2. Incorporar o logo oficial (SVG) e calibrar a paleta.
3. Ativar o envio direto ao WhatsApp assim que o número for confirmado (já suportado pela configuração).
4. Páginas individuais por serviço, com descrição técnica aprovada pela empresa.
5. Lighthouse e testes em Safari/iOS e Android físicos. Metadados Open Graph quando houver domínio aprovado.
6. Deploy de prévia privada só com aprovação (o projeto não foi publicado).
