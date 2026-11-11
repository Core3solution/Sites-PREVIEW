import { useCallback, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ArrowRight, Info } from 'lucide-react';
import { useSite } from '../state/site';
import { useQuote } from '../state/quote';
import { scrollToHash, useDialog, useScrolled, useScrollSpy } from '../hooks/dom';
import { Wordmark } from '../components/Wordmark';
import { SmartLink } from '../components/SmartLink';

export function DemoBar() {
  const { meta, status } = useSite();
  if (!meta.demoNotice) return null;
  return (
    <div className="relative z-[60] border-b border-white/5 bg-black text-[0.72rem] text-muted">
      <div className="container-x flex min-h-9 items-center justify-center gap-2 py-1.5 text-center">
        <Info className="size-3.5 shrink-0 text-accent" aria-hidden />
        <p>
          {meta.demoNotice.short}.{status?.preliminary && <span className="hidden md:inline"> Versão preliminar.</span>}{' '}
          <a href="#aviso" className="font-medium text-text underline decoration-white/30 underline-offset-4 hover:decoration-accent">
            Saiba mais
          </a>
        </p>
      </div>
    </div>
  );
}

export function Header() {
  const { nav } = useSite();
  const { selectedItems } = useQuote();
  const scrolled = useScrolled(40);
  const ids = useMemo(() => nav.map((n) => n.id), [nav]);
  const active = useScrollSpy(ids);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const count = selectedItems.length;

  return (
    <>
      <header
        className={`sticky top-[env(safe-area-inset-top,0px)] z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled ? 'border-b border-white/[0.12] bg-bg/80 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <a href="#inicio" className="shrink-0 rounded-md" aria-label="Ir para o início">
            <Wordmark />
          </a>
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    aria-current={active === n.id ? 'true' : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[0.9rem] transition-colors ${
                      active === n.id ? 'text-text' : 'text-muted hover:text-text'
                    }`}
                  >
                    {n.label}
                    <span
                      className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ${
                        active === n.id ? 'scale-x-100' : 'scale-x-0'
                      }`}
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#solicitacao" className="btn btn-outline hidden !min-h-11 sm:inline-flex">
              Orçamento
              {count > 0 ? (
                <span className="grid size-6 place-items-center rounded-full bg-accent text-[0.72rem] font-bold text-accent-ink" aria-label={`${count} selecionados`}>
                  {count}
                </span>
              ) : (
                <ArrowRight className="size-4" aria-hidden />
              )}
            </a>
            <button
              type="button"
              className="btn btn-ghost size-11 !p-0 lg:hidden"
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={close} active={active} />
    </>
  );
}

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string | null }) {
  const { nav, contact, meta } = useSite();
  const { selectedItems } = useQuote();
  const ref = useRef<HTMLDivElement>(null);
  useDialog(open, ref, onClose);
  if (!open) return null;
  const go = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const hash = e.currentTarget.getAttribute('href')!;
    onClose();
    scrollToHash(hash);
  };
  return createPortal(
    <div className="fixed inset-0 z-[70] lg:hidden">
      <div className="fade-in absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        id="menu-mobile"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="dialog-in absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-y-auto border-b border-line bg-bg px-5 pb-8"
      >
        <div className="flex h-[var(--header-h)] items-center justify-between">
          <Wordmark />
          <button type="button" className="btn btn-ghost size-11 !p-0" aria-label="Fechar menu" onClick={onClose} data-autofocus>
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <nav aria-label="Menu móvel" className="mt-4">
          <ul className="divide-y divide-line border-y border-line">
            {nav.map((n, i) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={go}
                  className={`flex min-h-14 items-center justify-between py-3 font-display text-2xl ${active === n.id ? 'text-accent' : 'text-text'}`}
                  style={{ fontStretch: '80%' }}
                >
                  <span>{n.label}</span>
                  <span className="text-xs tabular-nums text-muted">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#solicitacao" onClick={go} className="btn btn-primary mt-8 w-full">
          Montar orçamento {selectedItems.length > 0 && `(${selectedItems.length})`}
          <ArrowRight className="size-4" aria-hidden />
        </a>
        {contact.instagram && (
          <SmartLink href={contact.instagram.url} className="btn btn-ghost mt-3 w-full" showExternalIcon>
            Instagram {contact.instagram.handle}
          </SmartLink>
        )}
        {meta.demoNotice && <p className="mt-6 text-xs leading-relaxed text-muted">{meta.demoNotice.short}.</p>}
      </div>
    </div>,
    document.body,
  );
}
