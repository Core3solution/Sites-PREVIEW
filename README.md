# CORE 3 — Modelo de prévias para estética automotiva

Base de código e processo da CORE 3 para criar **prévias comerciais não oficiais** de empresas do nicho automotivo
(PPF, vitrificação, polimento, envelopamento, insulfilm, lavagem). React + TypeScript + Vite + Tailwind CSS 4.

| Cliente | Pasta | Situação |
|---|---|---|
| Company Auto SPA | `company-auto-spa` | Versão preliminar revisada (`clientes/company-auto-spa/docs/RELATORIO_ENTREGA.md`) |
| Cliente-modelo | `_modelo` | Base para novos clientes (dados de exemplo; não publicar) |

## Começar

Requisitos: Node.js 20+ e Python 3 com Pillow (para importar imagens).

```bash
npm install
VITE_CLIENT=company-auto-spa npm run dev        # http://localhost:5173
```

## Novo cliente

```bash
npm run novo-cliente -- <pasta> "Nome da Empresa"
VITE_CLIENT=<pasta> npm run dev
```

Siga o **[Playbook](docs/modelo/PLAYBOOK_PREVIAS_AUTOMOTIVAS.md)**: auditoria → dados → identidade → imagens →
revisão → prévia → entrega.

## Comandos

| Comando | O que faz |
|---|---|
| `VITE_CLIENT=<pasta> npm run dev` / `build` / `preview` | Desenvolvimento, build e servidor do build do cliente |
| `npm run typecheck` | TypeScript |
| `npm test` | Vitest: regras de **todos** os clientes + testes específicos |
| `QA_CLIENT=<pasta> npm run qa` | Chromium/Playwright + axe-core nas 5 larguras; sobe o preview sozinho; evidências em `clientes/<pasta>/evidencias/` |
| `npm run importar-fotos -- <pasta>` | `clientes/<pasta>/anexos/imagens/*` → WebP 1536 + 768 em `public/clientes/<pasta>/fotos/` |
| `npm run importar-mosaico -- <pasta> <arquivo> <nomes…>` | Recorta mosaicos detectando a grade (provisório) |
| `npm run previa -- <pasta>` | Página única para link privado + verificação com CSS externo agressivo |

## Estrutura

```
src/core/                 template genérico (componentes, seções, estado, utilitários, tipos)
src/clients/<pasta>/      dados do cliente: index.ts, catalog.ts, photos.ts, sources.ts, qa.json
src/site.config.ts        escolhe o cliente por VITE_CLIENT
clientes/<pasta>/         CLAUDE.md do cliente, docs/, anexos/, evidencias/
public/clientes/<pasta>/  imagens otimizadas e favicon
docs/modelo/              playbook, checklist e modelos de documentos
docs/REUTILIZACAO_TEMPLATE.md   referência técnica da configuração
scripts/                  novo cliente, importação de imagens, prévia, QA
tests/                    testes do template e por cliente
```

> Toda prévia exibe “Demonstração conceitual CORE 3 — não é o site oficial da [empresa]”, usa `noindex` e só é
> compartilhada como página privada.
