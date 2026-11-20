# Prompt de imagens — VYRA (alta resolução)

As 15 imagens atuais vieram em painéis (~390 px por look). Para o padrão premium, cada look precisa de um arquivo
próprio, **na maior resolução (≥ 1200 × 3000 px ou 1600 px de largura em 2:3)**, salvo em
`clientes/vyra/anexos/imagens/look-01.png` … `look-15.png`. Depois: `npm run importar-fotos -- vyra`.

Imagens extras para o layout:

| Arquivo | Uso | Proporção |
|---|---|---|
| `hero-duo.png` | Hero: duas modelos (looks 01 e 04) em estúdio claro com arcos e janelas | 4:3, modelos na metade direita |
| `editorial.png` | Faixa “Do studio para o seu dia.”: retrato 3/4 de costas com top de alças cruzadas | 3:2, modelo à direita |

## Prompt (copiar)

```text
Fotografia de e-commerce de moda fitness premium, FOTORREALISTA, para catálogo. Uma imagem por vez; aguarde "próxima".

Regras: modelo em pé, corpo inteiro (da cabeça aos tênis brancos), pose natural de catálogo, fundo de estúdio cinza-claro uniforme (#C6C4C5), luz suave e difusa, sombras leves no chão, mesma luz e enquadramento em todas. Proporção 2:5 vertical, maior resolução disponível. Mãos e pés anatomicamente corretos. Sem logotipos, textos, etiquetas visíveis ou marcas d'água. Tecidos com textura realista de peças de compressão e malha técnica.

LOOK 01 — top de manga longa ombro a ombro sálvia com regata por baixo + legging grafite cintura alta.
LOOK 02 — camiseta cropped amarelo-manteiga + short de compressão grafite com vivo amarelo.
… (seguir a tabela de clientes/vyra/docs/BRIEFING.md, look a look, mantendo as mesmas modelos do repertório)
```

## Antes de enviar
- [ ] Corpo inteiro, sem cortar cabeça ou tênis.
- [ ] Fundo cinza uniforme, igual em todos os looks.
- [ ] Sem texto/logotipo; mãos corretas.
- [ ] Arquivo original em alta (não captura de tela).
