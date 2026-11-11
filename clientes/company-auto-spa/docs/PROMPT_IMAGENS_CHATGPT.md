# Prompt de imagens — Company Auto Spa (para gerar no ChatGPT)

> Caminhos como `anexos/…`, `evidencias/…` e `docs/…` neste documento são relativos a `clientes/company-auto-spa/` (reorganização do repositório em modelo multi-cliente, 11/11/2026).

Este documento organiza as imagens que o site precisa, uma por seção, e traz o prompt pronto para colar no ChatGPT.
As imagens geradas por IA entram no site **identificadas como “Imagem ilustrativa”**. Elas não substituem fotos reais
de trabalhos da Company (ver “O que NÃO gerar”).

## Mapa: imagem × seção do site

| # | Arquivo | Seção do site | Proporção pedida | Corte final no site |
|---|---|---|---|---|
| 1 | `hero.png` | Topo (desktop) | 3:2 horizontal | 16:9, texto à esquerda |
| 2 | `hero-mobile.png` | Topo (celular) | 2:3 vertical | vertical, texto embaixo |
| 3 | `servico-ppf.png` | Card “Proteção PPF” | 3:2 | 4:3 |
| 4 | `servico-envelopamento.png` | Card “Envelopamento” | 3:2 | 4:3 |
| 5 | `servico-vitrificacao.png` | Card “Vitrificação” | 3:2 | 4:3 |
| 6 | `servico-insulfilm.png` | Card “Insulfilm” | 3:2 | 4:3 |
| 7 | `servico-polimento.png` | Card “Polimento técnico” | 3:2 | 4:3 |
| 8 | `servico-lavagem.png` | Card “Lavagem premium” | 3:2 | 4:3 |
| 9 | `cta.png` | Fundo do convite final | 3:2 | faixa panorâmica ~21:9 |
| 10 | `ambiente.png` | Seção “Sobre” | 2:3 vertical | 4:5 |
| 11–16 | `inspiracao-*.png` | Galeria “Inspiração” | 1:1 | 1:1 e mosaico |

## O que NÃO gerar com IA (precisa ser foto real e autorizada)

- **Logotipo** da Company: só o arquivo oficial.
- **Fachada** e entrada da Rua Pinheiro Machado, 34.
- **Veículos atendidos**, “antes e depois” e portfólio de trabalhos.
- **Equipe** e pessoas identificáveis.
- **Interior real do estúdio**, com emblema, grafite e piso.

Esses itens continuam como espaços “Fotografia pendente” no site, ou a galeria aponta para o Instagram real.

## Prompt (copiar a partir daqui)

