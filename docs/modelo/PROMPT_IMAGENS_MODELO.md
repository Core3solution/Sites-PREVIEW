# Prompt de imagens — {{EMPRESA}}

Ajuste os trechos marcados com [ ] à identidade e aos serviços reais da empresa. As imagens geradas entram no site
como **“Imagem ilustrativa”** e nunca substituem fotos reais de trabalhos.

## Peça os arquivos originais

Baixe **cada imagem separadamente, na maior resolução (≥ 1536 px)**, com os nomes abaixo, e salve em
`clientes/{{PASTA}}/anexos/imagens/`. Mosaicos ou capturas de tela da conversa ficam suaves no site.

| Arquivo | Seção | Proporção |
|---|---|---|
| `hero.png` | Topo (desktop e celular) | 3:2, carro na metade direita, esquerda livre |
| `ppf.png`, `vitrificacao.png`, `polimento.png`, … | Cards de serviço (um por categoria) | 3:2 |
| `ambiente.png` | Sobre | 16:9 (prefira foto real) |
| `galeria-1.png` … | Inspiração | 16:10 ou 1:1 |

## O que NÃO gerar

Logotipo, fachada, equipe, veículos atendidos, “antes e depois” e interior real do estúdio.

## Prompt (copiar)

```text
Você é diretor de fotografia publicitária automotiva. Gere imagens FOTORREALISTAS para o site de um centro de estética automotiva premium ([serviços reais da empresa]). Gere UMA imagem por vez e espere "próxima".

REGRAS GERAIS
- Fotografia real, editorial, câmera full-frame e lente prime. Nunca ilustração, render 3D ou aparência de IA.
- Ambiente: [descrição do estúdio, ex.: paredes pretas, linhas de LED brancas no teto, piso quadriculado].
- Paleta: [cores da marca]; acento [cor] apenas em detalhes.
- Carros genéricos SEM marca reconhecível (sem logotipos, emblemas, grades características ou placas legíveis).
- Anatomia perfeita: rodas redondas com raios iguais, carroceria simétrica, reflexos coerentes, mãos com cinco dedos.
- Pessoas: só mãos e antebraços com luvas pretas, sem rosto.
- Proibido: textos, letras, números, marcas d'água, logotipos, [elementos da referência de outra empresa].
- Entregue na maior resolução disponível, sem bordas.

IMAGEM 1 — Topo: carro [cor] em vista dianteira 3/4 no estúdio, ocupando a metade DIREITA; metade esquerda escura e limpa para o título; câmera baixa, lente 85 mm. Proporção 3:2.
IMAGEM 2 — [Serviço]: [cena do serviço em close]. Proporção 3:2.
…
```

## Revisão antes de enviar

- [ ] Parece fotografia real?
- [ ] Sem logotipo, texto ou placa?
- [ ] Rodas e mãos corretas?
- [ ] Espaço livre para texto onde foi pedido?
- [ ] Arquivo original em alta (não captura de tela)?
