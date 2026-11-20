import type { Look } from '../types';

export interface FinderAnswers {
  activity?: string;
  palette?: string;
  length?: string;
}

export interface Recommendation {
  look: Look;
  score: number;
  /** Critérios atendidos, em texto, para explicar a sugestão. */
  reasons: ('activity' | 'palette' | 'length')[];
}

/**
 * Sugere looks pelas respostas: atividade vale 3, paleta 2, comprimento 2. Empate: ordem da coleção.
 * Sempre retorna sugestões (as mais próximas), nunca uma lista vazia.
 */
export function recommendLooks(looks: Look[], a: FinderAnswers, limit = 3): Recommendation[] {
  return looks
    .map((look) => {
      const reasons: Recommendation['reasons'] = [];
      let score = 0;
      if (a.activity && look.activities.includes(a.activity)) {
        score += 3;
        reasons.push('activity');
      }
      if (a.palette && look.palette === a.palette) {
        score += 2;
        reasons.push('palette');
      }
      if (a.length && look.length === a.length) {
        score += 2;
        reasons.push('length');
      }
      return { look, score, reasons };
    })
    .sort((x, y) => y.score - x.score || x.look.number - y.look.number)
    .slice(0, limit);
}
