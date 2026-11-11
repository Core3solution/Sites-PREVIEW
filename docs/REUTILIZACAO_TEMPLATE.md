# Referência técnica do template

Complementa o [Playbook](modelo/PLAYBOOK_PREVIAS_AUTOMOTIVAS.md) com os detalhes da configuração.

## Camadas

| Camada | Pasta | Contém |
|---|---|---|
| Template (genérico) | `src/core/` | Tipos (`types.ts`), componentes, seções, hooks, estado, utilitários. Nada específico de empresa. |
| Cliente (dados) | `src/clients/<pasta>/` | `index.ts` (textos, marca, contatos), `catalog.ts`, `photos.ts`, `sources.ts`, `qa.json` |
| Cliente (materiais) | `clientes/<pasta>/` | `CLAUDE.md`, `docs/`, `anexos/`, `evidencias/` |
| Cliente (arquivos públicos) | `public/clientes/<pasta>/` | `fotos/*.webp`, `favicon.svg` |

O cliente ativo vem de `VITE_CLIENT` (`src/site.config.ts`). Cada `src/clients/<pasta>/index.ts` faz `export default` de um `SiteConfig`.

## Seções e configuração

| Seção | Componente | Configuração |
|---|---|---|
| Aviso de demonstração | `sections/Header.tsx` → `DemoBar` | `meta.demoNotice`, `status` |
| Cabeçalho e menu | `sections/Header.tsx` | `nav`, `brand` |
| Hero | `sections/Hero.tsx` | `hero` (`subtitleShort` no celular, `mobilePhoto` opcional) |
| Faixa de serviços | `sections/TrustStrip.tsx` | `services.categories` |
| Serviços | `sections/Services.tsx` | `services` |
| Catálogo | `sections/Catalog.tsx` + `components/catalog/*` | `catalog` (cada item pode ter `photo`) |
| Solicitação | `sections/Quote.tsx` + `components/quote/VehicleForm.tsx` | `quote`, `contact.whatsapp` |
| Galeria / Inspiração | `sections/Gallery.tsx` | `gallery` |
| Sobre | `sections/About.tsx` | `about` |
| Reputação | `sections/Reputation.tsx` | `reputation` (`null` oculta a seção; remova `avaliacoes` do `nav`) |
| Localização | `sections/Location.tsx` | `location`, `contact.address` |
| CTA final e rodapé | `sections/Closing.tsx` | `finalCta`, `footer`, `sources` |

## Fotografias (`photos.ts`)

Cada seção referencia um espaço (`PhotoSlot`) com direção de arte, proporção e largura mínima. Com `photo: null`, o
site exibe “Fotografia pendente”. Para aprovar uma imagem:

```ts
slot('hero', 'Fotografia principal', '…', '3:2', 1536,
  img('hero', 1536, 1024, 'Descrição objetiva', { credit: 'Imagem ilustrativa gerada por IA … Não retrata a empresa.', illustrative: true, hd: true })),
```

`npm run importar-fotos -- <pasta>` gera `<nome>.webp` e `<nome>-768.webp` (`hd: true` habilita o `srcset`).

## Tema (`brand.theme`)

Tokens: `bg`, `surface`, `surface2`, `line`, `text`, `muted`, `subtle`, `accent`, `accentInk`, `accentSoft`.
Mantenha `muted` e `subtle` com contraste ≥ 4,5:1 sobre `surface2`. O QA mede tudo com axe-core.

## QA por cliente (`qa.json`)

Parâmetros que o `scripts/qa-browser.mjs` usa: total de itens, busca, filtro, item mais caro, item “a partir de”,
card de serviço, ficha de detalhes, itens a selecionar, trechos esperados na mensagem, galeria, endereço, links
externos permitidos, link do menu mobile e item selecionado no mobile. Use `null` para pular verificações que não se
aplicam (ex.: sem preços verificados).

## Regras do template

- Nada de conteúdo de empresa em `src/core/`.
- Sem soma de preços nem checkout: o fluxo gera uma mensagem não vinculante.
- Links externos via `SmartLink` (nova aba, `noopener noreferrer`).
- Movimento respeita `prefers-reduced-motion` e aparelhos modestos (`useRichMotion`). Sem dependência de WebGL;
  um módulo 3D futuro pode entrar como variante do fundo do hero.
- `html` e `body` sem camada em `src/index.css`, para não serem vencidos por resets externos.