```text
Você é diretor de fotografia publicitária automotiva. Vai gerar imagens FOTORREALISTAS para o site de um centro de estética automotiva premium (PPF, envelopamento, vitrificação, insulfilm, polimento técnico e lavagem). Gere UMA imagem por vez, na ordem abaixo. Depois de cada uma, espere eu responder "próxima" ou pedir ajuste.

REGRAS GERAIS — valem para todas as imagens

Estilo
- Fotografia real, editorial e cinematográfica, como um ensaio publicitário de alto padrão feito com câmera full-frame e lente prime. Nunca ilustração, render 3D, CGI, pintura digital ou aparência de "imagem de IA".
- Estúdio escuro: paredes e teto pretos, linhas retas e finas de LED branco neutro no teto (paralelas ou em diagonal), refletidas de forma limpa e nítida na pintura. Piso escuro, podendo ser em placas quadriculadas preto e grafite.
- Paleta: preto, grafite, cinza-chumbo e branco. Único acento quente permitido: um toque sutil de amarelo-ouro (#E4BA42) em um reflexo ou detalhe, nunca dominante.
- Profundidade de campo realista, grão fino de filme, contraste alto com detalhe nas sombras. Sem HDR exagerado, sem neon colorido, sem fumaça, sem faíscas, sem elementos futuristas.

Veículos
- Carros genéricos de padrão premium (esportivo, sedã ou SUV modernos) SEM marca reconhecível: sem logotipos, emblemas, grades características de montadora ou nomes de modelo. Sem placa ou com placa lisa, sem caracteres.
- Anatomia perfeita: quatro rodas circulares com o mesmo número de raios, pneus coerentes, carroceria simétrica, faróis, retrovisores e maçanetas no lugar certo, reflexos que acompanham a curvatura da lataria. Nada derretido, duplicado, torto ou fundido.

Pessoas
- Somente quando a imagem pedir. Mostrar apenas mãos e antebraços com luvas nitrílicas pretas, sem rosto, sem tatuagem, sem logotipo na roupa. Mãos com cinco dedos e anatomia correta.

Proibido em todas
- Qualquer texto, letra, número, marca d'água, logotipo (de montadora, produto ou empresa), grafite ou pôster legível.
- Teto com luzes em hexágono ou colmeia.
- Amarelo como cor principal, fundo branco de catálogo, cenários de rua com letreiros legíveis.

Entrega
- Maior resolução disponível, sem bordas e sem moldura, respeitando a proporção e o espaço livre para texto indicados.

IMAGEM 1 — Topo do site (desktop)
Proporção: horizontal 3:2. Mantenha o assunto entre 20% e 80% da altura, pois o site recorta para 16:9.
Cena: carro esportivo preto brilhante em vista dianteira 3/4, parado em estúdio escuro, ocupando a metade DIREITA do quadro. As linhas de LED do teto aparecem refletidas como faixas longas e curvas no capô, para-lama e para-brisa. A metade ESQUERDA fica quase toda escura e limpa, como espaço para título. Câmera baixa, na altura dos faróis, lente 85 mm, piso refletindo levemente o carro. Clima silencioso, luxuoso e preciso.

IMAGEM 2 — Topo do site (celular)
Proporção: vertical 2:3.
Cena: mesmo conceito da imagem 1, com enquadramento mais fechado (frente 3/4 ou capô com os reflexos de LED). O carro ocupa o TERÇO SUPERIOR; os dois terços inferiores ficam escuros e limpos para texto.

IMAGEM 3 — Proteção PPF
Proporção: horizontal 3:2.
Cena: close de mãos com luvas pretas aplicando película transparente de proteção de pintura (PPF) sobre o capô de um carro escuro, usando espátula de feltro. Borda da película nítida e visível, gotículas da solução de aplicação na superfície, linhas de LED refletidas. Foco crítico na borda da película, fundo desfocado.

IMAGEM 4 — Envelopamento
Proporção: horizontal 3:2.
Cena: carro branco perolado com o teto envelopado em preto brilhante, vista lateral elevada (câmera acima da linha do teto). A transição limpa entre pintura e envelopamento aparece nas colunas. Estúdio escuro, LED refletido no teto preto.

IMAGEM 5 — Vitrificação
Proporção: horizontal 3:2.
Cena: close de roda esportiva escura de liga leve (raios iguais, pneu coerente, sem logotipo no centro nem marca no pneu), recém-vitrificada, com gotas de água redondas e definidas (efeito hidrofóbico) no aro e no para-lama. Luz lateral rasante destacando o brilho.

IMAGEM 6 — Insulfilm
Proporção: horizontal 3:2.
Cena: vidro lateral traseiro de um carro escuro com película escura tipo carbon aplicada, vista de fora em ângulo de 30°. Reflexo das linhas de LED no vidro, faixa de serigrafia preta pontilhada na borda do vidro visível, interior quase invisível pela película.

IMAGEM 7 — Polimento técnico
Proporção: horizontal 3:2.
Cena: politriz orbital com boina de espuma em uso na porta de um carro preto, segurada por mãos com luvas pretas. A área já polida reflete as linhas de LED de forma espelhada e perfeitamente reta. Sem sujeira exagerada e sem montagem de "antes e depois".

IMAGEM 8 — Lavagem premium
Proporção: horizontal 3:2.
Cena: carro escuro coberto por espuma branca e densa (snow foam) escorrendo pela lateral, em estúdio escuro. Luz de LED destacando a textura da espuma, piso molhado com reflexos.

IMAGEM 9 — Fundo do convite final
Proporção: horizontal 3:2. O site recorta como faixa panorâmica; mantenha o interesse no centro.
Cena: macro de pintura preta muito brilhante com reflexos longos e paralelos de LED, quase abstrata, com 70% da imagem em preto profundo para receber texto branco por cima. Sem o carro inteiro.

IMAGEM 10 — Ambiente (seção Sobre)
Proporção: vertical 2:3.
Cena: estúdio de estética automotiva escuro e organizado, teto preto com linhas de LED brancas, piso em placas quadriculadas preto e grafite, um carro escuro coberto parcialmente visível em perspectiva. Sem pessoas, sem logotipos, sem textos ou artes nas paredes. Não deve parecer a fachada ou o interior real de nenhuma empresa específica.

IMAGENS 11 a 16 — Galeria "Inspiração"
Proporção: quadrada 1:1, com a mesma linguagem de luz das imagens anteriores.
11. Farol de LED moderno com película smoke aplicada, close lateral, reflexo do LED do teto na lente.
12. Frente de carro escuro sob luz rasante revelando a superfície lisa e protegida, sem grade de marca.
13. Macro de gotas de água sobre capô preto vitrificado.
14. Detalhe de para-lama envelopado em cinza acetinado (satin), luz suave e difusa.
15. Reflexo nítido das linhas de LED do teto numa porta preta polida, linhas perfeitamente retas.
16. Carro escuro em rua urbana noturna vazia após chuva, reflexos de luzes desfocadas, sem placas, letreiros ou textos legíveis.
```

