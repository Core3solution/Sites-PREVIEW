import { companyAutoSpa as site } from '../src/clients/company-auto-spa';
import { formatBRL, formatDateBR, normalize } from '../src/core/lib/format';
import { filterCatalog } from '../src/core/lib/catalog';
import { buildQuoteMessage, describeVehicle, emptyVehicle, validateQuote } from '../src/core/lib/quote';
import { whatsappUrl, mapsUrl, wazeUrl } from '../src/core/lib/links';

const { items } = site.catalog;
const cats = site.services.categories;

describe('format', () => {
  it('formata BRL com espaço normal', () => {
    expect(formatBRL(1490000)).toBe('R$ 14.900,00');
    expect(formatBRL(25000)).toBe('R$ 250,00');
  });
  it('data e normalização', () => {
    expect(formatDateBR('2026-11-11')).toBe('11/11/2026');
    expect(normalize('Vitrificação')).toBe('vitrificacao');
  });
});

describe('filterCatalog', () => {
  const base = { query: '', categoryId: 'all', sort: 'source' as const };
  it('busca sem acento e por múltiplos termos', () => {
    expect(filterCatalog(items, cats, { ...base, query: 'vitrificacao' }).map((i) => i.id)).toEqual(['vitrificacao-rodas']);
    expect(filterCatalog(items, cats, { ...base, query: 'ppf farol' }).map((i) => i.id)).toEqual(['ppf-farol', 'ppf-smoke-farol']);
  });
  it('filtra por categoria', () => {
    expect(filterCatalog(items, cats, { ...base, categoryId: 'ppf' })).toHaveLength(5);
  });
  it('ordena por preço', () => {
    const asc = filterCatalog(items, cats, { ...base, sort: 'price-asc' });
    expect(asc[0].id).toBe('lavagem-premium');
    expect(asc.at(-1)!.id).toBe('ppf-full-gswf');
  });
  it('somente selecionados', () => {
    const r = filterCatalog(items, cats, { ...base, onlySelected: true, selectedIds: new Set(['ppf-full']) });
    expect(r.map((i) => i.id)).toEqual(['ppf-full']);
  });
});

describe('mensagem de solicitação', () => {
  const pick = (...ids: string[]) => items.filter((i) => ids.includes(i.id));
  it('lista serviços com referência, veículo e aviso, sem somar valores', () => {
    const msg = buildQuoteMessage({
      greeting: site.quote.greeting,
      closing: site.quote.closing,
      items: pick('ppf-full', 'envelopamento-teto'),
      vehicle: { ...emptyVehicle, brand: ' Porsche ', model: '911', year: '2022', notes: 'Capô' },
    });
    expect(msg).toContain('• Envelopamento de teto — referência no catálogo: A partir de R$ 1.500,00');
    expect(msg).toContain('• PPF FULL — referência no catálogo: R$ 10.900,00');
    expect(msg).toContain('Veículo: Porsche 911 · 2022');
    expect(msg).toContain('Observações: Capô');
    expect(msg).toContain('11/11/2026');
    expect(msg).not.toMatch(/total/i);
  });
  it('veículo vazio vira "a informar"', () => {
    const msg = buildQuoteMessage({ greeting: 'Olá', closing: 'Fim', items: pick('ppf-full'), vehicle: emptyVehicle });
    expect(msg).toContain('Veículo: a informar');
    expect(describeVehicle(emptyVehicle)).toBe('');
  });
  it('exige ao menos um serviço', () => {
    expect(validateQuote([]).ok).toBe(false);
    expect(validateQuote(pick('ppf-full')).ok).toBe(true);
  });
});

describe('links', () => {
  it('sem número confirmado não gera link de WhatsApp', () => {
    expect(whatsappUrl(site.contact, 'oi')).toBeNull();
  });
  it('com número confirmado gera wa.me', () => {
    const c = { ...site.contact, whatsapp: { number: '5511900000000', confirmedAt: '2026-01-01', sourceId: 'x' } };
    expect(whatsappUrl(c, 'oi tudo')).toBe('https://wa.me/5511900000000?text=oi%20tudo');
  });
  it('mapas e waze codificam o endereço', () => {
    expect(mapsUrl('Rua A, 1')).toBe('https://www.google.com/maps/search/?api=1&query=Rua%20A%2C%201');
    expect(wazeUrl('Rua A')).toContain('waze.com/ul?q=Rua%20A');
  });
});
