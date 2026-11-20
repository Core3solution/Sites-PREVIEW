import { Heart } from 'lucide-react';
import { Photo } from '../../../core/components/Photo';
import { scrollToHash } from '../../../core/hooks/dom';
import { formatBRLShort } from '../../../core/lib/format';
import { useModaSite } from '../state/site';
import { useShop } from '../state/shop';
import { Drawer } from './Drawer';

/** Lista de favoritos (salvos só neste navegador). */
export function FavoritesDrawer() {
  const site = useModaSite();
  const { panel, close, open, looks, favorites, toggleFavorite, setFilters } = useShop();
  const items = looks.filter((l) => favorites.has(l.id));

  const toCollection = (onlyFavorites: boolean) => {
    if (onlyFavorites) setFilters({ onlyFavorites: true });
    close();
    scrollToHash('#colecao');
  };

  return (
    <Drawer
      open={panel?.kind === 'favorites'}
      onClose={close}
      title="Favoritos"
      footer={
        items.length > 0 ? (
          <div>
            <button type="button" onClick={() => toCollection(true)} className="m-btn m-btn-dark w-full">
              Ver favoritos na coleção
            </button>
            <p className="mt-3 text-center text-[0.78rem] text-muted">Favoritos ficam salvos só neste navegador.</p>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center px-2 py-10 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-surface-2">
            <Heart className="size-6" aria-hidden />
          </span>
          <p className="m-display mt-5 text-2xl">Nada salvo ainda.</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">Toque no coração de um look para salvá-lo aqui.</p>
          <button type="button" onClick={() => toCollection(false)} className="m-btn m-btn-accent mt-6">
            Explorar coleção
          </button>
          <p className="mt-6 text-[0.78rem] text-muted">Favoritos ficam salvos só neste navegador.</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-line">
            {items.map((l) => (
              <li key={l.id} className="flex gap-4 py-4 first:pt-0">
                <Photo id={l.photo} variant="tile" badge={false} sizes="80px" className="m-photo h-28 w-[70px] shrink-0" imgClassName="object-top" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted">Look {String(l.number).padStart(2, '0')}</p>
                  <p className="font-display text-base font-bold leading-tight tracking-tight">{l.name}</p>
                  <p className="mt-1 text-sm font-semibold">{l.price.amountCents != null ? formatBRLShort(l.price.amountCents) : 'Sob consulta'}</p>
                  <ul className="mt-1.5 flex items-center gap-1.5" aria-label="Cores">
                    {l.colors.map((c) => (
                      <li key={c.name}>
                        <span className="m-swatch" style={{ background: c.hex }} title={c.name} role="img" aria-label={c.name} />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
                    <button type="button" onClick={() => open({ kind: 'look', id: l.id })} className="min-h-[44px] text-sm font-semibold underline underline-offset-4">
                      Ver look
                    </button>
                    <button type="button" onClick={() => toggleFavorite(l.id)} className="min-h-[44px] text-sm text-muted underline underline-offset-4 hover:text-text">
                      Remover
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.78rem] leading-snug text-muted">{site.collection.disclaimer}</p>
        </>
      )}
    </Drawer>
  );
}
