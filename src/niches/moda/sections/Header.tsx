import { useState, useCallback } from 'react';
import { Heart, Menu, Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { useModaSite } from '../state/site';
import { useShop } from '../state/shop';
import { scrollToHash, useScrolled } from '../../../core/hooks/dom';
import { ModaWordmark } from '../components/Wordmark';
import { Drawer } from '../components/Drawer';

/** Faixa superior escura: lançamento + aviso de demonstração (sempre visível). */
export function TopBar() {
  const { announcement, meta } = useModaSite();
  return (
    <div className="m-dark relative z-[60]">
      <div className="container-x flex min-h-9 flex-col items-center justify-center gap-0.5 py-1.5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="m-kicker !tracking-[0.2em]">{announcement}</p>
        {meta.demoNotice && (
          <p className="text-[0.72rem] text-[var(--m-dark-muted)]">
            {meta.demoNotice.short}.{' '}
            <a href="#aviso" className="font-medium text-[var(--m-dark-text)] underline underline-offset-4">
              Saiba mais
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

function Count({ n, label }: { n: number; label: string }) {
  if (!n) return null;
  return (
    <span className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[0.66rem] font-bold leading-[18px] text-accent-ink" aria-label={label}>
      {n}
    </span>
  );
}

export function Header() {
  const site = useModaSite();
  const { favorites, bagCount, open } = useShop();
  const scrolled = useScrolled(24);
  const [menu, setMenu] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);

  return (
    <>
      <header
        className={`sticky top-[env(safe-area-inset-top,0px)] z-50 border-b transition-[background-color,border-color] duration-300 ${
          scrolled ? 'border-line bg-[color-mix(in_srgb,var(--brand-bg)_88%,transparent)] backdrop-blur-xl' : 'border-transparent bg-bg'
        }`}
      >
        <div className="container-x flex h-[68px] items-center gap-4 lg:h-[76px]">
          <button type="button" className="m-icon-btn -ml-2 lg:hidden" aria-label="Abrir menu" aria-expanded={menu} onClick={() => setMenu(true)}>
            <Menu className="size-5" aria-hidden />
          </button>
          <a href="#inicio" className="rounded-md" aria-label={`${site.brand.name} — início`}>
            <ModaWordmark />
          </a>
          <span className="mx-3 hidden h-7 w-px bg-line lg:block" aria-hidden />
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="rounded-lg px-3.5 py-2 text-[0.92rem] font-medium text-text/80 transition-colors hover:text-text">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <span className="mr-2 hidden h-7 w-px bg-line lg:block" aria-hidden />
            <button type="button" className="m-icon-btn" aria-label="Buscar looks" onClick={() => open({ kind: 'search' })}>
              <Search className="size-[1.2rem]" aria-hidden />
            </button>
            <button type="button" className="m-icon-btn relative" aria-label={`Favoritos${favorites.size ? ` (${favorites.size})` : ''}`} onClick={() => open({ kind: 'favorites' })}>
              <Heart className="size-[1.2rem]" aria-hidden />
              <Count n={favorites.size} label={`${favorites.size} favoritos`} />
            </button>
            <button type="button" className="m-icon-btn relative" aria-label={`Sua seleção${bagCount ? ` (${bagCount})` : ''}`} onClick={() => open({ kind: 'bag' })}>
              <ShoppingBag className="size-[1.2rem]" aria-hidden />
              <Count n={bagCount} label={`${bagCount} itens na seleção`} />
            </button>
          </div>
        </div>
      </header>

      <Drawer open={menu} onClose={closeMenu} title="Menu">
        <nav aria-label="Menu móvel">
          <ul className="divide-y divide-line border-y border-line">
            {site.nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    closeMenu();
                    scrollToHash(`#${n.id}`);
                  }}
                  className="flex min-h-14 items-center justify-between font-display text-2xl font-bold tracking-tight">
                  {n.label}
                  <ArrowRight className="size-5 text-muted" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="m-btn m-btn-accent mt-6 w-full"
          onClick={() => {
            closeMenu();
            open({ kind: 'finder' });
          }}
        >
          {site.hero.finderCtaLabel}
        </button>
        <ul className="mt-6 flex flex-col gap-1 text-[0.95rem]">
          {site.info.map((i) => (
            <li key={i.id}>
              <button
                type="button"
                className="min-h-11 w-full text-left font-medium text-muted hover:text-text"
                onClick={() => {
                  closeMenu();
                  open({ kind: 'info', id: i.id });
                }}
              >
                {i.title}
              </button>
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
}
