import type { ApprovedPhoto, PhotoSlot } from '../../core/types';

/**
 * Imagens da VYRA: repertório de 15 looks do briefing, recortado de 3 painéis (clientes/vyra/anexos/02–04)
 * em public/clientes/vyra/fotos/look-01…15.webp (~390 × 985 px, tamanho nativo, sem ampliação).
 */
const base = `${import.meta.env.BASE_URL ?? '/'}clientes/vyra/`;
const credit = 'Imagem do repertório visual fornecido no briefing da marca (20/11/2026).';

const look = (n: number, alt: string, h = 989): ApprovedPhoto => ({
  src: `${base}fotos/look-${String(n).padStart(2, '0')}.webp`,
  width: 390,
  height: h,
  alt,
  credit,
  sourceId: 'briefing-vyra',
});

const alts: [number, string, number?][] = [
  [1, 'Modelo com top de manga longa ombro a ombro sálvia e legging grafite, tênis branco'],
  [2, 'Modelo com camiseta cropped amarelo-manteiga e short de compressão grafite com vivo'],
  [3, 'Modelo com regata drapeada ardósia e capri ardósia'],
  [4, 'Modelo com regata frente única lilás e capri pistache'],
  [5, 'Modelo com blusa ombro a ombro off-white sobre top azul e legging marrom com vivos azuis'],
  [6, 'Modelo com regata amarela com vivo marinho e short duplo rosa listrado'],
  [7, 'Modelo com regata decote V azul e calça wide marinho com faixa creme'],
  [8, 'Modelo com regata vermelha e bermuda vermelha com vivos off-white'],
  [9, 'Modelo com regata coral e calça preta com faixa vermelha'],
  [10, 'Modelo com regata aqua e short duplo aqua com vivos off-white'],
  [11, 'Modelo com camiseta cropped amarelo-manteiga e legging flare lavanda', 981],
  [12, 'Modelo com regata drapeada ardósia sobre top azul-claro e bermuda de compressão ardósia', 981],
  [13, 'Modelo com blusa de manga longa rosê com recortes e capri bordô com vivos', 981],
  [14, 'Modelo com jaqueta cropped off-white, regata e short de compressão verde-claro', 981],
  [15, 'Modelo com regata decote V marrom com vivo azul e legging flare azul-claro', 981],
];

const slot = (id: string, label: string, photo: ApprovedPhoto | null, aspect = '2:5', minWidth = 780): PhotoSlot => ({
  id,
  label,
  brief: 'Foto de catálogo: corpo inteiro, fundo cinza-claro de estúdio, mesma luz em todos os looks.',
  aspect,
  minWidth,
  photo,
});

export const photos: Record<string, PhotoSlot> = Object.fromEntries(
  alts.map(([n, alt, h]) => {
    const id = `look-${String(n).padStart(2, '0')}`;
    return [id, slot(id, `Look ${String(n).padStart(2, '0')}`, look(n, alt, h))];
  }),
);
