import { useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowUpRight, Car, ClipboardCheck, Copy, MessageCircle, RotateCcw, X, ListChecks } from 'lucide-react';
import { useSite } from '../state/site';
import { useQuote } from '../state/quote';
import { useToast } from '../state/toast';
import { SectionHeading } from '../components/SectionHeading';
import { Dialog } from '../components/Dialog';
import { SmartLink } from '../components/SmartLink';
import { buildQuoteMessage, describeVehicle, validateQuote, validateVehicle } from '../lib/quote';
import { VehicleForm } from '../components/quote/VehicleForm';
import { formatPrice } from '../lib/format';
import { copyText } from '../lib/clipboard';
import { whatsappUrl } from '../lib/links';

function StepTitle({ n, title, icon: Icon }: { n: number; title: string; icon: typeof Car }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-full border border-line text-[0.75rem] tabular-nums text-muted">{n}</span>
      <h3 className="font-display text-xl font-semibold tracking-tight" style={{ fontStretch: '80%' }}>
        {title}
      </h3>
      <Icon className="ml-auto size-4 text-muted" aria-hidden />
    </div>
  );
}

export function Quote() {
  const { quote, contact } = useSite();
  const { selectedItems, remove, vehicle, setVehicle, clear } = useQuote();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [showError, setShowError] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [askMissing, setAskMissing] = useState(false);
  const brandRef = useRef<HTMLInputElement>(null);

  const message = useMemo(
    () => buildQuoteMessage({ greeting: quote.greeting, closing: quote.closing, items: selectedItems, vehicle }),
    [quote.greeting, quote.closing, selectedItems, vehicle],
  );
  const validation = validateQuote(selectedItems);
  const vehicleCheck = validateVehicle(vehicle);
  const wa = whatsappUrl(contact, message);
  const missingVehicle = vehicleCheck.missingEssentials;

  /** Pré-condições comuns a copiar e enviar. Retorna true se pode seguir. */
  const ready = (force = false) => {
    if (!validation.ok) {
      setShowError(true);
      return false;
    }
    if (vehicleCheck.errors.year) {
      document.getElementById('veiculo-ano')?.focus();
      return false;
    }
    if (missingVehicle && !force) {
      setAskMissing(true);
      return false;
    }
    setAskMissing(false);
    return true;
  };

  const doCopy = async (force = false) => {
    if (!ready(force)) return;
    const ok = await copyText(message);
    if (ok) {
      setCopied(true);
      toast('Solicitação copiada. Cole no canal oficial da empresa.');
      window.setTimeout(() => setCopied(false), 2600);
    } else {
      toast('Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.', 'error');
    }
  };

  const openSend = () => {
    if (!validation.ok) {
      setShowError(true);
      return;
    }
    if (vehicleCheck.errors.year) {
      document.getElementById('veiculo-ano')?.focus();
      return;
    }
    if (wa) window.open(wa, '_blank', 'noopener,noreferrer');
    else setDialog(true);
  };

  return (
    <section id="solicitacao" aria-labelledby="solicitacao-title" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading id="solicitacao-title" eyebrow={quote.eyebrow} title={quote.title} intro={quote.intro} />

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
          <div className="flex flex-col gap-6">
            {/* 1. Serviços */}
            <div className="panel p-6 sm:p-7" data-reveal>
              <StepTitle n={1} title="Serviços selecionados" icon={ListChecks} />
              {selectedItems.length ? (
                <ul className="mt-5 divide-y divide-line">
                  {selectedItems.map((it) => (
                    <li key={it.id} className="flex items-center justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <p className="font-medium leading-snug">{it.name}</p>
                        <p className="text-[0.8rem] text-muted">Referência: {formatPrice(it.price)}</p>
                      </div>
                      <button type="button" onClick={() => remove(it.id)} className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-text" aria-label={`Remover ${it.name}`}>
                        <X className="size-4" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`mt-5 rounded-2xl border border-dashed px-5 py-6 text-sm ${showError ? 'border-red-400/60 text-red-200' : 'border-line text-muted'}`} role={showError ? 'alert' : undefined}>
                  {showError ? validation.errors.services : 'Nenhum serviço selecionado ainda.'}{' '}
                  <a href="#catalogo" className="font-medium text-accent underline underline-offset-4">
                    Abrir catálogo
                  </a>
                </div>
              )}
            </div>

            {/* 2. Veículo */}
            <form className="panel p-6 sm:p-7" onSubmit={(e) => e.preventDefault()} aria-labelledby="veiculo-title" data-reveal>
              <div id="veiculo-title">
                <StepTitle n={2} title="Seu veículo" icon={Car} />
              </div>
              <div className="mt-5">
                <VehicleForm ref={brandRef} vehicle={vehicle} onChange={setVehicle} errors={vehicleCheck.errors} highlightEssentials={askMissing} />
              </div>
              <p className="mt-4 text-[0.78rem] leading-relaxed text-muted">
                Não pedimos nome nem telefone. Nada é salvo: os dados ficam apenas nesta página até você fechá-la.
              </p>
            </form>
          </div>

          {/* 3. Revisão */}
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start" data-reveal>
            <div className="panel overflow-hidden">
              <div className="p-6 sm:p-7">
                <StepTitle n={3} title="Revisão da mensagem" icon={ClipboardCheck} />
                <div className="mt-4 flex flex-wrap gap-2 text-[0.75rem]">
                  <span className="rounded-full border border-line px-3 py-1 text-muted">
                    {selectedItems.length} {selectedItems.length === 1 ? 'serviço' : 'serviços'}
                  </span>
                  <span className={`rounded-full border px-3 py-1 ${missingVehicle ? 'border-accent/40 text-accent' : 'border-line text-muted'}`}>
                    {missingVehicle ? 'Informe marca e modelo' : describeVehicle(vehicle)}
                  </span>
                </div>
              </div>
              <div className="border-y border-line bg-bg/70">
                <label htmlFor="quote-preview" className="sr-only">Mensagem de solicitação</label>
                <textarea
                  id="quote-preview"
                  readOnly
                  value={message}
                  rows={12}
                  className="block w-full resize-none bg-transparent px-6 py-5 font-mono text-[0.8rem] leading-relaxed text-text/85 outline-none sm:px-7"
                  onFocus={(e) => e.currentTarget.select()}
                />
              </div>
              <div className="flex flex-col gap-3 p-6 sm:flex-row sm:flex-wrap sm:p-7">
                <button type="button" onClick={() => doCopy()} className="btn btn-primary sm:flex-1">
                  {copied ? <ClipboardCheck className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                  {copied ? 'Copiado!' : 'Copiar solicitação'}
                </button>
                <button type="button" onClick={openSend} className="btn btn-ghost sm:flex-1">
                  <MessageCircle className="size-4" aria-hidden />
                  {wa ? 'Enviar pelo WhatsApp' : 'Como enviar'}
                </button>
                <button type="button" onClick={() => { clear(); setShowError(false); setAskMissing(false); }} className="btn btn-quiet sm:w-full" disabled={!selectedItems.length && !describeVehicle(vehicle) && !vehicle.notes}>
                  <RotateCcw className="size-4" aria-hidden />
                  Limpar solicitação
                </button>
              </div>
              {askMissing && missingVehicle && (
                <div className="mx-6 mb-6 rounded-2xl border border-accent/50 bg-accent-soft p-4 text-sm sm:mx-7" role="alert">
                  <p className="flex items-start gap-2 text-text">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    Marca e modelo ajudam a Company a responder com valores para o seu veículo.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="btn btn-outline !min-h-10 text-[0.85rem]" onClick={() => { setAskMissing(true); brandRef.current?.focus(); }}>
                      Informar agora
                    </button>
                    <button type="button" className="btn btn-quiet !min-h-10 text-[0.85rem]" onClick={() => doCopy(true)}>
                      Copiar mesmo assim
                    </button>
                  </div>
                </div>
              )}
              {showError && !validation.ok && (
                <p className="px-6 pb-6 text-sm text-red-300 sm:px-7" role="alert">
                  {validation.errors.services}
                </p>
              )}
            </div>
            <p className="mt-4 px-1 text-[0.75rem] leading-relaxed text-muted">
              Resumo não vinculante. Os valores são referências históricas do catálogo e não são somados como orçamento final.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={dialog} onClose={() => setDialog(false)} title={quote.noWhatsappTitle} size="lg">
        <p className="text-[0.95rem] leading-relaxed text-muted">{quote.noWhatsappBody}</p>
        <pre className="mt-5 max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-bg/70 p-4 font-mono text-[0.78rem] leading-relaxed text-text/85">{message}</pre>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={() => doCopy(true)} className="btn btn-primary sm:flex-1" data-autofocus>
            {copied ? <ClipboardCheck className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? 'Copiado!' : 'Copiar solicitação'}
          </button>
          {contact.instagram && (
            <SmartLink href={contact.instagram.url} className="btn btn-ghost sm:flex-1">
              Instagram {contact.instagram.handle}
              <ArrowUpRight className="size-4" aria-hidden />
            </SmartLink>
          )}
        </div>
        {contact.linkHub && (
          <p className="mt-5 text-[0.8rem] text-muted">
            Links divulgados na bio do Instagram:{' '}
            <SmartLink href={contact.linkHub.url} className="text-text underline underline-offset-4 hover:text-accent">
              {contact.linkHub.label}
            </SmartLink>
          </p>
        )}
      </Dialog>
    </section>
  );
}
