# Checklist de revisão visual e funcional

Use em toda rodada de revisão, **olhando as capturas** em `clientes/<pasta>/evidencias/`, não apenas o resultado do QA.
Larguras: 360×800, 390×844, 768×1024, 1280×800, 1440×900.

## Crítico (bloqueia entrega)

- [ ] Título do hero legível em 360/390 px, no site e na prévia de página única (`npm run previa`).
- [ ] Nenhuma rolagem horizontal, texto cortado ou sobreposição de elementos.
- [ ] Preços idênticos à fonte, com “a partir de” preservado e aviso de data e confirmação.
- [ ] Nenhuma imagem ilustrativa sem selo; nenhum trabalho, avaliação ou cliente inventado.
- [ ] Aviso de demonstração no topo e no rodapé.

## Composição e direção de arte

- [ ] Hero mobile com composição própria (título → foto → texto curto → CTA), sem o título cobrir o carro.
- [ ] Carro bem enquadrado e nítido (escala ≤ 1,5× do original, ver `imagens-escala-1440.json`).
- [ ] Degradês moderados: a foto continua visível.
- [ ] Um CTA principal por área; secundários contornados ou como link.
- [ ] Tipografia consistente (títulos condensados em caixa alta; sem palavras isoladas desnecessárias).
- [ ] Espaçamentos padronizados; cards com a mesma estrutura e alinhamento de preço e ações.
- [ ] Identidade da empresa reconhecível; nenhum elemento de terceiros copiado.
- [ ] Efeitos suaves; nada de travar o scroll; `prefers-reduced-motion` respeitado.

## Funcional

- [ ] Menu (desktop e mobile), âncoras e scroll-spy.
- [ ] Cards de serviço → catálogo filtrado.
- [ ] Busca (com e sem acento), filtros, ordenação, “somente selecionados”, limpar.
- [ ] Detalhes do serviço; selecionar e remover; resumo atualizado.
- [ ] Ficha do veículo com validação; mensagem correta; copiar (conferir a área de transferência).
- [ ] WhatsApp só com número confirmado; senão, modal com cópia.
- [ ] Galeria e lightbox (teclado); mapa sob demanda; copiar endereço; links externos seguros.
- [ ] Navegação por teclado com foco visível.

## Técnico

- [ ] `npm run typecheck`, `npm test`, `npm run build`, `QA_CLIENT=<pasta> npm run qa`: tudo aprovado.
- [ ] Console sem erros; contraste AA (axe); LCP ≤ 2,5 s, CLS ≤ 0,1 e interação ≤ 200 ms em laboratório.
- [ ] `noindex` mantido; metadados básicos.
