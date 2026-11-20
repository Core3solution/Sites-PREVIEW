import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Dialog } from '../../../core/components/Dialog';
import { Photo } from '../../../core/components/Photo';
import { scrollToHash } from '../../../core/hooks/dom';
import { formatBRLShort } from '../../../core/lib/format';
import { useModaSite } from '../state/site';
import { useShop } from '../state/shop';
import { matchesQuery } from '../lib/filter';

/** Busca rápida: resultados ao vivo, atalhos por categoria e “ver todos” aplicando a busca na coleção. */
export function SearchOverlay() {
  const site = useModaSite();
  const { panel, close, open, looks, setQuery, setFilters } = useShop();
  const [text, setText] = useState('');
  const isOpen = panel?.kind === 'search';
  const q = text.trim();
  const results = q ? looks.filter((l) => matchesQuery(l, q)) : [];

  const onClose = () => {
    close();
    setText('');
  };
  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!q) return;
    setQuery(q);
    onClose();
    scrollToHash('#colecao');
  };
  const pickCategory = (id: string) => {
    setFilters({ categories: [id] });
    onClose();
    scrollToHash('#colecao');
  };

  return (
    <Dialog titleClassName="font-display text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]" open={isOpen} onClose={onClose} title="Buscar na coleção" size="lg">
      <div className="m-root !bg-transparent">
        <form onSubmit={submit} role="search">
          <label htmlFor="m-search-input" className="sr-only">
            Buscar looks por nome, peça ou cor
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
            <input
              id="m-search-input"
              data-autofocus
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nome, peça ou cor (ex.: legging lilás)"
              autoComplete="off"
              className="m-field !pl-12"
            />
          </div>
        </form>

        {!q ? (
          <div className="mt-6">
            <p className="m-kicker text-muted">Explorar por categoria</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {site.categories.map((c) => (
                <button key={c.id} type="button" className="m-pill" onClick={() => pickCategory(c.id)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5" aria-live="polite">
            <p className="text-sm text-muted">
              {results.length === 0 ? `Nenhum look encontrado para “${q}”.` : `${results.length} ${results.length === 1 ? 'look encontrado' : 'looks encontrados'}`}
            </p>
            {results.length > 0 && (
              <>
                <ul className="mt-2 divide-y divide-line">
                  {results.slice(0, 8).map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => open({ kind: 'look', id: l.id })}
                        className="flex w-full items-center gap-4 py-3 text-left hover:bg-surface-2/60"
                      >
                        <Photo id={l.photo} variant="tile" badge={false} sizes="56px" className="m-photo h-20 w-12 shrink-0" imgClassName="object-top" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted">Look {String(l.number).padStart(2, '0')}</span>
                          <span className="block truncate font-display text-base font-bold tracking-tight">{l.name}</span>
                          <span className="block truncate text-[0.82rem] text-muted">{l.pieces.join(' · ')}</span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold">{l.price.amountCents != null ? formatBRLShort(l.price.amountCents) : 'Sob consulta'}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => submit()} className="m-btn m-btn-dark mt-4">
                  Ver todos os resultados
                </button>
              </>
            )}
            <p className="mt-4 text-[0.78rem] leading-snug text-muted">{site.collection.disclaimer}</p>
          </div>
        )}
      </div>
    </Dialog>
  );
}
