import type { ApprovedPhoto, PhotoSlot } from '../../core/types';

/**
 * Espaços de fotografia da Company Auto SPA.
 *
 * Situação em 11/11/2026: imagens ILUSTRATIVAS geradas por IA (ChatGPT) pela equipe CORE 3.
 * - Alta resolução (1536 px, anexos/imagens-ia/ → scripts/importar-fotos.py): hero, PPF, envelopamento, vitrificação.
 * - Baixa resolução (~375 px, recortadas do mosaico anexos/07 por scripts/importar-mosaico-ia.py): as demais.
 *   Substituir pelos originais em alta (mesmo nome em anexos/imagens-ia/) e atualizar width/height aqui.
 * Fotos reais da empresa (fachada, veículos atendidos, equipe, estúdio) continuam pendentes.
 */
const base = import.meta.env.BASE_URL ?? '/';
const credit = 'Imagem ilustrativa gerada por IA (ChatGPT), fornecida pela equipe CORE 3 em 11/11/2026. Não retrata veículo, serviço ou instalação da Company Auto SPA.';

/** Imagem gerada por IA. `hd` = existe a versão de 768 px além da original (srcset). */
const ai = (file: string, width: number, height: number, alt: string, hd = false): ApprovedPhoto => ({
  src: `${base}fotos/${file}.webp`,
  variants: hd ? [{ src: `${base}fotos/${file}-768.webp`, width: 768 }, { src: `${base}fotos/${file}.webp`, width }] : undefined,
  width,
  height,
  alt,
  credit,
  illustrative: true,
  sourceId: 'imagens-ia',
});

const slot = (id: string, label: string, brief: string, aspect: string, minWidth: number, photo: ApprovedPhoto | null = null): PhotoSlot => ({
  id,
  label,
  brief,
  aspect,
  minWidth,
  photo,
});

export const photos: Record<string, PhotoSlot> = Object.fromEntries(
  [
    slot('hero', 'Fotografia principal', 'Veículo finalizado no estúdio, com as linhas de LED do teto refletidas na pintura. Horizontal, com área livre à esquerda para o título.', '16:9', 2400,
      ai('hero', 1536, 1024, 'Carro esportivo preto em estúdio escuro, com linhas de LED refletidas na lataria', true)),
    slot('ppf', 'Proteção PPF', 'Aplicação de PPF em andamento ou borda da película sobre a pintura, em close nítido.', '4:3', 1600,
      ai('servico-ppf', 1536, 1024, 'Mãos com luvas pretas aplicando película transparente de proteção sobre o capô de um carro preto', true)),
    slot('envelopamento', 'Envelopamento', 'Teto envelopado em veículo atendido, vista lateral elevada.', '4:3', 1600,
      ai('servico-envelopamento', 1536, 1024, 'Carro branco visto de cima, com teto envelopado em preto brilhante, sobre piso quadriculado', true)),
    slot('vitrificacao', 'Vitrificação', 'Roda vitrificada em close, com reflexo ou gotas d’água.', '4:3', 1600,
      ai('servico-vitrificacao', 1536, 1024, 'Roda e para-lama pretos cobertos de gotas de água após vitrificação', true)),
    slot('insulfilm', 'Insulfilm', 'Vidro com Insulfilm Carbon aplicado, visto de fora em ângulo.', '4:3', 1600,
      ai('servico-insulfilm', 383, 279, 'Vidro lateral escurecido com película, refletindo linhas de LED')),
    slot('polimento', 'Polimento técnico', 'Polimento técnico em execução, com a pintura refletindo a iluminação do estúdio.', '4:3', 1600,
      ai('servico-polimento', 380, 279, 'Mãos com luvas pretas usando politriz com boina sobre pintura preta')),
    slot('lavagem', 'Lavagem premium', 'Etapa da lavagem premium (espuma ou secagem) em veículo atendido.', '4:3', 1600,
      ai('servico-lavagem', 379, 279, 'Carro coberto por espuma branca escorrendo pela lateral')),
    slot('estudio', 'Ambiente', 'Ambiente de estúdio: teto com linhas de LED e piso quadriculado.', '16:9', 1600,
      ai('ambiente', 383, 205, 'Estúdio escuro com linhas de LED no teto, piso quadriculado e carro coberto')),
    slot('cta', 'Textura do convite final', 'Detalhe de pintura com reflexos das luzes do estúdio.', '21:9', 2400,
      ai('cta', 376, 205, 'Reflexos de LED em pintura preta, em close')),
    slot('inspiracao-farol', 'Farol', 'Farol com película aplicada.', '16:10', 1200,
      ai('inspiracao-farol', 380, 205, 'Farol de LED moderno em carro preto')),
    slot('inspiracao-frontal', 'Frente protegida', 'Frente do veículo sob luz rasante.', '16:10', 1200,
      ai('inspiracao-frontal', 379, 205, 'Frente de carro preto com faróis acesos sob luz rasante')),
    slot('inspiracao-gotas', 'Hidrofobia', 'Gotas sobre superfície vitrificada.', '16:10', 1200,
      ai('inspiracao-gotas', 376, 231, 'Gotas de água sobre pintura preta com reflexos de LED')),
    slot('inspiracao-acetinado', 'Acetinado', 'Para-lama envelopado em acabamento acetinado.', '16:10', 1200,
      ai('inspiracao-acetinado', 383, 231, 'Para-lama com acabamento acetinado escuro')),
    slot('inspiracao-espelho', 'Espelhamento', 'Reflexo nítido das linhas de LED em porta polida.', '16:10', 1200,
      ai('inspiracao-espelho', 380, 231, 'Porta preta polida refletindo linhas de LED')),
    slot('inspiracao-noturna', 'Noturna', 'Veículo em rua urbana à noite.', '16:10', 1200,
      ai('inspiracao-noturna', 379, 231, 'Carro preto em rua molhada à noite com luzes desfocadas')),
  ].map((s) => [s.id, s]),
);
