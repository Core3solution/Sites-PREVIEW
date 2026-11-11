# Relatório de entrega — Company Auto Spa (demonstração conceitual CORE 3)

**Data:** 11/11/2026 · **Branch:** `claude/company-auto-spa-website-4vdyho`

> **STATUS: VERSÃO PRELIMINAR — NÃO FINALIZADA.**
> Aguardando os documentos do briefing, fotografias autorizadas e o logotipo oficial. Não foi publicada.
> Demonstração conceitual CORE 3 — não é o site oficial da Company Auto SPA.

---

## 1. Ajuste de direcionamento (rodada 2)

Instruções recebidas e aplicadas:

| Instrução | O que foi feito |
|---|---|
| Interromper ilustrações automotivas artificiais | O pipeline WebGL (`scripts/render-visuals.mjs`, shader, cenas) e as 16 imagens geradas foram **removidos**. O site não exibe nenhuma imagem (`<img>`) até haver fotografia aprovada. Há verificação automática disso. |
| WebGL não obrigatório; usar React, CSS, parallax e profundidade | Hero sem foto: tipografia, brilho em CSS, perspectiva discreta e pilha de vidro com inclinação 3D. Parallax e revelação no scroll em CSS e React. Nenhuma dependência de WebGL. |
| Preservar a evolução para 3D | O componente `Photo` e o fundo do hero são pontos de extensão. Um módulo 3D pode entrar como nova variante sem alterar os dados. |
| Placeholders identificados para fotos | Novo sistema de **espaços de foto** (`PhotoSlot`): 17 espaços com direção de arte, proporção e largura mínima, rotulados “Fotografia pendente”. A galeria abre a especificação de cada espaço. |
| Pacote com 18 arquivos; faltam os docs | Confirmado. Ver seção 2. As instruções desses documentos **não foram consideradas revisadas**. |
| Catálogo em JSON | A transcrição dos prints segue como **provisória** e está marcada em `catalog.ts`. Será substituída ou confrontada com o JSON quando ele chegar. |
| Pesquisar presença digital | Nova busca feita. Nenhum canal além do Instagram foi encontrado. Detalhes em `docs/RELATORIO_FONTES.md`. |

---

## 1b. Rodada 3: identidade do Instagram e contraste

Pedido: usar mais a identidade do Instagram @company.autospa e corrigir cores que se confundiam com o fundo preto.

