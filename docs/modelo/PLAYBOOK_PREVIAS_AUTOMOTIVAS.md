# Playbook CORE 3 — Prévias para o nicho automotivo

Processo-padrão para construir, revisar e entregar prévias comerciais **não oficiais** de empresas de estética
automotiva (PPF, vitrificação, polimento, envelopamento, insulfilm, lavagem e afins). Modelo validado no projeto
Company Auto SPA (`clientes/company-auto-spa/`).

> Uma prévia é uma **demonstração conceitual**. Ela nunca se apresenta como site oficial, não contata a empresa,
> não publica em domínio público e não inventa preços, avaliações, fotos de trabalhos ou condições.

---

## 0. Visão geral

| Etapa | Entrada | Saída | Comando principal |
|---|---|---|---|
| 1. Abertura | Nome da empresa | Estrutura do cliente | `npm run novo-cliente -- <pasta> "Nome"` |
| 2. Auditoria | Capturas, catálogo, Instagram, Google | `BRIEFING.md` e `RELATORIO_FONTES.md` preenchidos | — |
| 3. Dados | Fontes auditadas | `catalog.ts`, `sources.ts`, `index.ts` | `VITE_CLIENT=<pasta> npm run dev` |
| 4. Identidade | Logo, cores, ambiente | `brand.theme`, wordmark, favicon | — |
| 5. Imagens | Prompt por seção | `public/clientes/<pasta>/fotos/*.webp` | `npm run importar-fotos -- <pasta>` |
| 6. Revisão | Site rodando | Correções aplicadas | `npm run qa` + inspeção visual |
| 7. Prévia | Build aprovado | Link privado | `npm run previa -- <pasta>` |
| 8. Entrega | Tudo acima | `RELATORIO_ENTREGA.md` + commit | — |

---

## 1. Abertura do cliente

```bash
npm run novo-cliente -- studio-exemplo "Studio Exemplo Estética Automotiva"
```

O comando cria:

```
src/clients/<pasta>/        index.ts (textos e marca), catalog.ts, photos.ts, sources.ts, qa.json
clientes/<pasta>/           CLAUDE.md (regras do cliente), docs/ (briefing, fontes, prompt, relatório), anexos/, evidencias/
public/clientes/<pasta>/    fotos/ (imagens otimizadas) e, opcionalmente, favicon.svg
tests/clients/<pasta>.test.ts
```

Salve todos os materiais recebidos em `clientes/<pasta>/anexos/`. Se houver manifesto com hashes, confira com `sha256sum`.

## 2. Auditoria (antes de escrever qualquer texto)

1. **Examine visualmente** cada captura: Google, catálogo do WhatsApp, Instagram, fachada. Não basta listar os arquivos.
2. Preencha `clientes/<pasta>/docs/BRIEFING.md`: o que está **confirmado** (com fonte e data) e o que está **pendente**.
3. Pesquisa pública (quando houver acesso): site atual, Instagram, Google. Registre URLs em `RELATORIO_FONTES.md`.
   - **Não confunda empresas de nome parecido.** Confirme pelo endereço.
   - Se um domínio não abrir, registre “não confirmado”. Nunca afirme que a empresa não tem site.
4. Pendências típicas: logo em alta, cores oficiais, fotos autorizadas, WhatsApp confirmado, horários.

## 3. Dados (configuração, nunca nos componentes)

- `catalog.ts`: transcreva **exatamente** nomes, ordem e valores da fonte.
  - Variantes de um mesmo serviço são itens separados (ex.: PPF FULL × PPF FULL GSWF).
  - “A partir de” → `price.kind: 'from'`. Sem valor verificado → `'on-request'`.
  - Nomes e descrições truncados: registre em `sourceName` e `sourceExcerpt`. O `summary` é neutro e não inventa nada.
- `sources.ts`: toda informação factual aponta para uma fonte com data.
- `index.ts`: textos das seções, endereço, Instagram, reputação (`null` sem dado verificado), `whatsapp: null`
  até haver número oficial confirmado.
- `tests/clients/<pasta>.test.ts`: depois da conferência, trave quantidade, nomes e valores, como em
  `company-auto-spa.test.ts`.

## 4. Identidade visual

- Prioridade: logotipo oficial → referências verificadas (Instagram, fachada, emblema) → tema neutro provisório.
- Cores: amostre do material oficial, documente a origem em `brand.theme` e marque como “a confirmar”.
- Sem logo em alta: **wordmark textual provisório**, sinalizado no rodapé. Nunca recrie o logotipo nem copie outra marca.
- Motivos da própria empresa podem virar elementos de interface, com moderação. Exemplos: o piso quadriculado e as
  linhas de LED do estúdio, ou as cores do emblema.
- A referência de acabamento de outra empresa serve **só** para composição. Nunca use nome, cores, fotos ou textos dela.

## 5. Imagens

