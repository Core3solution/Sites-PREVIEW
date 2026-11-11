import type { CatalogItem } from '../types';
import { formatPrice } from './format';

export interface VehicleInfo {
  brand: string;
  model: string;
  year: string;
  color: string;
  notes: string;
}

export const emptyVehicle: VehicleInfo = { brand: '', model: '', year: '', color: '', notes: '' };

export interface QuoteInput {
  greeting: string;
  closing: string;
  items: CatalogItem[];
  vehicle: VehicleInfo;
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Descrição curta do veículo: "Porsche 911 · 2022 · Branco". */
export function describeVehicle(v: VehicleInfo): string {
  const name = [clean(v.brand), clean(v.model)].filter(Boolean).join(' ');
  return [name, clean(v.year), clean(v.color)].filter(Boolean).join(' · ');
}

/**
 * Monta a mensagem de solicitação em texto simples.
 * Não soma valores: cada preço é apenas referência do catálogo, sujeito a confirmação.
 */
export function buildQuoteMessage({ greeting, closing, items, vehicle }: QuoteInput): string {
  const lines: string[] = [greeting, ''];
  lines.push(items.length > 1 ? 'Serviços de interesse:' : 'Serviço de interesse:');
  for (const it of items) {
    lines.push(`• ${it.name} — referência no catálogo: ${formatPrice(it.price)}`);
  }
  const v = describeVehicle(vehicle);
  lines.push('', `Veículo: ${v || 'a informar'}`);
  const notes = vehicle.notes.trim();
  if (notes) lines.push(`Observações: ${notes}`);
  lines.push('', closing);
  return lines.join('\n');
}

export interface QuoteValidation {
  ok: boolean;
  errors: { services?: string; brand?: string; model?: string };
}

/** Pelo menos um serviço é obrigatório; marca e modelo são recomendados (avisos, não bloqueios). */
export function validateQuote(items: CatalogItem[]): QuoteValidation {
  const errors: QuoteValidation['errors'] = {};
  if (!items.length) errors.services = 'Selecione pelo menos um serviço no catálogo.';
  return { ok: !errors.services, errors };
}
