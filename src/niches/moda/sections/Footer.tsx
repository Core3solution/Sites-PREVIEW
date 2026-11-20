import { useModaSite } from '../state/site';
import { useShop } from '../state/shop';
import { ModaWordmark } from '../components/Wordmark';
import { formatDateBR } from '../../../core/lib/format';

export function Footer() {
  const site = useModaSite();
  const { open } = useShop();
  return (
    <footer className="border-t border-line bg-surface pb-12 pt-14">
      <div className="container-x">
        <div className="flex flex-col gap-8 border-b border-line pb-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <ModaWordmark />
            <span className="hidden h-7 w-px bg-line sm:block" aria-hidden />
            <p className="hidden text-sm text-muted sm:block">{site.footer.tagline}</p>
          </div>
          <ul className="grid grid-cols-1 gap-1 sm:flex sm:gap-8">
            {site.info.map((i) => (
              <li key={i.id}>
                <button type="button" onClick={() => open({ kind: 'info', id: i.id })} className="min-h-11 text-left text-[0.92rem] font-medium hover:underline hover:underline-offset-4">
                  {i.title}
                  <span className="block text-[0.75rem] font-normal text-subtle">{i.summary}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[1fr_1.3fr]">
          <nav aria-label="Rodapé">
            <p className="m-kicker text-subtle">Navegação</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:max-w-sm">
              {site.nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="inline-flex min-h-10 items-center text-sm text-text/80 hover:text-text">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => open({ kind: 'finder' })} className="inline-flex min-h-10 items-center text-sm text-text/80 hover:text-text">
                  {site.hero.finderCtaLabel}
                </button>
              </li>
            </ul>
            {site.brand.logoPendingNote && <p className="mt-6 max-w-sm text-[0.75rem] leading-relaxed text-subtle">{site.brand.logoPendingNote}</p>}
          </nav>
          <div id="aviso" className="scroll-mt-28">
            <p className="m-kicker text-subtle">Aviso</p>
            {site.meta.demoNotice && (
              <>
                <p className="mt-4 font-display text-lg font-bold leading-snug">{site.meta.demoNotice.short}</p>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">{site.meta.demoNotice.full}</p>
              </>
            )}
            {site.status && <p className="mt-3 text-[0.82rem] leading-relaxed text-muted">{site.status.note}</p>}
            <details className="mt-5 text-[0.82rem] text-muted">
              <summary className="cursor-pointer select-none py-2 font-medium text-text">Fontes dos dados ({site.sources.length})</summary>
              <ul className="mt-2 flex flex-col gap-2.5">
                {site.sources.map((s) => (
                  <li key={s.id} className="leading-relaxed">
                    <span className="text-text">{s.label}</span>
                    {s.observedAt && <> · {formatDateBR(s.observedAt)}</>}
                    {s.note && <span className="block text-subtle">{s.note}</span>}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[0.78rem] text-subtle sm:flex-row sm:justify-between">
          <p>Protótipo de demonstração. Marcas e nomes pertencem aos respectivos titulares.</p>
          <p>
            Desenvolvido por <strong className="font-semibold text-text">{site.footer.credit.label}</strong> — {site.footer.credit.text}
          </p>
        </div>
      </div>
    </footer>
  );
}
