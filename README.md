# Company Auto Spa — demonstração conceitual CORE 3

> **Demonstração conceitual CORE 3 — não é o site oficial da Company Auto SPA.**
> Projeto comercial independente, não contratado pela empresa. Não envia mensagens, não agenda e não processa pagamentos.

Site em React + TypeScript + Vite + Tailwind CSS, organizado como **template reutilizável** para empresas de
estética automotiva. Os dados da Company ficam em `src/clients/company-auto-spa/`.

## Executar

Requisitos: Node.js 20+ (testado com Node 22.23 e npm 10.9).

```bash
npm install
npm run dev          # desenvolvimento → http://localhost:5173
npm run build        # build de produção em dist/
npm run preview      # serve dist/ → http://localhost:4173
```

## Verificar

```bash
npm run typecheck    # TypeScript
npm test             # Vitest: dados do catálogo, utilitários e interações (30 testes)
npm run preview &    # em outro terminal
npm run qa           # Chromium/Playwright: 59 verificações + capturas em evidencias/
```

`npm run qa` usa o Playwright e o Chromium já instalados no ambiente. Em outra máquina, rode `npx playwright install chromium` antes.

## Estrutura

```
src/core/             template genérico (componentes, seções, hooks, utilitários, tipos)
src/clients/…         dados da empresa (marca, catálogo, textos, fontes)
src/site.config.ts    seleciona a empresa ativa
scripts/              geração dos visuais procedurais e QA em navegador
public/media/visuals  ilustrações geradas (WebP)
anexos/               evidências recebidas (capturas)
docs/                 relatórios (entrega, fontes, reutilização)
evidencias/           capturas e resultados do QA
```

Veja `docs/RELATORIO_ENTREGA.md`, `docs/RELATORIO_FONTES.md` e `docs/REUTILIZACAO_TEMPLATE.md`.
