# Reutilizar o template para outra empresa de estética automotiva

O código é dividido em duas camadas:

| Camada | Pasta | Contém |
|---|---|---|
| **Template (genérico)** | `src/core/` | Tipos, componentes, seções, hooks, estado, utilitários. Nenhum texto específico de empresa. |
| **Cliente (específico)** | `src/clients/<empresa>/` | Marca, paleta, textos, catálogo, preços, links, fontes. |

## Passo a passo

1. **Copie a pasta do cliente**
   ```bash
   cp -r src/clients/company-auto-spa src/clients/nova-empresa
   ```
2. **Edite os dados** (o TypeScript aponta qualquer campo faltante, porque o contrato está em `src/core/types.ts`):
   - `sources.ts`: registre cada fonte (captura, site, data). Todo preço e dado factual precisa de um `sourceId`.
   - `catalog.ts`: categorias e itens. Use `price.kind: 'fixed' | 'from' | 'on-request'` e valores em **centavos**.
   - `index.ts`: marca (`brand.theme` com as cores em hex), textos de cada seção, navegação, contatos e reputação.
     - `contact.whatsapp`: preencha **somente** com número oficial confirmado (`5511999999999`). Com `null`, o
       site oferece apenas “Copiar solicitação” e o modal “Como enviar”.
     - `brand.logo`: `{ src, alt }` quando houver logo oficial (coloque o arquivo em `public/`). Com `null`, aparece
       o wordmark textual.
     - `reputation`: use `null` se não houver dado público verificado. A seção é ocultada.
3. **Ative o cliente** em `src/site.config.ts`:
   ```ts
   import { novaEmpresa } from './clients/nova-empresa';
   export const site = novaEmpresa;
   ```
4. **Fotografias** (`photos.ts`): cada seção referencia um *espaço de foto* (`PhotoSlot`) com direção de arte,
   proporção e largura mínima. Com `photo: null`, o site mostra um placeholder identificado (“Fotografia pendente”).
   Para aprovar uma foto, coloque o arquivo em `public/fotos/` (de preferência WebP em 2 larguras) e preencha:
   ```ts
   photo: { src: '/fotos/hero-2400.webp', variants: [{ src: '/fotos/hero-1200.webp', width: 1200 }, { src: '/fotos/hero-2400.webp', width: 2400 }],
            width: 2400, height: 1350, alt: 'Descrição objetiva', credit: 'Foto: Company Auto Spa — uso autorizado em DD/MM/AAAA' }
   ```
   Nunca use miniaturas ampliadas nem ilustrações que simulem fotografia.
5. **Ajuste os testes** em `tests/catalog-data.test.ts` para travar os valores da nova empresa.
6. Rode `npm run typecheck && npm test && npm run build && npm run qa` (com `vite preview` ativo).

## Seções e o que controla cada uma

| Seção | Componente | Configuração |
|---|---|---|
| Aviso de demonstração | `Header.tsx` → `DemoBar` | `meta.demoNotice` (remova para sites oficiais) |
| Cabeçalho e menu | `Header.tsx` | `nav`, `brand` |
| Hero | `Hero.tsx` | `hero` |
| Faixa de serviços | `TrustStrip.tsx` | `services.categories` |
| Serviços | `Services.tsx` | `services` |
| Catálogo | `Catalog.tsx` | `catalog` |
| Solicitação | `Quote.tsx` | `quote`, `contact.whatsapp` |
| Galeria | `Gallery.tsx` | `gallery` |
| Sobre | `About.tsx` | `about` |
| Reputação | `Reputation.tsx` | `reputation` |
| Localização | `Location.tsx` | `location`, `contact.address` |
| CTA final e rodapé | `Closing.tsx` | `finalCta`, `footer`, `sources` |

## Regras do template

- Não escrever conteúdo de empresa dentro de `src/core/`.
- Não somar preços nem criar checkout: o fluxo gera uma **mensagem não vinculante**.
- Links externos usam `SmartLink` (nova aba, `noopener noreferrer`).
- Movimento respeita `prefers-reduced-motion` e aparelhos modestos (`useRichMotion`).
- Profundidade e movimento são feitos com CSS e React (parallax, perspectiva, inclinação). Não há dependência de
  WebGL. Um módulo 3D futuro pode ser acoplado ao hero sem alterar os dados (por exemplo, um `variant` extra em `Photo`).
