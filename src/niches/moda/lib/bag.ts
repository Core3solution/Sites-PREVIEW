import type { Look } from '../types';
import { formatPrice } from '../../../core/lib/format';

export interface BagLine {
  lookId: string;
  /** Tamanho escolhido (null = ainda não escolhido). */
  size: string | null;
  qty: number;
}

export const lineKey = (l: Pick<BagLine, 'lookId' | 'size'>) => `${l.lookId}::${l.size ?? ''}`;

export const lookLabel = (look: Look) => `Look ${String(look.number).padStart(2, '0')} · ${look.name}`;

/** Linhas sem tamanho escolhido (impedem copiar a solicitação). */
export function missingSizes(lines: BagLine[]): BagLine[] {
  return lines.filter((l) => !l.size);
}

/**
 * Mensagem de atendimento em texto simples. Não soma valores nem fecha pedido:
 * cada preço é referência do briefing, sujeito a confirmação.
 */
export function buildBagMessage(opts: { greeting: string; closing: string; lines: BagLine[]; looks: Look[] }): string {
  const byId = new Map(opts.looks.map((l) => [l.id, l]));
  const out: string[] = [opts.greeting, ''];
  for (const line of opts.lines) {
    const look = byId.get(line.lookId);
    if (!look) continue;
    const size = line.size ? `tamanho ${line.size}` : 'tamanho a definir';
    out.push(`• ${lookLabel(look)} — ${size} — ${line.qty} ${line.qty === 1 ? 'unidade' : 'unidades'} — referência: ${formatPrice(look.price)}`);
    out.push(`  Peças: ${look.pieces.join(' + ')}`);
  }
  out.push('', opts.closing);
  return out.join('\n');
}