1. Copie e ajuste `clientes/<pasta>/docs/PROMPT_IMAGENS.md`: uma imagem por seção, com proporção e espaço para texto.
2. **Peça os arquivos originais em alta (≥ 1536 px)**, um por imagem, com os nomes do prompt. Mosaicos são provisórios.
3. Importe:
   ```bash
   npm run importar-fotos -- <pasta>                     # clientes/<pasta>/anexos/imagens/*.png → WebP 1536 + 768
   npm run importar-mosaico -- <pasta> mosaico.png hero - servico-ppf …   # recorte automático (provisório)
   ```
4. Em `photos.ts`, aprove cada espaço com `img(...)`: `illustrative: true` para IA e crédito contendo “Não retrata a empresa”.
5. Revise em zoom antes de usar: logotipos de montadoras, textos, placas, rodas deformadas, mãos.
6. **Não** use IA para fachada, equipe, veículos atendidos, “antes e depois” ou logotipo. Esses itens exigem foto real autorizada.

## 6. Desenvolvimento e revisão

```bash
VITE_CLIENT=<pasta> npm run dev                 # http://localhost:5173
npm run typecheck && npm test                   # tipos + testes (regras de todos os clientes)
VITE_CLIENT=<pasta> npm run build
QA_CLIENT=<pasta> npm run qa                    # Chromium: 360/390/768/1280/1440, sobe o preview sozinho
```

- Ajuste `src/clients/<pasta>/qa.json` aos dados do cliente: busca, filtro, item “a partir de”, itens a selecionar,
  galeria, endereço e links permitidos.
- O QA salva capturas e `resultados-qa.json` em `clientes/<pasta>/evidencias/`.
- **Inspecione as capturas**: passar no QA não substitui olhar a página. Use `docs/modelo/CHECKLIST_REVISAO.md`.

## 7. Prévia navegável (link privado)

```bash
npm run previa -- <pasta>
```

Gera `previa/<pasta>/index.html` com CSS e JS embutidos, as imagens e o `arquivos.json` com o mapa para publicação.
Também testa a página com um reset externo agressivo. Publique como página **privada**, por exemplo um Artifact do
claude.ai, passando os arquivos de `arquivos.json`. Nunca publique em domínio público sem aprovação.

## 8. Entrega

Atualize `clientes/<pasta>/docs/RELATORIO_ENTREGA.md` com:
- o que mudou;
- os comandos executados e os resultados **reais**;
- as capturas;
- as pendências;
- o que não foi testado e por quê.

Faça o commit na branch do projeto.

---

## Definição de pronto

- [ ] Título do hero legível em 360 e 390 px, inclusive na prévia de página única.
- [ ] Composição mobile própria: título → foto → texto curto → CTA principal; secundário discreto.
- [ ] Catálogo idêntico à fonte, com aviso de preços e data em todo valor.
- [ ] Busca, filtros, detalhes, seleção, ficha do veículo, resumo e cópia funcionando.
- [ ] WhatsApp somente com número confirmado; sem ele, o modal oferece a cópia.
- [ ] Imagens aprovadas, nítidas e sinalizadas quando ilustrativas; placeholders honestos para o que falta.
- [ ] Contraste AA (axe) em todos os textos; sem rolagem horizontal e sem texto cortado nas cinco larguras.
- [ ] `npm test` e `npm run qa` 100% aprovados; build sem erros.
- [ ] Aviso “Demonstração conceitual CORE 3 — não é o site oficial…” no topo e no rodapé.
- [ ] Relatório com pendências e limitações, sem declarar testes não executados.

---

## Lições aprendidas (Company Auto SPA)

| Problema | Causa | Regra do modelo |
|---|---|---|
| Título preto na prévia do claude.ai | O reset sem camada do host vencia o `@layer base` do Tailwind | `html` e `body` sem camada; títulos com cor explícita; `npm run previa` e o QA testam esse cenário |
| Rolagem horizontal no mobile | Linha de chips expandindo o grid | `grid-cols-[minmax(0,1fr)]` + `min-w-0` em colunas com conteúdo rolável |
| Hero mobile parecia desktop comprimido | Mesma composição para todas as larguras | Hero com ordem própria no mobile e `clamp()` na tipografia |
| Ilustrações procedurais com aparência de CGI | Falta de fotos | Placeholders honestos até chegarem imagens fotorrealistas aprovadas |
| Imagens suaves | Recortes de mosaico (~380 px) | Pedir os originais ≥ 1536 px; o QA registra a escala de cada imagem |
| Textos cinza sumindo no preto | Opacidades baixas (`text-white/40`) | Tokens `muted`/`subtle` com contraste ≥ 4,5:1 e axe-core no QA |
| Dois botões amarelos competindo | CTA do header igual ao do hero | Um CTA principal por área; header contornado |
| Rolagem do menu mobile interrompida | Devolução de foco ao fechar | `focus({ preventScroll: true })` e rolagem após fechar |
| Galeria parecendo portfólio da empresa | Imagens de IA sem contexto | Seção “Inspiração”, selo em cada imagem e link para os trabalhos reais |
