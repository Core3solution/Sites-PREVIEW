import site from '../../src/clients/vyra';
import type { Look } from '../../src/niches/moda/types';
import { countActiveFilters, emptyFilters, filterLooks, matchesQuery, sortLooks } from '../../src/niches/moda/lib/filter';
import { recommendLooks } from '../../src/niches/moda/lib/finder';
import { buildBagMessage, lineKey, lookLabel, missingSizes } from '../../src/niches/moda/lib/bag';

const looks = site.looks;
const none = new Set<string>();
const numbers = (ls: Look[]) => ls.map((l) => l.number);

describe('filter', () => {
  it('sem filtros devolve todos os looks', () => {
    expect(filterLooks(looks, emptyFilters, none)).toHaveLength(15);
  });
  it('categoria múltipla combina por união', () => {
    const r = filterLooks(looks, { ...emptyFilters, categories: ['leggings', 'capris'] }, none);
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((l) => l.categories.some((c) => ['leggings', 'capris'].includes(c)))).toBe(true);
    expect(r.length).toBe(looks.filter((l) => l.categories.includes('leggings') || l.categories.includes('capris')).length);
  });
  it('filtra por paleta e comprimento', () => {
    const p = filterLooks(looks, { ...emptyFilters, palettes: ['vibrantes'] }, none);
    expect(numbers(p)).toEqual([6, 7, 8, 9]);
    const c = filterLooks(looks, { ...emptyFilters, lengths: ['curto'] }, none);
    expect(numbers(c)).toEqual([2, 6, 10, 14]);
    const both = filterLooks(looks, { ...emptyFilters, palettes: ['pasteis'], lengths: ['curto'] }, none);
    expect(numbers(both)).toEqual([2, 10, 14]);
  });
  it('preço máximo é inclusivo', () => {
    const r = filterLooks(looks, { ...emptyFilters, maxPrice: 59000 }, none);
    expect(numbers(r)).toEqual([2, 4, 6, 8, 10]);
  });
  it('só favoritos', () => {
    const r = filterLooks(looks, { ...emptyFilters, onlyFavorites: true }, new Set(['look-03', 'look-09']));
    expect(numbers(r)).toEqual([3, 9]);
    expect(filterLooks(looks, { ...emptyFilters, onlyFavorites: true }, none)).toEqual([]);
  });
  it('busca sem acento por nome, peça e cor', () => {
    expect(numbers(filterLooks(looks, emptyFilters, none, 'salvia'))).toContain(1);
    expect(numbers(filterLooks(looks, emptyFilters, none, 'LILAS pistache'))).toContain(4);
    expect(numbers(filterLooks(looks, emptyFilters, none, 'jaqueta'))).toEqual([14]);
    expect(numbers(filterLooks(looks, emptyFilters, none, 'bordo'))).toContain(13);
    expect(filterLooks(looks, emptyFilters, none, 'xyzinexistente')).toEqual([]);
    expect(matchesQuery(looks[0], '   ')).toBe(true);
  });
  it('ordenações', () => {
    const price = (l: Look) => l.price.amountCents ?? 0;
    const asc = sortLooks(looks, 'menor-preco');
    expect(asc.map(price)).toEqual([...asc.map(price)].sort((a, b) => a - b));
    expect(numbers(asc).slice(0, 3)).toEqual([2, 6, 10]);
    const desc = sortLooks(looks, 'maior-preco');
    expect(desc.map(price)).toEqual([...desc.map(price)].sort((a, b) => b - a));
    expect(numbers(desc).slice(0, 3)).toEqual([7, 11, 15]);
    const nome = sortLooks(looks, 'nome').map((l) => l.name);
    expect(nome).toEqual([...nome].sort((a, b) => a.localeCompare(b, 'pt-BR')));
    expect(numbers(sortLooks([...looks].reverse(), 'novidades'))).toEqual(numbers(looks));
  });
  it('countActiveFilters', () => {
    expect(countActiveFilters(emptyFilters)).toBe(0);
    expect(countActiveFilters({ categories: ['a', 'b'], palettes: ['neutros'], lengths: ['curto'], maxPrice: 50000, onlyFavorites: true })).toBe(6);
  });
});

describe('finder', () => {
  it('pontua atividade 3, paleta 2 e comprimento 2', () => {
    const [top] = recommendLooks(looks, { activity: 'pilates', palette: 'neutros', length: 'longo' }, 1);
    expect(top.score).toBe(7);
    expect(top.reasons).toEqual(['activity', 'palette', 'length']);
    expect(top.look.number).toBe(1);
  });
  it('desempata pela ordem da coleção', () => {
    const r = recommendLooks(looks, { palette: 'vibrantes' }, 4);
    expect(numbers(r.map((x) => x.look))).toEqual([6, 7, 8, 9]);
    expect(r.every((x) => x.score === 2)).toBe(true);
  });
  it('sempre retorna sugestões, mesmo sem respostas', () => {
    expect(recommendLooks(looks, {})).toHaveLength(3);
    expect(numbers(recommendLooks(looks, {}).map((x) => x.look))).toEqual([1, 2, 3]);
    expect(recommendLooks(looks, { activity: 'inexistente' }, 5)).toHaveLength(5);
  });
});

describe('bag', () => {
  const opts = (lines: { lookId: string; size: string | null; qty: number }[]) => ({ greeting: 'Olá!', closing: 'Obrigado.', lines, looks });
  it('mensagem com tamanho, quantidade e peças', () => {
    const msg = buildBagMessage(opts([{ lookId: 'look-01', size: 'M', qty: 1 }]));
    expect(msg).toContain('Olá!');
    expect(msg).toContain('Look 01 · Layer sálvia');
    expect(msg).toContain('tamanho M');
    expect(msg).toContain('1 unidade');
    expect(msg).not.toContain('1 unidades');
    expect(msg).toContain('R$ 790,00');
    expect(msg).toContain('Peças: Top de manga longa ombro a ombro sálvia + Legging grafite');
    expect(msg.trimEnd().endsWith('Obrigado.')).toBe(true);
  });
  it('tamanho a definir e plural', () => {
    const msg = buildBagMessage(opts([{ lookId: 'look-02', size: null, qty: 3 }]));
    expect(msg).toContain('tamanho a definir');
    expect(msg).toContain('3 unidades');
  });
  it('não soma valores nem usa a palavra total', () => {
    const msg = buildBagMessage(opts([{ lookId: 'look-01', size: 'P', qty: 2 }, { lookId: 'look-02', size: 'M', qty: 1 }]));
    expect(msg.toLowerCase()).not.toContain('total');
    expect(msg).not.toContain('1.580');
    expect(msg).not.toContain('2.070');
  });
  it('ignora looks desconhecidos', () => {
    expect(buildBagMessage(opts([{ lookId: 'nao-existe', size: 'M', qty: 1 }]))).not.toContain('•');
  });
  it('missingSizes e lineKey', () => {
    const lines = [{ lookId: 'a', size: null, qty: 1 }, { lookId: 'b', size: 'G', qty: 2 }];
    expect(missingSizes(lines)).toEqual([lines[0]]);
    expect(lineKey({ lookId: 'a', size: null })).toBe('a::');
    expect(lineKey({ lookId: 'a', size: 'M' })).toBe('a::M');
    expect(lineKey({ lookId: 'a', size: 'M' })).not.toBe(lineKey({ lookId: 'a', size: 'P' }));
  });
  it('lookLabel', () => {
    expect(lookLabel(looks[0])).toBe('Look 01 · Layer sálvia');
    expect(lookLabel(looks[14])).toBe('Look 15 · Flow azul');
  });
});
