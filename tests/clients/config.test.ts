import type { Price } from '../../src/core/types';
import type { SiteConfig } from '../../src/niches';
import type { AutoSiteConfig } from '../../src/niches/automotivo/types';
import type { ModaSiteConfig } from '../../src/niches/moda/types';

/**
 * Regras do template válidas para TODOS os clientes em src/clients/ (de qualquer nicho, inclusive os modelos).
 * Protegem a honestidade factual: fontes, fotos sinalizadas, WhatsApp só confirmado, aviso de demonstração.
 */
const modules = import.meta.glob<{ default: SiteConfig }>('../../src/clients/*/index.ts', { eager: true });
const clients = Object.entries(modules).map(([p, m]) => [p.split('/')[4], m.default] as const);

/** Seções navegáveis de cada nicho. */
const sectionIds: Record<SiteConfig['niche'], string[]> = {
  automotivo: ['inicio', 'servicos', 'catalogo', 'solicitacao', 'galeria', 'sobre', 'avaliacoes', 'localizacao'],
  moda: ['inicio', 'categorias', 'colecao', 'studio'],
};

/** Itens com preço e categoria de cada nicho, num formato comum. */
function pricedItems(site: SiteConfig): { id: string; category: string[]; price: Price; photo?: string }[] {
  if (site.niche === 'moda') return site.looks.map((l) => ({ id: l.id, category: l.categories, price: l.price, photo: l.photo }));
  return site.catalog.items.map((i) => ({ id: i.id, category: [i.categoryId], price: i.price, photo: i.photo }));
}
const categoryIds = (site: SiteConfig) => new Set(site.niche === 'moda' ? site.categories.map((c) => c.id) : site.services.categories.map((c) => c.id));

function photoRefs(site: SiteConfig): string[] {
  if (site.niche === 'moda') {
    const m = site as ModaSiteConfig;
    return [...m.hero.photos, m.editorial.photo, ...m.looks.map((l) => l.photo)];
  }
  const a = site as AutoSiteConfig;
  return [a.hero.photo, a.hero.mobilePhoto, a.about.photo, a.finalCta.photo, ...a.services.categories.map((c) => c.photo), ...a.gallery.items.map((g) => g.photo), ...a.catalog.items.map((i) => i.photo)].filter(Boolean) as string[];
}

describe('clientes encontrados', () => {
  it('existe pelo menos o modelo e um cliente', () => {
    expect(clients.map(([k]) => k)).toContain('_modelo');
    expect(clients.length).toBeGreaterThan(1);
  });
});

describe.each(clients)('cliente %s', (_slug, site) => {
  const sourceIds = new Set(site.sources.map((s) => s.id));

  it('nicho registrado', () => {
    expect(Object.keys(sectionIds)).toContain(site.niche);
  });

  it('tem aviso de demonstração quando é prévia', () => {
    if (site.status?.preliminary) expect(site.meta.demoNotice?.short).toMatch(/não é o site oficial/);
  });

  it('itens: ids únicos, categoria existente, preço com fonte e data', () => {
    const items = pricedItems(site);
    const cats = categoryIds(site);
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
    for (const it of items) {
      expect(it.category.length).toBeGreaterThan(0);
      for (const c of it.category) expect(cats.has(c), `categoria ${c}`).toBe(true);
      expect(sourceIds.has(it.price.sourceId)).toBe(true);
      expect(it.price.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (it.price.kind !== 'on-request') expect(it.price.amountCents).toBeGreaterThan(0);
    }
  });

  it('referências de foto existem e fotos aprovadas têm alt e crédito', () => {
    for (const r of photoRefs(site)) expect(site.photos[r], `foto "${r}"`).toBeDefined();
    for (const slot of Object.values(site.photos)) {
      if (!slot.photo) continue;
      expect(slot.photo.alt.length).toBeGreaterThan(0);
      expect(slot.photo.credit.length).toBeGreaterThan(0);
      if (slot.photo.illustrative) expect(slot.photo.credit).toMatch(/[Nn]ão retrata/);
    }
  });

  it('WhatsApp só com número confirmado e fonte', () => {
    const w = site.contact.whatsapp;
    if (w) {
      expect(w.number).toMatch(/^\d{12,13}$/);
      expect(w.confirmedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(sourceIds.has(w.sourceId)).toBe(true);
    }
  });

  it('reputação, quando houver, tem fonte e data', () => {
    if (site.niche === 'automotivo' && site.reputation) {
      expect(sourceIds.has(site.reputation.sourceId)).toBe(true);
      expect(site.reputation.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('menu aponta para seções existentes', () => {
    for (const n of site.nav) expect(sectionIds[site.niche]).toContain(n.id);
    if (site.niche === 'automotivo' && !site.reputation) expect(site.nav.map((n) => n.id)).not.toContain('avaliacoes');
  });

  it('aviso de preços pede confirmação', () => {
    const d = site.niche === 'moda' ? site.collection.disclaimer : site.catalog.disclaimer;
    expect(d).toMatch(/[Cc]onsulte a empresa|a confirmar/);
  });

  it('nicho moda: sem promessas comerciais não verificadas', () => {
    if (site.niche !== 'moda') return;
    const text = JSON.stringify({ ...site, meta: { ...site.meta, demoNotice: undefined } }).toLowerCase();
    for (const t of ['frete grátis', 'parcel', 'desconto', 'cashback', 'últimas unidades']) expect(text).not.toContain(t);
    if (!site.sizes.confirmed) expect(site.sizes.note).toMatch(/confirmar/);
  });
});
