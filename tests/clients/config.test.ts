import type { SiteConfig } from '../../src/core/types';

/**
 * Regras do template válidas para TODOS os clientes em src/clients/ (inclusive o _modelo).
 * Protegem a honestidade factual: fontes, fotos sinalizadas, WhatsApp só confirmado, aviso de demonstração.
 */
const modules = import.meta.glob<{ default: SiteConfig }>('../../src/clients/*/index.ts', { eager: true });
const clients = Object.entries(modules).map(([p, m]) => [p.split('/')[4], m.default] as const);
const sectionIds = ['inicio', 'servicos', 'catalogo', 'solicitacao', 'galeria', 'sobre', 'avaliacoes', 'localizacao'];

describe('clientes encontrados', () => {
  it('existe pelo menos o modelo e um cliente', () => {
    expect(clients.map(([k]) => k)).toContain('_modelo');
    expect(clients.length).toBeGreaterThan(1);
  });
});

describe.each(clients)('cliente %s', (_slug, site) => {
  const sourceIds = new Set(site.sources.map((s) => s.id));
  const categoryIds = new Set(site.services.categories.map((c) => c.id));

  it('tem aviso de demonstração quando é prévia', () => {
    if (site.status?.preliminary) expect(site.meta.demoNotice?.short).toMatch(/não é o site oficial/);
  });

  it('itens do catálogo: ids únicos, categoria existente, preço com fonte e data', () => {
    const ids = site.catalog.items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const it of site.catalog.items) {
      expect(categoryIds.has(it.categoryId)).toBe(true);
      expect(sourceIds.has(it.price.sourceId)).toBe(true);
      expect(it.price.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (it.price.kind !== 'on-request') expect(it.price.amountCents).toBeGreaterThan(0);
    }
  });

  it('referências de foto existem e fotos aprovadas têm alt e crédito', () => {
    const refs = [site.hero.photo, site.hero.mobilePhoto, site.about.photo, site.finalCta.photo, ...site.services.categories.map((c) => c.photo), ...site.gallery.items.map((g) => g.photo), ...site.catalog.items.map((i) => i.photo)].filter(Boolean) as string[];
    for (const r of refs) expect(site.photos[r], `foto "${r}"`).toBeDefined();
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
    if (site.reputation) {
      expect(sourceIds.has(site.reputation.sourceId)).toBe(true);
      expect(site.reputation.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('menu aponta para seções existentes', () => {
    for (const n of site.nav) expect(sectionIds).toContain(n.id);
    if (!site.reputation) expect(site.nav.map((n) => n.id)).not.toContain('avaliacoes');
  });

  it('aviso de preços menciona confirmação', () => {
    expect(site.catalog.disclaimer).toMatch(/[Cc]onsulte a empresa/);
  });
});
