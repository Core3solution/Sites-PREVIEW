import { companyAutoSpa as site } from '../../src/clients/company-auto-spa';
import { formatPrice } from '../../src/core/lib/format';

// Valores conferidos visualmente em anexos/02 e anexos/03 (WhatsApp, 11/11/2026).
const expected: [string, string][] = [
  ['Lavagem Premium', 'R$ 250,00'],
  ['PPF FULL GSWF', 'R$ 14.900,00'],
  ['Envelopamento de teto', 'A partir de R$ 1.500,00'],
  ['Vitrificação das rodas', 'R$ 499,00'],
  ['PPF NO FAROL', 'R$ 399,00'],
  ['PPF SMOKE NO FAROL', 'R$ 499,00'],
  ['PPF FULL', 'R$ 10.900,00'],
  ['PPF FRONTAL', 'R$ 4.499,00'],
  ['Insulfilm Carbon', 'R$ 600,00'],
  ['Polimento técnico', 'R$ 1.080,00'],
];

describe('catálogo da Company Auto SPA', () => {
  const items = [...site.catalog.items].sort((a, b) => a.sourceOrder - b.sourceOrder);

  it('tem exatamente 10 itens, na ordem da fonte', () => {
    expect(items).toHaveLength(10);
    expect(items.map((i) => i.sourceOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('preserva nomes e valores observados', () => {
    expect(items.map((i) => [i.name, formatPrice(i.price)])).toEqual(expected);
  });

  it('mantém PPF FULL e PPF FULL GSWF como itens distintos', () => {
    const gswf = items.find((i) => i.name === 'PPF FULL GSWF')!;
    const full = items.find((i) => i.name === 'PPF FULL')!;
    expect(gswf.id).not.toBe(full.id);
    expect(gswf.price.amountCents).toBe(1490000);
    expect(full.price.amountCents).toBe(1090000);
  });

  it('Envelopamento de teto é "a partir de"', () => {
    const teto = items.find((i) => i.id === 'envelopamento-teto')!;
    expect(teto.price.kind).toBe('from');
    expect(formatPrice(teto.price)).toBe('A partir de R$ 1.500,00');
  });

  it('todo preço tem fonte e data de observação 11/11/2026', () => {
    const ids = new Set(site.sources.map((s) => s.id));
    for (const it of items) {
      expect(ids.has(it.price.sourceId)).toBe(true);
      expect(it.price.observedAt).toBe('2026-11-11');
    }
  });

  it('cada item pertence a uma categoria existente', () => {
    const cats = new Set(site.services.categories.map((c) => c.id));
    for (const it of items) expect(cats.has(it.categoryId)).toBe(true);
  });

  it('não há WhatsApp sem número confirmado', () => {
    expect(site.contact.whatsapp).toBeNull();
  });

  it('o aviso de demonstração está presente', () => {
    expect(site.meta.demoNotice?.short).toBe('Demonstração conceitual CORE 3 — não é o site oficial da Company Auto SPA');
  });

  it('o aviso de preços segue o texto exigido', () => {
    expect(site.catalog.disclaimer).toBe(
      'Valores observados no catálogo em 11/11/2026. Consulte a empresa para confirmar vigência, condições e aplicação ao seu veículo.',
    );
  });

  it('reputação reflete a captura (4,9 / 55)', () => {
    expect(site.reputation?.rating).toBe(4.9);
    expect(site.reputation?.reviewCount).toBe(55);
    expect(site.reputation?.observedAt).toBe('2026-11-11');
  });

  it('toda foto aprovada tem crédito/autorização; espaços referenciados existem', () => {
    for (const slot of Object.values(site.photos)) {
      if (slot.photo) {
        expect(slot.photo.credit.length).toBeGreaterThan(0);
        expect(slot.photo.alt.length).toBeGreaterThan(0);
        // nesta versão todas as imagens são ilustrativas (IA) e precisam do aviso no crédito
        expect(slot.photo.illustrative).toBe(true);
        expect(slot.photo.credit).toMatch(/Não retrata/);
      }
    }
    const refs = [site.hero.photo, site.about.photo, site.finalCta.photo, ...site.services.categories.map((c) => c.photo), ...site.gallery.items.map((g) => g.photo)];
    for (const r of refs) if (r) expect(site.photos[r]).toBeDefined();
  });

  it('nenhum conteúdo menciona a Car Flex', () => {
    expect(JSON.stringify(site).toLowerCase()).not.toMatch(/car\s?flex/);
  });
});
