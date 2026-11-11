import type { Price } from '../types';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

/** Formata centavos como moeda brasileira (ex.: 1490000 → "R$ 14.900,00"). Usa espaço comum. */
export function formatBRL(cents: number): string {
  return brl.format(cents / 100).replace(/ /g, ' ');
}

/** Texto do preço respeitando o tipo: fixo, "A partir de" ou "Sob consulta". */
export function formatPrice(price: Price): string {
  if (price.kind === 'on-request' || price.amountCents == null) return 'Sob consulta';
  const value = formatBRL(price.amountCents);
  return price.kind === 'from' ? `A partir de ${value}` : value;
}

/** "2026-11-11" → "11/11/2026" sem depender de fuso horário. */
export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function formatRating(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** Remove acentos e caixa para busca tolerante. */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
