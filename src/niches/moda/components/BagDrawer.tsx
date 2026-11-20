import { useMemo, useState } from 'react';
import { AlertTriangle, Check, Copy, Minus, MessageCircle, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Drawer } from './Drawer';
import { Dialog } from '../../../core/components/Dialog';
import { Photo } from '../../../core/components/Photo';
import { useShop } from '../state/shop';
import { useModaSite } from '../state/site';
import { useToast } from '../../../core/state/toast';
import { buildBagMessage, lookLabel, missingSizes } from '../lib/bag';
import { formatBRLShort } from '../../../core/lib/format';
import { copyText } from '../../../core/lib/clipboard';
import { whatsappUrl } from '../../../core/lib/links';

/** Sacola de atendimento: revisão de looks, tamanhos e mensagem. Sem total, sem checkout, sem envio automático. */
export function BagDrawer() {
  const site = useModaSite();
  const { panel, close, open, bag, lookById, setLineSize, setLineQty, removeLine, clearBag } = useShop();
  const toast = useToast();
  const [showError, setShowError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dialog, setDialog] = useState(false);

  const message = useMemo(
    () => buildBagMessage({ greeting: site.bag.greeting, closing: site.bag.closing, lines: bag, looks: site.looks }),
    [site.bag.greeting, site.bag.closing, site.looks, bag],
  );
  const missing = missingSizes(bag).length;
  const wa = whatsappUrl(site.contact, message);
  const isOpen = panel?.kind === 'bag';

  const doCopy = async () => {
    if (!bag.length) return;
    if (missing) {
      setShowError(true);
      return;
    }
    setShowError(false);
    const ok = await copyText(message);
    if (ok) {
      setCopied(true);
      toast('Solicitação copiada. Envie pelo canal oficial da marca.');
      window.setTimeout(() => setCopied(false), 2600);
    } else {
      toast('Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.', 'error');
    }
  };

  const howToSend = () => {
    if (missing) {
      setShowError(true);
      return;
    }
    if (wa) window.open(wa, '_blank', 'noopener,noreferrer');
    else setDialog(true);
  };

  const goCollection = () => {
    close();
    window.setTimeout(() => document.getElementById('colecao')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const footer = bag.length ? (
    <div className="flex flex-col gap-2.5">
      {showError && missing > 0 && (
        <p className="flex items-start gap-2 text-[0.85rem] font-medium" role="alert">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          Escolha o tamanho de {missing === 1 ? 'um look' : `${missing} looks`} antes de copiar a solicitação.
        </p>
      )}
      <button type="button" onClick={doCopy} className="m-btn m-btn-accent w-full">
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {copied ? 'Copiado!' : 'Copiar solicitação'}
      </button>
      <div className="flex gap-2.5">
        <button type="button" onClick={howToSend} className="m-btn m-btn-outline flex-1">
          <MessageCircle className="size-4" aria-hidden />
          {wa ? 'Enviar pelo WhatsApp' : 'Como enviar'}
        </button>
        <button
          type="button"
          onClick={() => {
            clearBag();
            setShowError(false);
          }}
          className="m-btn m-btn-outline flex-1"
        >
          <Trash2 className="size-4" aria-hidden />
          Limpar seleção
        </button>
      </div>
    </div>
  ) : undefined;

  return (
    <>
      <Drawer open={isOpen} onClose={close} title={site.bag.title} footer={footer} width="lg">
        <p className="text-[0.92rem] leading-relaxed text-muted">{site.bag.intro}</p>

        {bag.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-[18px] border border-dashed border-line px-6 py-12 text-center">
            <ShoppingBag className="size-8 text-subtle" aria-hidden />
            <p className="m-display mt-4 text-xl">Sua seleção está vazia.</p>
            <p className="mt-2 max-w-xs text-[0.9rem] text-muted">Escolha looks na coleção ou deixe a gente sugerir com três perguntas rápidas.</p>
            <div className="mt-6 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              <button type="button" className="m-btn m-btn-dark" onClick={goCollection}>
                Explorar coleção
              </button>
              <button type="button" className="m-btn m-btn-outline" onClick={() => open({ kind: 'finder' })}>
                Encontrar meu look
              </button>
            </div>
          </div>
        ) : (
          <>
            <ul className="mt-5 divide-y divide-line">
              {bag.map((line, i) => {
                const look = lookById(line.lookId);
                if (!look) return null;
                const label = lookLabel(look);
                const needsSize = line.size === null;
                return (
                  <li key={`${line.lookId}-${i}`} className="flex gap-4 py-5">
                    <div className="m-photo aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-[10px] sm:w-24">
                      <Photo id={look.photo} variant="tile" badge={false} sizes="96px" className="h-full w-full" imgClassName="object-cover object-top" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[1rem] font-bold leading-snug tracking-tight">{label}</p>
                      <p className="mt-0.5 text-[0.82rem] text-muted">Referência: {formatBRLShort(look.price.amountCents ?? 0)} por unidade</p>

                      <div role="group" aria-label={`Tamanho de ${label}`} className="mt-3">
                        <p className={`mb-1.5 text-[0.78rem] font-semibold ${needsSize ? 'text-text' : 'text-muted'}`}>
                          {needsSize ? 'Escolha o tamanho' : 'Tamanho'}
                        </p>
                        <div className={`flex flex-wrap gap-1.5 rounded-[12px] ${needsSize ? 'bg-accent/30 p-1.5 ring-1 ring-text/30' : ''}`}>
                          {site.sizes.options.map((s) => (
                            <button key={s} type="button" className="m-size" aria-pressed={line.size === s} aria-label={`Tamanho ${s}`} onClick={() => setLineSize(i, s)}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-1" role="group" aria-label={`Quantidade de ${label}`}>
                          <button type="button" className="m-icon-btn" aria-label={`Diminuir quantidade de ${label}`} disabled={line.qty <= 1} onClick={() => setLineQty(i, line.qty - 1)}>
                            <Minus className="size-4" aria-hidden />
                          </button>
                          <span className="min-w-6 text-center text-[0.95rem] font-semibold tabular-nums" aria-live="polite">
                            <span className="sr-only">Quantidade: </span>
                            {line.qty}
                          </span>
                          <button type="button" className="m-icon-btn" aria-label={`Aumentar quantidade de ${label}`} disabled={line.qty >= 9} onClick={() => setLineQty(i, line.qty + 1)}>
                            <Plus className="size-4" aria-hidden />
                          </button>
                        </div>
                        <button type="button" onClick={() => removeLine(i)} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-[0.85rem] font-medium text-muted underline underline-offset-4 hover:text-text" aria-label={`Remover ${label}`}>
                          Remover
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {!site.sizes.confirmed && <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">{site.sizes.note}</p>}

            <div className="mt-6">
              <label htmlFor="bag-message" className="text-[0.78rem] font-semibold uppercase tracking-wider text-muted">
                Revisão da mensagem
              </label>
              <textarea
                id="bag-message"
                readOnly
                value={message}
                rows={9}
                onFocus={(e) => e.currentTarget.select()}
                className="mt-2 block w-full resize-none rounded-[14px] border border-line bg-surface px-4 py-3 font-mono text-[0.78rem] leading-relaxed text-text outline-none"
              />
            </div>
          </>
        )}

        <p className="mt-6 text-[0.75rem] leading-relaxed text-subtle">{site.collection.disclaimer}</p>
      </Drawer>

      <Dialog titleClassName="font-display text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]" open={dialog && isOpen} onClose={() => setDialog(false)} title={site.bag.noWhatsappTitle} size="lg">
        <p className="text-[0.95rem] leading-relaxed text-muted">{site.bag.noWhatsappBody}</p>
        <pre className="mt-5 max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-bg/70 p-4 font-mono text-[0.78rem] leading-relaxed text-text/85">{message}</pre>
        <div className="mt-6">
          <button type="button" onClick={doCopy} className="m-btn m-btn-accent w-full sm:w-auto" data-autofocus>
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? 'Copiado!' : 'Copiar solicitação'}
          </button>
        </div>
      </Dialog>
    </>
  );
}
