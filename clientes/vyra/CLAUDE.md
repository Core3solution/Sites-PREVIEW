# CLAUDE.md — VYRA (cliente `vyra`, nicho moda)

Regras específicas deste cliente. As regras gerais estão no `CLAUDE.md` da raiz e em `docs/modelo/PLAYBOOK_PREVIAS.md`.

## Marca
- **Nome:** VYRA (wordmark “VYRA.” com ponto quadrado verde-limão). Mote “Studio to street”.
- **Posicionamento:** moda fitness / activewear para público médio-alto; looks completos de R$ 490 a R$ 890.
- **Não confundir com:** “Vekyo”/“Veyko” (moda fitness popular, outra empresa) e o produto “VYRA Sports Bra” da loja
  The Folklore (EUA). Nenhuma marca de moda fitness “VYRA” foi confirmada no Brasil (pesquisa de 20/11/2026).
- **Antes de qualquer uso além da demonstração:** checar INPI e domínio.

## Fontes
- Briefing visual: `anexos/01_referencia_layout_vyra.webp` (layout) e `anexos/02–04` (15 looks em 3 painéis).
- Dados dos looks (nome, preço, cores) transcritos do layout de referência e travados em `tests/clients/vyra.test.ts`.
- As imagens aparentam ser geradas por IA; autoria e direitos de uso **a confirmar** com quem forneceu o briefing.

## Identidade
- Cores amostradas do layout: fundo `#F4F4F0`, grafite `#181C18`, acento limão `#D8F05C`. O acento é só
  preenchimento, nunca texto sobre fundo claro.
- Tipografia: Outfit (display geométrica, próxima do layout) + Inter (texto). Wordmark textual até haver arquivo oficial.
- Layout de referência: painel escuro com corte diagonal + fotos lado a lado, trilho de categorias, grade 3 colunas
  com cards em fundo de estúdio, faixa “Do studio para o seu dia.”.

## Comercial
- Preços com o aviso de referência e confirmação; **sem total**. A sacola é seleção para atendimento.
- Tamanhos PP–GG como **grade de referência** (`sizes.confirmed: false`); sem tabela de medidas.
- Canal de atendimento/WhatsApp: **não confirmado** (`whatsapp: null`). Políticas de entrega e troca: inexistentes.
- Aviso: “Demonstração conceitual CORE 3 — não é o site oficial da VYRA”.