| Problema | Correção |
|---|---|
| 13 textos abaixo do contraste AA, medidos com axe-core: numeração do catálogo, linhas de fonte, nota do logo | Novo token `subtle` (#A09D95) com contraste ≥ 6:1. Todos os cinzas translúcidos foram trocados por tokens. **0 violações** nas cinco larguras. |
| Cards, bordas, campos e placeholders sumindo no preto | Superfícies mais claras (#151515 e #1D1D1D), bordas #363636, campos com borda visível, placeholders com base mais clara e ícone amarelo |
| Pouca identidade da marca | Títulos em sans condensada, pesada e em caixa alta, como o “COMPANY” do emblema; wordmark em amarelo; faixa amarela com bordas quadriculadas (piso e bandeira do estúdio) e estrelas como separador; CTA final em bloco amarelo com texto preto; nota 4,9 em amarelo; botões fantasma com borda amarela no hover |
| “PERSONALIZAÇÃO” cortado no celular e vazando da caixa no desktop | Escala do título recalculada |
| Textos da galeria estourando no tablet e selo quebrando no celular | Galeria em 2 colunas até 1024 px e selo curto (“Pendente”) no celular |

Duas verificações novas no QA: **contraste AA em todos os textos (axe-core)** e **nenhum texto cortado**. Resultado: **70/70**.

---

## 2. Materiais do pacote (18 arquivos no MANIFESTO)

| Arquivo | Recebido? |
|---|---|
| `CLAUDE.md` | ✅ (hash confere) |
| `MANIFESTO.txt` | ✅ |
| `anexos/01` Google, `02`/`03` WhatsApp, `04` referência Car Flex | ✅ (hashes conferem) |
| `anexos/05`/`06` Instagram (fora do manifesto, enviados depois) | ✅ |
| `00_LEIA_PRIMEIRO.md` | ❌ |
| `01_COMANDO_INICIAL.md` | ❌ (o conteúdo parece ter vindo como mensagem, mas o arquivo não chegou) |
| `02_PROMPT_REVISAO_FINAL.md` | ❌ (idem) |
| `.claude/agents/revisor-visual.md` | ❌ |
| `docs/01_BRIEFING_PRODUTO.md` | ❌ |
| `docs/02_DIRECAO_ARTE_E_3D.md` | ❌ |
| `docs/03_CATALOGO_E_PRECOS.md` | ❌ |
| `docs/04_REFERENCIAS_E_PENDENCIAS.md` | ❌ |
| `docs/05_CRITERIOS_DE_ACEITE.md` | ❌ |
| `docs/06_PLANO_ENTREGA_E_RELATORIO.md` | ❌ |
| `docs/CATALOGO_FONTE_10_SERVICOS.json` | ❌ |
| `docs/RELATORIO_FONTES_MODELO.md` | ❌ |

**Ao receber os arquivos**, os próximos passos são:
1. Validar os hashes contra o MANIFESTO.
2. Ler todos os documentos.
3. Importar o JSON como fonte do catálogo e conferir contra os prints.
4. Aplicar a direção de arte e 3D de `02`.
5. Testar contra os critérios de `05`.
6. Gerar o relatório no formato de `06`.

---

## 3. Arquitetura atual

- **Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Lucide. Fontes auto-hospedadas (Archivo variável e
  Inter, OFL). Sem backend, sem API paga e sem WebGL.
- **Template × cliente:** `src/core/` é genérico; `src/clients/company-auto-spa/` contém `index.ts` (textos e
  marca), `catalog.ts` (transcrição provisória), `photos.ts` (espaços de foto) e `sources.ts` (fontes). Ver `docs/REUTILIZACAO_TEMPLATE.md`.
- **Estado:** seleção, veículo e filtro ficam só em memória. Nada é persistido ou enviado.
- **Fotografias:** `src/core/components/Photo.tsx` mostra a foto aprovada (com `srcSet`) ou o placeholder
  identificado. Uma foto aprovada exige `credit` (autoria ou autorização), e isso é testado.

---

## 4. Como abrir (comandos executados nesta sessão)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview   # http://localhost:4173 (QA executado contra este servidor)
```

---

## 5. Testes executados (resultados reais desta rodada)

| Verificação | Comando | Resultado |
|---|---|---|
| TypeScript | `npm run typecheck` | Sem erros |
| Unitários e componente | `npm test` | **32/32 aprovados** |
| Build | `npm run build` | Aprovado |
| Navegador (Chromium em 1440/1280/768/390/360) | `npm run qa` | **70/70 aprovados** (`evidencias/resultados-qa.json`) |

A cobertura é a mesma da rodada anterior: dados do catálogo, responsividade, navegação, menu mobile, catálogo,
seleção, cópia conferida na área de transferência, modal sem WhatsApp, galeria, localização, links, teclado,
contraste e reduced-motion. Há um teste novo: **nenhuma imagem exibida sem fotografia aprovada** e todos os placeholders identificados.

**Não executado:** abertura real dos destinos externos (rede bloqueada), Safari/Firefox, aparelhos físicos e Lighthouse.

Capturas atualizadas em `evidencias/` (hero nas 5 larguras, páginas inteiras, fluxo de solicitação, modal,
especificação da galeria e telas mobile).

---

## 6. Problemas corrigidos

Rodada 1: 12 correções de layout e acessibilidade (rolagem horizontal no mobile, container dos serviços, mosaico
da galeria, textos menores que 10,5 px, rolagem do menu mobile etc.). Continuam valendo.

Rodada 2:
- Removidas as ilustrações procedurais, que não atendiam ao padrão fotorrealista pedido.
- Removido o `preload` da imagem antiga no `index.html` (gerava aviso no console).
- Removido o selo “Ilustração”. Os espaços agora dizem o que deve ser fotografado.
- Marcas de enquadramento ajustadas para não colidir com os selos dos cards e da galeria.
- Removida a dependência `sharp`, que não é mais necessária.

---

## 7. Fontes e licenças

| Material | Licença / uso |
|---|---|
| Dados da empresa | Capturas `anexos/01–06` e busca pública (`docs/RELATORIO_FONTES.md`) |
| Fotografias | **Nenhuma em uso.** Todos os espaços estão pendentes. |
| Inter, Archivo (Fontsource) | SIL OFL 1.1 |
| lucide-react | ISC |
| React, Vite, Tailwind CSS | MIT |

Custo adicional: zero.

---

## 8. Pendências

| Pendência | Onde entra |
|---|---|
| **Documentos do pacote** (seção 2), em especial `CATALOGO_FONTE_10_SERVICOS.json` e `05_CRITERIOS_DE_ACEITE.md` | `catalog.ts`, testes e revisão |
| **Fotografias autorizadas** em alta resolução para os 17 espaços (`photos.ts`, cada um com direção de arte) | `photos.ts` |
| **Logotipo oficial** (SVG ou PNG em alta) | `brand.logo` |
| **Cores oficiais** (hoje `#E4BA42`, estimado do emblema em miniatura) | `brand.theme` |
| **WhatsApp comercial confirmado** | `contact.whatsapp` |
| Vigência, condições e descrições completas dos serviços; significado de “GSWF” | `catalog.ts` |
| Confirmação do site atual `companyautospa.com.br` (inacessível no ambiente) | `sources.ts` |
| Horários de funcionamento e texto institucional oficial | `location`, `about` |

---

## 9. Próximos passos (após receber os materiais)

1. Ler os 18 arquivos e reconciliar instruções e critérios.
2. Importar o JSON do catálogo e conferir item a item contra os prints.
3. Inserir fotografias autorizadas: hero com parallax da imagem inteira e cards com recorte real.
4. Aplicar a direção de arte e 3D de `docs/02` (avaliar 3D somente se houver material de qualidade).
5. Rodar a bateria de testes e a revisão visual em 360/390/768/1280/1440 antes de qualquer entrega final.
