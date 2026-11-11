import type { ApprovedPhoto, PhotoSlot } from '../../core/types';

/**
 * Espaços de fotografia. Enquanto `photo` for null, o site mostra “Fotografia pendente” com a direção de arte.
 * Para aprovar: coloque o arquivo em public/clientes/<pasta>/fotos/ (use `npm run importar-fotos -- <pasta>`)
 * e troque `null` por `img('<arquivo>', largura, altura, 'alt', { illustrative, credit })`.
 * Imagens geradas por IA: `illustrative: true` e crédito dizendo que não retratam a empresa.
 */
const base = `${import.meta.env.BASE_URL ?? '/'}clientes/_modelo/`;

export const img = (
  file: string,
  width: number,
  height: number,
  alt: string,
  opts: { credit: string; illustrative?: boolean; hd?: boolean; sourceId?: string },
): ApprovedPhoto => ({
  src: `${base}fotos/${file}.webp`,
  variants: opts.hd ? [{ src: `${base}fotos/${file}-768.webp`, width: 768 }, { src: `${base}fotos/${file}.webp`, width }] : undefined,
  width,
  height,
  alt,
  credit: opts.credit,
  illustrative: opts.illustrative,
  sourceId: opts.sourceId,
});

const slot = (id: string, label: string, brief: string, aspect: string, minWidth: number, photo: ApprovedPhoto | null = null): PhotoSlot => ({ id, label, brief, aspect, minWidth, photo });

export const photos: Record<string, PhotoSlot> = Object.fromEntries(
  [
    slot('hero', 'Fotografia principal', 'Veículo finalizado no estúdio, com área livre à esquerda para o título.', '3:2', 1536),
    slot('ppf', 'Proteção PPF', 'Aplicação de PPF em close nítido.', '3:2', 1536),
    slot('vitrificacao', 'Vitrificação', 'Gotas sobre superfície vitrificada.', '3:2', 1536),
    slot('polimento', 'Polimento', 'Polimento em execução com reflexo nítido.', '3:2', 1536),
    slot('ambiente', 'Ambiente', 'Ambiente do estúdio (foto real autorizada, de preferência).', '16:9', 1536),
    slot('galeria-1', 'Detalhe 1', 'Detalhe de acabamento.', '16:10', 1200),
    slot('galeria-2', 'Detalhe 2', 'Detalhe de acabamento.', '16:10', 1200),
    slot('galeria-3', 'Detalhe 3', 'Detalhe de acabamento.', '16:10', 1200),
  ].map((s) => [s.id, s]),
);
