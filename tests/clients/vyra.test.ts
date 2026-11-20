import site from '../../src/clients/vyra';
import { formatBRLShort } from '../../src/core/lib/format';

const expected: [number, string, string][] = [
  [1, 'Layer sálvia', 'R$ 790'], [2, 'Treino essencial', 'R$ 490'], [3, 'Capri ardósia', 'R$ 690'],
  [4, 'Lilás & pistache', 'R$ 590'], [5, 'Camadas leves', 'R$ 790'], [6, 'Energia retrô', 'R$ 490'],
  [7, 'Movimento livre', 'R$ 890'], [8, 'Vermelho em ação', 'R$ 590'], [9, 'Ritmo coral', 'R$ 690'],
  [10, 'Aqua leve', 'R$ 490'], [11, 'Flare lavanda', 'R$ 890'], [12, 'Studio azul', 'R$ 690'],
  [13, 'Rosê & bordô', 'R$ 790'], [14, 'Aquecimento', 'R$ 690'], [15, 'Flow azul', 'R$ 890'],
];

describe('VYRA: dados do briefing', () => {
  it('tem 15 looks numerados de 1 a 15 em ordem', () => {
    expect(site.looks).toHaveLength(15);
    expect(site.looks.map((l) => l.number)).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
  });
  it.each(expected)('look %i: %s por %s', (n, name, price) => {
    const l = site.looks[n - 1];
    expect(l.number).toBe(n);
    expect(l.name).toBe(name);
    expect(formatBRLShort(l.price.amountCents ?? -1)).toBe(price);
  });
  it('cada look tem 2+ cores nomeadas, foto, categorias e fonte do preço', () => {
    const cats = new Set(site.categories.map((c) => c.id));
    for (const l of site.looks) {
      expect(l.colors.length).toBeGreaterThanOrEqual(2);
      l.colors.forEach((c) => expect(c.name.trim()).not.toBe(''));
      expect(site.photos[l.photo], `foto de ${l.id}`).toBeDefined();
      expect(l.categories.length).toBeGreaterThan(0);
      l.categories.forEach((c) => expect(cats.has(c), `${l.id}: ${c}`).toBe(true));
      expect(l.price.sourceId).toBe('briefing-vyra');
      expect(l.price.observedAt).toBe('2026-11-20');
    }
  });
  it('não tem WhatsApp, tamanhos não confirmados e traz aviso de demonstração', () => {
    expect(site.contact.whatsapp).toBeNull();
    expect(site.sizes.confirmed).toBe(false);
    expect(site.meta.demoNotice?.short).toMatch(/não é o site oficial/i);
    expect(site.meta.demoNotice?.full.length ?? 0).toBeGreaterThan(20);
  });
  it('não contém promessas comerciais proibidas', () => {
    const text = JSON.stringify({ ...site, photos: undefined, sources: undefined }).toLowerCase();
    for (const w of ['frete grátis', 'parcel', 'desconto', 'estoque']) {
      // “estoque” só aparece na negativa do aviso (“não reserva estoque”)
      const hits = text.split(w).length - 1;
      if (w === 'estoque') expect(text.replace('não reserva estoque', '')).not.toContain(w);
      else expect(hits, w).toBe(0);
    }
  });
});
