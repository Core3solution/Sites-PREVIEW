import type { Source } from '../../core/types';

export const sources: Source[] = [
  {
    id: 'briefing-vyra',
    label: 'Briefing visual da marca VYRA (layout de referência e repertório de 15 looks) fornecido à CORE 3',
    kind: 'briefing',
    observedAt: '2026-11-20',
    file: 'clientes/vyra/anexos/01_referencia_layout_vyra.webp; clientes/vyra/anexos/02_looks_01-05.webp; clientes/vyra/anexos/03_looks_06-10.webp; clientes/vyra/anexos/04_looks_11-15.webp',
    note: 'Nomes, preços e cores dos looks transcritos do layout de referência. As imagens aparentam ser geradas por IA; autoria e direitos de uso a confirmar.',
  },
  {
    id: 'pesquisa-nome',
    label: 'Pesquisa pública pelo nome “VYRA” (moda fitness)',
    kind: 'web',
    observedAt: '2026-11-20',
    note: 'Nenhuma marca de moda fitness “VYRA” confirmada no Brasil. Não confundir com “Vekyo”/“Veyko” (outra empresa) nem com o produto “VYRA Sports Bra” da loja The Folklore (EUA).',
  },
];
