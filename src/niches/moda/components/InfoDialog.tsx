import { Dialog } from '../../../core/components/Dialog';
import { useModaSite } from '../state/site';
import { useShop } from '../state/shop';

/** Diálogo informativo (tamanhos, atendimento, entregas). Nada aqui é política da marca além do que está nos dados. */
export function InfoDialog() {
  const site = useModaSite();
  const { panel, close, open } = useShop();
  const info = panel?.kind === 'info' ? site.info.find((i) => i.id === panel.id) : undefined;
  return (
    <Dialog titleClassName="font-display text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]" open={!!info} onClose={close} title={info?.title ?? 'Informações'}>
      {info && (
        <div className="m-root !bg-transparent">
          {info.pending && (
            <p className="mb-4 inline-flex rounded-full bg-surface-2 px-3 py-1.5 text-[0.75rem] font-semibold text-text ring-1 ring-line">
              Informação pendente de confirmação
            </p>
          )}
          <div className="space-y-3 text-[0.95rem] leading-relaxed text-muted">
            {info.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {info.id === 'tamanhos' && (
            <div className="mt-6">
              <p className="m-kicker text-muted">Grade de referência</p>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tamanhos de referência">
                {site.sizes.options.map((s) => (
                  <li key={s} className="grid min-h-[44px] min-w-[52px] place-items-center rounded-[10px] border border-line bg-surface px-3 text-sm font-semibold">
                    {s}
                  </li>
                ))}
              </ul>
              {!site.sizes.confirmed && <p className="mt-3 text-[0.82rem] leading-snug text-muted">{site.sizes.note}</p>}
            </div>
          )}
          {info.id === 'atendimento' && (
            <button type="button" onClick={() => open({ kind: 'bag' })} className="m-btn m-btn-dark mt-6">
              Ver minha seleção
            </button>
          )}
        </div>
      )}
    </Dialog>
  );
}
