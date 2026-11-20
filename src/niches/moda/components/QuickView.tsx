import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronLeft, ChevronRight, Heart, Ruler, ShoppingBag, X } from 'lucide-react';
import { Photo } from '../../../core/components/Photo';
import { formatBRLShort } from '../../../core/lib/format';
import { useDialog } from '../../../core/hooks/dom';
import { useToast } from '../../../core/state/toast';
import { useShop } from '../state/shop';
import { useModaSite } from '../state/site';
import { filterLooks, sortLooks } from '../lib/filter';
import { colorNames, lookLabel, lookNumber, studioBg } from './LookCard';
import type { Look } from '../types';

const price = (l: Look) => (l.price.amountCents != null ? formatBRLShort(l.price.amountCents) : 'Sob consulta');

/** Até 3 looks relacionados: mesma paleta e/ou categorias em comum (exclui o atual). */
function relatedLooks(look: Look, all: Look[]): Look[] {
  return all
    .filter((l) => l.id !== look.id)
    .map((l) => ({ l, score: (l.palette === look.palette ? 2 : 0) + l.categories.filter((c) => look.categories.includes(c)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || Math.abs(a.l.number - look.number) - Math.abs(b.l.number - look.number))
    .slice(0, 3)
    .map((x) => x.l);
}

/** Visualização rápida do look (modal): foto, preço com aviso, cores, peças, tamanho, sacola e navegação. */
export function QuickView() {
  const { panel } = useShop();
  if (panel?.kind !== 'look') return null;
  return <QuickViewModal id={panel.id} />;
}

function QuickViewModal({ id }: { id: string }) {
  const site = useModaSite();
  const { looks, lookById, filters, favorites, query, sort, toggleFavorite, addToBag, open, close } = useShop();
  const toast = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sizesRef = useRef<HTMLDivElement>(null);
  useDialog(true, ref, close);

  // Sequência de navegação: a lista filtrada no momento em que o modal abriu (estável enquanto ele estiver aberto).
  const [filtered] = useState(() => sortLooks(filterLooks(looks, filters, favorites, query), sort));
  const all = useMemo(() => sortLooks(looks, 'novidades'), [looks]);
  const look = lookById(id);
  const seq = look && filtered.some((l) => l.id === look.id) ? filtered : all;
  const index = look ? seq.findIndex((l) => l.id === look.id) : -1;

  const [sizeState, setSizeState] = useState<{ id: string; size: string | null; error: boolean; added: boolean }>({ id, size: null, error: false, added: false });
  const st = sizeState.id === id ? sizeState : { id, size: null, error: false, added: false };
  const update = (patch: Partial<typeof st>) => setSizeState({ ...st, ...patch });

  const go = (delta: number) => {
    if (index < 0 || seq.length < 2) return;
    open({ kind: 'look', id: seq[(index + delta + seq.length) % seq.length].id });
  };

  // Setas do teclado: anterior/próximo (fora de campos de texto).
  const goRef = useRef(go);
  goRef.current = go;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.closest('input, textarea, select, [contenteditable="true"]') || t.closest('[role="radiogroup"]'))) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goRef.current(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goRef.current(1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Ao trocar de look, volta ao topo dos detalhes.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    ref.current?.querySelector<HTMLElement>('[data-details]')?.scrollTo({ top: 0 });
  }, [id]);

  if (!look) return null;
  const fav = favorites.has(look.id);
  const label = lookLabel(look);
  const related = relatedLooks(look, looks);

  const add = () => {
    if (!st.size) {
      update({ error: true });
      sizesRef.current?.querySelector<HTMLElement>('button')?.focus();
      return;
    }
    addToBag(look.id, st.size);
    update({ error: false, added: true });
    toast('Look adicionado à sua seleção');
  };

  const addArea = (
    <div className="flex flex-col gap-2.5">
      <button type="button" onClick={add} className="m-btn m-btn-accent w-full">
        <ShoppingBag className="size-[18px]" aria-hidden />
        Adicionar à sacola
        {st.size && <span className="font-normal opacity-75">· {st.size}</span>}
      </button>
      {st.added && (
        <div className="flex items-center justify-between gap-3 text-[0.85rem]" role="status">
          <span className="flex items-center gap-1.5 text-[var(--brand-text)]">
            <Check className="size-4" aria-hidden /> Adicionado à seleção
          </span>
          <button type="button" onClick={() => open({ kind: 'bag' })} className="min-h-11 font-semibold text-[var(--brand-text)] underline underline-offset-4">
            Ver seleção
          </button>
        </div>
      )}
    </div>
  );

  return createPortal(
    <div className="m-root fixed inset-0 z-[90] flex items-end justify-center !bg-transparent md:items-center md:p-6">
      <div className="fade-in absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={close} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="dialog-in relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[22px] bg-[var(--brand-bg)] shadow-2xl motion-reduce:animate-none md:grid md:h-[min(780px,90dvh)] md:max-h-none md:max-w-[1060px] md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:grid-rows-[minmax(0,1fr)_auto] md:rounded-[22px]"
      >
        <button
          type="button"
          onClick={close}
          data-autofocus
          aria-label="Fechar visualização do look"
          className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full bg-[color-mix(in_srgb,var(--brand-bg)_86%,transparent)] text-[var(--brand-text)] backdrop-blur transition-colors hover:bg-[var(--brand-bg)] md:right-4 md:top-4"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:contents">
          {/* Foto */}
          <div className={`relative h-[min(46dvh,420px)] shrink-0 md:col-start-1 md:row-span-2 md:row-start-1 md:h-auto ${studioBg}`}>
            <Photo
              key={look.id}
              id={look.photo}
              variant="tile"
              badge={false}
              priority
              sizes="(min-width: 768px) 480px, 100vw"
              className="fade-in absolute inset-0 pt-4 md:pt-10"
              imgClassName="!object-contain object-bottom"
            />
            {seq.length > 1 && index >= 0 && (
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--brand-bg)_88%,transparent)] p-1 shadow-[0_10px_30px_-18px_rgb(0_0_0/0.5)] backdrop-blur md:bottom-5">
                <button type="button" onClick={() => go(-1)} className="m-icon-btn" aria-label="Look anterior">
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <span className="min-w-14 text-center text-xs font-semibold tabular-nums text-[var(--brand-text)]" aria-live="polite">
                  {index + 1} <span className="font-normal text-muted">de</span> {seq.length}
                </span>
                <button type="button" onClick={() => go(1)} className="m-icon-btn" aria-label="Próximo look">
                  <ChevronRight className="size-5" aria-hidden />
                </button>
              </div>
            )}
          </div>

          {/* Detalhes */}
          <div data-details className="min-w-0 px-5 pb-8 pt-6 md:col-start-2 md:row-start-1 md:overflow-y-auto md:overscroll-contain md:px-10 md:pb-8 md:pt-10">
            <p className="m-kicker text-muted">Look {lookNumber(look.number)}</p>
            <div className="mt-2 flex items-start justify-between gap-4 pr-12 md:pr-14">
              <h2 className="font-display text-[1.9rem] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--brand-text)] md:text-[2.4rem]">{look.name}</h2>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="font-display text-[1.45rem] font-bold tabular-nums tracking-tight text-[var(--brand-text)]">{price(look)}</p>
              <button
                type="button"
                onClick={() => toggleFavorite(look.id)}
                aria-pressed={fav}
                aria-label={`${fav ? 'Remover' : 'Adicionar'} ${label} ${fav ? 'dos' : 'aos'} favoritos`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-[0.85rem] font-medium text-[var(--brand-text)] transition-colors hover:border-[var(--brand-text)]"
              >
                <Heart className={`size-4 ${fav ? 'fill-current' : ''}`} aria-hidden />
                {fav ? 'Favorito' : 'Favoritar'}
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-subtle">{site.collection.disclaimer}</p>

            <section className="mt-7 border-t border-line pt-6" aria-labelledby="qv-cores">
              <h3 id="qv-cores" className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">
                Cores
              </h3>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2" aria-label={`Cores: ${colorNames(look.colors)}`}>
                {look.colors.map((c) => (
                  <li key={c.name} className="flex items-center gap-2 text-[0.92rem] text-[var(--brand-text)]">
                    <span className="m-swatch !size-[18px]" style={{ background: c.hex }} aria-hidden />
                    {c.name}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-6" aria-labelledby="qv-pecas">
              <h3 id="qv-pecas" className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">
                Peças do look
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {look.pieces.map((p) => (
                  <li key={p} className="flex gap-3 text-[0.94rem] leading-snug text-[var(--brand-text)]">
                    <span className="mt-[0.55em] h-px w-3 shrink-0 bg-[var(--brand-text)]" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-7 border-t border-line pt-6" aria-labelledby="qv-tam">
              <div className="flex items-center justify-between gap-4">
                <h3 id="qv-tam" className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  Tamanho{st.size && <span className="ml-2 normal-case tracking-normal text-[var(--brand-text)]">{st.size}</span>}
                </h3>
                <button
                  type="button"
                  onClick={() => open({ kind: 'info', id: 'tamanhos' })}
                  className="inline-flex min-h-11 items-center gap-1.5 text-[0.85rem] font-medium text-[var(--brand-text)] underline underline-offset-4"
                >
                  <Ruler className="size-4" aria-hidden />
                  Guia de tamanhos
                </button>
              </div>
              <div ref={sizesRef} role="group" aria-labelledby="qv-tam" aria-describedby={st.error ? 'qv-tam-erro' : undefined} className="mt-2 flex flex-wrap gap-2">
                {site.sizes.options.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`m-size ${st.error ? '!border-[#b42318]' : ''}`}
                    aria-pressed={st.size === s}
                    onClick={() => update({ size: s, error: false, added: false })}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {st.error && (
                <p id="qv-tam-erro" role="alert" className="mt-2.5 text-[0.85rem] font-medium text-[#b42318]">
                  Escolha um tamanho para adicionar o look à sacola.
                </p>
              )}
              {!site.sizes.confirmed && <p className="mt-3 text-xs leading-relaxed text-subtle">{site.sizes.note}</p>}
            </section>

            {related.length > 0 && (
              <section className="mt-8 border-t border-line pt-6" aria-labelledby="qv-complete">
                <h3 id="qv-complete" className="font-display text-lg font-bold tracking-tight text-[var(--brand-text)]">
                  Complete o look
                </h3>
                <ul className="mt-4 grid grid-cols-3 gap-3">
                  {related.map((r) => (
                    <li key={r.id} className="min-w-0">
                      <button type="button" onClick={() => open({ kind: 'look', id: r.id })} className="group flex w-full flex-col text-left" aria-label={`Ver ${lookLabel(r)}, ${price(r)}`}>
                        <span className={`m-photo relative block aspect-[4/5] ${studioBg}`}>
                          <Photo
                            id={r.photo}
                            variant="tile"
                            badge={false}
                            sizes="140px"
                            className="absolute inset-0 pt-1.5"
                            imgClassName="!object-contain object-bottom transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.04]"
                          />
                        </span>
                        <span className="mt-2 truncate text-[0.78rem] font-semibold text-[var(--brand-text)]">{r.name}</span>
                        <span className="text-xs tabular-nums text-muted">{price(r)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          </div>
        </div>

        {/* Rodapé: fixo no celular; na coluna de detalhes no desktop */}
        <div
          className="shrink-0 border-t border-line bg-[var(--brand-bg)] px-5 pt-3.5 md:col-start-2 md:row-start-2 md:px-10 md:py-5"
          style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom, 0px))' }}
        >
          {addArea}
        </div>
      </div>
    </div>,
    document.body,
  );
}
