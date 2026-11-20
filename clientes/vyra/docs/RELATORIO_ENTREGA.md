# Relatório de entrega — VYRA (nicho moda fitness)

> **STATUS:** prévia construída e testada, pronta para avaliação comercial interna. Demonstração conceitual CORE 3 —
> não é o site oficial da VYRA. Não publicada.

## 1. O que foi feito

1. **Template multi-nicho.** O código automotivo foi movido sem perdas para `src/niches/automotivo/`.
   - O núcleo comum (`src/core/`) ficou com os tipos base, `Photo`, `Dialog`, hooks, tema, toast e utilitários.
   - Novos recursos do núcleo: tema claro ou escuro (`theme.scheme`) e fontes por cliente (`brand.fonts`).
   - `src/niches/index.ts` escolhe a página pelo `niche` do cliente.
   - Company Auto SPA: **81/81** no QA e testes intactos.
2. **Pacote do nicho moda** (`src/niches/moda/`): contrato em `types.ts`, lógica pura (`lib/` com filtros, sugestão
   de looks e mensagem), estado (`state/shop.tsx`), sistema visual (`moda.css`, classes `m-` em `@layer components`),
   seções e componentes.
3. **Cliente VYRA** (`src/clients/vyra/`):
   - 15 looks transcritos do layout de referência, com nome, preço e cores;
   - imagens recortadas dos painéis em tamanho nativo;
   - paleta amostrada do layout (off-white `#F4F4F0`, grafite `#181C18`, limão `#D8F05C`);
   - tipografia Outfit + Inter.
4. **Cliente-modelo de moda** (`_modelo-moda`) e `npm run novo-cliente -- <pasta> "Nome" --nicho moda`.
5. **QA por nicho:** `scripts/qa/automotivo.mjs` e `scripts/qa/moda.mjs`, sobre o QA comum de responsividade,
   contraste, CSS externo e desempenho.

### Orquestração

| Frente | Executor | Entrega |
|---|---|---|
| Pesquisa do nicho (UX, checagem do nome, pontos legais) | agente leve, em segundo plano | `docs/RELATORIO_FONTES.md` |
| Arquitetura, contrato, dados, estado, CSS, integração e revisão | agente principal | núcleo, tipos, VYRA, header, hero, categorias, editorial, rodapé |
| Coleção, card, filtros e visualização rápida (UX mais complexa) | agente de alta capacidade | 4 componentes |
| “Encontrar meu look”, informações, favoritos, busca, destaque editorial | agente leve | 5 componentes |
| Sacola de atendimento + testes de lógica e dados | agente leve | 1 componente + 2 arquivos de teste |

## 2. Funcionalidades

**Navegação e descoberta**
- Faixa superior com o aviso de demonstração.
- Header com busca, favoritos (contador) e seleção (contador).
- Menu do celular em folha inferior.
- Hero em painel escuro com corte diagonal, duas fotos e profundidade no scroll.
- Trilho de categorias com contagem.

**Coleção**
- 15 looks em 3 colunas no desktop e 2 no celular.
- Filtros por categoria, paleta, comprimento, preço máximo e “somente favoritos”, com contagem ao vivo e chips removíveis.
- Ordenação, busca tolerante a acentos e estado vazio.
- No celular, barra fixa “Filtrar · Ordenar” enquanto a grade está na tela.

**Visualização rápida**
- Peças do look e cores com nome.
- Tamanhos em botões visíveis; sem tamanho, aparece um erro e o look não é adicionado.
- Link para o guia de tamanhos.
- “Complete o look”.
- Anterior e próximo, inclusive pelas setas do teclado.

**Encontrar meu look:** 3 perguntas (momento, paleta, comprimento) e 3 sugestões explicadas.

**Seleção (sacola de atendimento)**
- Tamanho e quantidade por look, sem total.
- Mensagem revisável e “Copiar solicitação”, conferida na área de transferência.
- “Como enviar” abre um modal, porque não há canal confirmado.

**Outros**
- Favoritos salvos no navegador, com painel próprio.
- Destaque editorial “Studio to street”.
- Faixa “Do studio para o seu dia.”.
- Informações (tamanhos, atendimento, entregas) sinalizadas como pendentes, sem políticas inventadas.
- Rodapé com aviso e fontes.

## 3. Testes executados (resultados reais)

| Verificação | Comando | Resultado |
|---|---|---|
| Tipos | `npm run typecheck` | sem erros |
| Testes (todos os clientes e nichos) | `npm test` | **108/108** (com 2 arquivos novos: `moda.lib` e `vyra`) |
| Build | `VITE_CLIENT=vyra npm run build` | aprovado |
| Navegador | `QA_CLIENT=vyra npm run qa` | **72/72** |
| Sem regressão | `QA_CLIENT=company-auto-spa` / `_modelo` / `_modelo-moda` | 81/81 · 76/76 · 69/69 |
| Novo cliente de moda | `npm run novo-cliente -- teste-moda … --nicho moda` + tipos, testes e build | aprovado (cliente de teste removido) |

O QA da VYRA cobre:
- 5 larguras sem rolagem horizontal e sem texto cortado;
- contraste AA com axe-core;
- contraste do título com o CSS externo da prévia;
- navegação, trilho de categorias, filtros, ordenação, favoritos (inclusive persistência após recarregar), busca e visualização rápida;
- “Encontrar meu look”, cópia exata da sacola, modal “Como enviar” e ausência de `wa.me`;
- guia de tamanhos sem medidas inventadas;
- imagens carregadas e não ampliadas mais de 1,7×;
- botões com ação, teclado, movimento e reduced-motion.

**Desempenho em laboratório** (`evidencias/desempenho-laboratorio.json`):
- celular com 4G simulado: LCP ≈ 1,19 s, CLS 0, interação ≈ 84 ms;
- desktop: LCP ≈ 0,23 s, CLS 0,005.

São medições de laboratório, não de campo.

**Revisão visual** das capturas. Correções feitas:
- hambúrguer aparecendo no desktop;
- âncoras parando 80 px abaixo;
- faixa visível em volta das fotos dos cards (agora com fundo amostrado e máscara de borda);
- destaque editorial apertado no tablet (agora carrossel até 1024 px);
- barra fixa do celular sobrando depois da grade;
- carrossel sem recuo inicial;
- títulos de modais herdando a tipografia automotiva;
- avisos (toast) atrás dos modais.

**Não executado:** Safari/iOS e Android físicos, Lighthouse, e conferência com a marca.

## 4. Capturas (`evidencias/`)

- Hero nas 5 larguras e páginas inteiras.
- Filtros, visualização rápida (desktop e celular), “Encontrar meu look”, sacola, coleção no celular e menu do celular.

## 5. Pendências

Detalhadas em `docs/BRIEFING.md`:
- logo oficial;
- fotos em alta (hoje ~390 px por look, que ficam suaves no hero e no editorial);
- autoria e direitos das imagens;
- tabela de medidas, canal de atendimento e políticas;
- nomes oficiais das cores;
- checagem no INPI e do domínio.

O prompt para gerar os looks em alta resolução está em `docs/PROMPT_IMAGENS.md`.
