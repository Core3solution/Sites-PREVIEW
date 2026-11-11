import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useSite } from '../state/site';
import { useQuote } from '../state/quote';
import { Photo } from '../components/Photo';
import { SmartLink } from '../components/SmartLink';
import { Wordmark } from '../components/Wordmark';
import { formatDateBR } from '../lib/format';

export function FinalCta() {
  const { finalCta, photos } = useSite();
  const hasPhoto = !!(finalCta.photo && photos[finalCta.photo]?.photo);
  return (
    <section aria-labelledby="cta-title" className="relative py-16 sm:py-24">
      <div className="container-x">
        {/* Bloco amarelo com texto preto: a combinação principal da identidade no Instagram */}
        <div className="relative isolate overflow-hidden rounded-[32px] bg-accent px-6 py-16 text-center text-accent-ink sm:px-12 sm:py-24" data-reveal>
          {hasPhoto && finalCta.photo && <Photo id={finalCta.photo} variant="background" sizes="100vw" className="absolute inset-0 -z-10 opacity-25 mix-blend-multiply" />}
          <div className="checker absolute inset-x-0 top-0 h-3 [--c1:#111111] [--c2:var(--brand-accent)] [--s:12px]" aria-hidden />
          <div className="checker absolute inset-x-0 bottom-0 h-3 [--c1:#111111] [--c2:var(--brand-accent)] [--s:12px]" aria-hidden />
          <p className="inline-flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.28em]">
            <span className="h-px w-7 bg-accent-ink" aria-hidden />
            {finalCta.eyebrow}
            <span className="h-px w-7 bg-accent-ink" aria-hidden />
          </p>
          <h2 id="cta-title" className="display mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.3rem,9.5vw,4.6rem)] lg:text-[5.4rem]">
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[1.05rem] font-medium leading-relaxed">{finalCta.text}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={finalCta.primary.href} className="btn bg-accent-ink text-accent hover:bg-black">
              {finalCta.primary.label} <ArrowRight className="size-4" aria-hidden />
            </a>
            {finalCta.secondary && (
              <SmartLink href={finalCta.secondary.href} className="btn border border-accent-ink/70 text-accent-ink hover:bg-accent-ink/10">
                {finalCta.secondary.label} <ArrowUpRight className="size-4" aria-hidden />
              </SmartLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { nav, meta, brand, footer, sources, contact } = useSite();
  return (
    <footer className="border-t border-line bg-black/40 pb-28 pt-16 md:pb-12">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1.4fr]">
          <div>
            <Wordmark size="lg" />
            <p className="mt-5 max-w-xs text-sm text-muted">{footer.tagline}</p>
            {brand.logoPendingNote && <p className="mt-4 max-w-xs text-[0.72rem] leading-relaxed text-subtle">{brand.logoPendingNote}</p>}
          </div>
          <nav aria-label="Rodapé">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted">Navegação</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="inline-flex min-h-10 items-center text-sm text-text/80 hover:text-accent">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#solicitacao" className="inline-flex min-h-10 items-center text-sm text-text/80 hover:text-accent">
                  Solicitação
                </a>
              </li>
              {contact.instagram && (
                <li>
                  <SmartLink href={contact.instagram.url} className="inline-flex min-h-10 items-center text-sm text-text/80 hover:text-accent">
                    Instagram
                  </SmartLink>
                </li>
              )}
            </ul>
          </nav>
          <div id="aviso" className="scroll-mt-28">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">Aviso</p>
            {meta.demoNotice && (
              <>
                <p className="mt-4 font-display text-lg font-semibold leading-snug">{meta.demoNotice.short}</p>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">{meta.demoNotice.full}</p>
              </>
            )}
            <details className="mt-5 text-[0.8rem] text-muted">
              <summary className="cursor-pointer select-none py-2 text-text/80 hover:text-text">Fontes dos dados ({sources.length})</summary>
              <ul className="mt-2 flex flex-col gap-2.5">
                {sources.map((s) => (
                  <li key={s.id} className="leading-relaxed">
                    <span className="text-text/80">{s.label}</span>
                    {s.observedAt && <> · {formatDateBR(s.observedAt)}</>}
                    {s.note && <span className="block text-subtle">{s.note}</span>}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[0.75rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} · Protótipo de demonstração. Marcas e nomes pertencem aos respectivos titulares.</p>
          <p>
            Desenvolvido por <strong className="font-semibold text-text">{footer.credit.label}</strong> — {footer.credit.text}
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Barra fixa no mobile quando há serviços selecionados. */
export function MobileQuoteBar() {
  const { selectedItems } = useQuote();
  const n = selectedItems.length;
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = document.getElementById('solicitacao');
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!n || hidden) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 p-3 backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      <a href="#solicitacao" className="btn btn-primary w-full">
        Revisar solicitação · {n} {n === 1 ? 'serviço' : 'serviços'}
        <ArrowRight className="size-4" aria-hidden />
      </a>
    </div>
  );
}
