import { useMemo, type ReactNode } from 'react';
import { Check, Heart } from 'lucide-react';
import { formatBRLShort } from '../../../core/lib/format';
import { Drawer } from './Drawer';
import { useShop } from '../state/shop';
import { useModaSite } from '../state/site';
import { filterLooks, priceSteps } from '../lib/filter';
import type { Length, Look, Palette } from '../types';

export const paletteLabels: Record<Palette, string> = { neutros: 'Neutros', pasteis: 'Pastéis', vibrantes: 'Vibrantes' };

export const lengthOptions: { id: Length; label: string; hint: string }[] = [
  { id: 'curto', label: 'Curto', hint: 'Shorts' },
  { id: 'medio', label: 'Médio', hint: 'Capri e bermuda' },
  { id: 'longo', label: 'Longo', hint: 'Legging e calça' },
];
export const lengthLabels = Object.fromEntries(lengthOptions.map((o) => [o.id, o.label])) as Record<Length, string>;

const palettes: Palette[] = ['neutros', 'pasteis', 'vibrantes'];

/** Amostras de cor de exemplo para cada paleta, tiradas dos próprios looks (cores distintas, até 4). */
function paletteSamples(looks: Look[], p: Palette) {
  const seen = new Map<string, { name: string; hex: string }>();
  for (const l of looks) if (l.palette === p) for (const c of l.colors) if (!seen.has(c.hex)) seen.set(c.hex, c);
  return [...seen.values()].slice(0, 4);
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line py-6 first:pt-1 last:border-b-0">
      <legend className="float-left mb-4 flex w-full items-baseline justify-between gap-3">
        <span className="font-display text-[1.02rem] font-bold tracking-tight text-[var(--brand-text)]">{title}</span>
        {hint && <span className="text-xs text-subtle">{hint}</span>}
      </legend>
      <div className="clear-both flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/** Painel de filtros da coleção (drawer). Os filtros valem na hora; “Ver N looks” fecha o painel. */
export function FiltersPanel() {
  const site = useModaSite();
  const { panel, close, filters, setFilters, resetFilters, favorites, query } = useShop();
  const isOpen = panel?.kind === 'filters';
  const steps = useMemo(() => priceSteps(site.looks), [site.looks]);
  const samples = useMemo(() => Object.fromEntries(palettes.map((p) => [p, paletteSamples(site.looks, p)])) as Record<Palette, { name: string; hex: string }[]>, [site.looks]);
  const count = useMemo(() => filterLooks(site.looks, filters, favorites, query).length, [site.looks, filters, favorites, query]);
  const favCount = site.looks.filter((l) => favorites.has(l.id)).length;

  const footer = (
    <div className="grid grid-cols-[auto_1fr] gap-3">
      <button type="button" className="m-btn m-btn-outline" onClick={resetFilters}>
        Limpar
      </button>
      <button type="button" className="m-btn m-btn-dark" onClick={close} aria-live="polite">
        {count === 0 ? 'Nenhum look — voltar' : `Ver ${count} ${count === 1 ? 'look' : 'looks'}`}
      </button>
    </div>
  );

  return (
    <Drawer open={isOpen} onClose={close} title="Filtrar looks" footer={footer}>
      <Group title="Categoria" hint="Escolha uma ou mais">
        {site.categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className="m-pill !min-h-11"
            aria-pressed={filters.categories.includes(c.id)}
            onClick={() => setFilters({ categories: toggle(filters.categories, c.id) })}
          >
            {filters.categories.includes(c.id) && <Check className="-ml-1 size-3.5" aria-hidden />}
            {c.label}
          </button>
        ))}
      </Group>

      <Group title="Paleta">
        {palettes.map((p) => {
          const on = filters.palettes.includes(p);
          const s = samples[p];
          return (
            <button
              key={p}
              type="button"
              className="m-pill !min-h-11 !pl-2.5"
              aria-pressed={on}
              onClick={() => setFilters({ palettes: toggle(filters.palettes, p) })}
              title={`Exemplos: ${s.map((c) => c.name).join(', ')}`}
            >
              <span className="flex -space-x-1" aria-hidden>
                {s.map((c) => (
                  <span key={c.hex} className="m-swatch !size-4 !ring-2 ring-[var(--brand-surface)]" style={{ background: c.hex }} />
                ))}
              </span>
              {paletteLabels[p]}
            </button>
          );
        })}
      </Group>

      <Group title="Comprimento">
        <div className="grid w-full grid-cols-3 gap-2">
          {lengthOptions.map((o) => {
            const on = filters.lengths.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilters({ lengths: toggle(filters.lengths, o.id) })}
                className={`flex min-h-16 min-w-0 flex-col items-start justify-center rounded-[12px] border px-3 py-2.5 text-left transition-colors ${
                  on ? 'border-[var(--brand-text)] bg-[var(--brand-text)] text-[var(--brand-bg)]' : 'border-line bg-surface text-[var(--brand-text)] hover:border-[var(--brand-text)]'
                }`}
              >
                <span className="text-[0.9rem] font-semibold">{o.label}</span>
                <span className={`text-xs leading-snug ${on ? 'opacity-80' : 'text-muted'}`}>{o.hint}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Preço" hint="Escolha uma faixa">
        <div role="radiogroup" aria-label="Preço máximo" className="flex flex-wrap gap-2">
          {[null, ...steps].map((v) => {
            const on = filters.maxPrice === v;
            return (
              <button
                key={v ?? 'any'}
                type="button"
                role="radio"
                aria-checked={on}
                className={`m-pill !min-h-11 tabular-nums ${on ? '!border-[var(--brand-text)] !bg-[var(--brand-text)] !text-[var(--brand-bg)]' : ''}`}
                onClick={() => setFilters({ maxPrice: v })}
              >
                {v == null ? 'Qualquer preço' : `Até ${formatBRLShort(v)}`}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Favoritos">
        <button
          type="button"
          role="switch"
          aria-checked={filters.onlyFavorites}
          onClick={() => setFilters({ onlyFavorites: !filters.onlyFavorites })}
          className="flex min-h-12 w-full items-center justify-between gap-4 rounded-[12px] border border-line bg-surface px-4 text-left"
        >
          <span className="flex items-center gap-2.5 text-[0.92rem] font-medium text-[var(--brand-text)]">
            <Heart className={`size-4 ${filters.onlyFavorites ? 'fill-current' : ''}`} aria-hidden />
            Somente favoritos
            <span className="text-xs font-normal text-muted">({favCount})</span>
          </span>
          <span
            aria-hidden
            className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${filters.onlyFavorites ? 'bg-[var(--brand-text)]' : 'bg-[color-mix(in_srgb,var(--brand-text)_18%,transparent)]'}`}
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-[var(--brand-bg)] shadow transition-[left] duration-200 ${filters.onlyFavorites ? 'left-[18px]' : 'left-0.5'}`}
            />
          </span>
        </button>
        {filters.onlyFavorites && favCount === 0 && (
          <p className="mt-1 w-full text-xs text-muted">Você ainda não marcou favoritos. Toque no coração de um look para salvá-lo.</p>
        )}
      </Group>
    </Drawer>
  );
}
