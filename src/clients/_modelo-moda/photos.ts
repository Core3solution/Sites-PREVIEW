import type { ApprovedPhoto, PhotoSlot } from '../../core/types';

/**
 * Fotos dos looks (corpo inteiro, fundo de estúdio uniforme). `photo: null` mostra “Fotografia pendente”.
 * Importe com `npm run importar-fotos -- <pasta>` ou recorte painéis com `npm run importar-mosaico`.
 */
const base = `${import.meta.env.BASE_URL ?? '/'}clientes/_modelo-moda/`;

export const img = (file: string, width: number, height: number, alt: string, credit: string): ApprovedPhoto => ({
  src: `${base}fotos/${file}.webp`,
  width,
  height,
  alt,
  credit,
});

const slot = (id: string, label: string): PhotoSlot => ({
  id,
  label,
  brief: 'Foto de catálogo: corpo inteiro, fundo de estúdio uniforme, mesma luz em todos os looks.',
  aspect: '2:5',
  minWidth: 780,
  photo: null,
});

export const photos: Record<string, PhotoSlot> = Object.fromEntries(
  [1, 2, 3].map((n) => {
    const id = `look-0${n}`;
    return [id, slot(id, `Look 0${n}`)];
  }),
);
