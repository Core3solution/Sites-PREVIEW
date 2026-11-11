# Relatório de fontes — Company Auto SPA (demonstração CORE 3)

Pesquisa e evidências reunidas em 11/11/2026. Cada dado exibido no site referencia uma fonte em
`src/clients/company-auto-spa/sources.ts`.

## Evidências fornecidas (pasta `anexos/`)

Os hashes conferem com `MANIFESTO.txt` (itens 01–04). Os itens 05–06 chegaram depois, por mensagem.

| Arquivo | Conteúdo | SHA-256 (início) |
|---|---|---|
| `01_google_company_auto_spa.jpg` | Perfil no Google: **4,9 ★ (55)**, “Serviço de envelopamento de veículos em São Caetano do Sul”, texto da “Visão geral criada por IA”, endereço R. Pinheiro Machado, 34 | `ccabecd1…` |
| `02_whatsapp_catalogo_inicio.jpg` | Catálogo do WhatsApp, itens 1–8 | `05b16a22…` |
| `03_whatsapp_catalogo_continuacao.jpg` | Catálogo do WhatsApp, itens 5–10 | `47b99361…` |
| `04_referencia_estrutura_visual_carflex_NAO_COPIAR_MARCA.png` | Referência **de outra empresa**, usada só para acabamento e composição | `b2a77062…` |
| `05_instagram_company_autospa_perfil.jpg` | Instagram **@company.autospa**: “Company Auto Spa \| ABC”, 496 posts, 12,1 mil seguidores, bio (endereço, 🟡PPF ⚫Envelopamento 🟡Proteção), link `beacons.ai/companyautospa`, emblema da marca | `e7a06883…` |
| `06_instagram_company_autospa_grade.jpg` | Grade de posts: estúdio com teto de linhas de LED, piso quadriculado, grafite amarelo e emblema “COMPANY” na parede | `26a0851d…` |

A data das capturas do Instagram não aparece na imagem (só o horário 17:22). Elas foram **recebidas em 11/11/2026**.

## Transcrição do catálogo (conferência visual)

| # | Nome na fonte | Trecho visível | Valor |
|---|---|---|---|
| 1 | Lavagem Premium 🫧 | “Nossa lavagem premium, é u…” | R$ 250,00 |
| 2 | PPF FULL GSWF | “Proteção total do seu veículo…” | R$ 14.900,00 |
| 3 | Envelopamento de teto | “Preços a partir de $1.500, co…” | **a partir de** R$ 1.500,00 |
| 4 | Vitrificação das rodas | “Nossa vitrificação das rodas…” | R$ 499,00 |
| 5 | PPF NO FAROL 🚥 | “A melhor proteção para o se…” | R$ 399,00 |
| 6 | PPF \*SMOKE\* NO FAROL… (nome truncado) | “Com o PPF SMOKE além da …” | R$ 499,00 |
| 7 | PPF FULL 🔒🔒 | “Nosso PPF FULL está inclus…” | R$ 10.900,00 |
| 8 | PPF FRONTAL 🔒 | “Nosso PPF Frontal possui ap…” | R$ 4.499,00 |
| 9 | Insulfilm Carbon | “Insulfilm com adicional do p…” | R$ 600,00 |
| 10 | Polimento técnico (Corre… (nome truncado) | “Nosso polimento é realizado…” | R$ 1.080,00 |

`docs/CATALOGO_FONTE_10_SERVICOS.json` consta no manifesto mas **não foi recebido**. A transcrição acima foi feita
diretamente das capturas, e o teste `tests/catalog-data.test.ts` trava esses valores.

## Pesquisa pública

| Consulta | Resultado | Situação |
|---|---|---|
| Busca web “Company Auto Spa” + São Caetano | Domínio **companyautospa.com.br** (“Home - Company Auto Spa”); página de case de agência (k1digital.com.br) | **Não confirmado.** O acesso aos domínios foi bloqueado pela rede do ambiente (proxy 403 / DNS). Não se afirma que a empresa tem ou não tem site. |
| Busca web (registro empresarial) | Resultado “COMPANY AUTO SPA LTDA — CNPJ 47.702.723/0001-04” (casadosdados.com.br) e telefone fixo 11 4050-0178 em snippet | **Não verificado.** Página inacessível. O número **não** é usado no site e não é tratado como WhatsApp. |
| Instagram | @company.autospa | Confirmado pelas capturas 05/06. Link usado no site. |
| Nova busca (Instagram, Facebook, TikTok, YouTube, avaliações) | Nenhum canal adicional encontrado. Só listagens de diretório com o mesmo endereço ([telelistas](https://www.telelistas.net/sp/sao+caetano+do+sul/lava+rapido+e+polimento+de+automoveis)) | **Não confundir** com “SAC AUTO SPA” ([sites.google.com/view/sacautopa-](https://sites.google.com/view/sacautopa-/inicio)) nem com “Auto Spa Estética Automotiva” (Infojobs, outras cidades): são empresas diferentes. |

Fontes de busca: [companyautospa.com.br](https://companyautospa.com.br/),
[k1digital.com.br/projetos/company-auto-spa](https://k1digital.com.br/projetos/company-auto-spa/),
[casadosdados.com.br](https://casadosdados.com.br/solucao/cnpj/company-auto-spa-ltda-47702723000104).

## Identidade visual observada

- **Emblema** (miniatura do Instagram): selo circular branco recortado sobre preto, faixa preta com “COMPANY” em
  amarelo, fitas amarelas laterais, “PREMIUM” em arco com cinco estrelas e “AUTO SPA” embaixo.
- **Cores**: preto, amarelo-ouro (amostra média ≈ `#E4BA42`) e branco. A bio usa 🟡/⚫. Os valores são aproximados
  a partir de miniatura e precisam do arquivo oficial.
- **Ambiente**: teto escuro com linhas de LED brancas, paredes pretas, piso quadriculado e grafite amarelo.

O site usa **wordmark textual provisório** e não recria o emblema.