## Revisão antes de enviar (checklist rápido)

- [ ] Parece fotografia real? Não pode parecer render nem ilustração.
- [ ] Rodas redondas, mesmo número de raios, carroceria simétrica, mãos corretas.
- [ ] Nenhum texto, logotipo, emblema, placa ou marca d'água.
- [ ] Espaço livre para texto onde foi pedido (imagens 1, 2 e 9).
- [ ] Amarelo só como detalhe e teto sem hexágonos.
- [ ] Resolução máxima disponível. Se ampliarem com outra ferramenta, enviem também o original.

## Como enviar para inclusão no site

1. Uma pasta (por exemplo, no Google Drive), chamada **“Company Auto Spa — imagens do site”**.
2. Arquivos com os **nomes exatos** da tabela (`hero.png`, `servico-ppf.png`…), em PNG ou JPG de alta qualidade.
3. Um arquivo `registro.txt` com, para cada imagem, a data de geração e a ferramenta usada. Ele vira o crédito
   “Imagem ilustrativa gerada por IA” no site e fica no relatório de fontes.

Na inclusão, eu faço:
- recortes por seção;
- versões WebP em duas larguras;
- o hero com versão desktop e versão mobile própria;
- o selo “Imagem ilustrativa” em cada imagem;
- a troca do título da galeria para “Inspiração”, para não parecer portfólio da empresa;
- o teste completo outra vez em 360, 390, 768, 1280 e 1440 px.

## Observações sobre direitos

- Gerar as imagens evita usar fotografias de terceiros. Os termos de uso da ferramenta definem quem pode usar o
  resultado comercialmente; confirmem a versão vigente desses termos.
- Imagens geradas por IA podem não ter proteção autoral exclusiva, e imagens parecidas podem existir em outros lugares.
  Para o portfólio e a identidade da empresa, o ideal continua sendo foto real autorizada.
- Evitar logotipos e modelos reconhecíveis reduz o risco de uso indevido de marcas de montadoras.
