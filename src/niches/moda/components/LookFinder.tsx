import { useMemo, useState } from 'react';
import { ArrowLeft, Heart, RotateCcw } from 'lucide-react';
import { Dialog } from '../../../core/components/Dialog';
import { Photo } from '../../../core/components/Photo';
import { scrollToHash } from '../../../core/hooks/dom';
import { formatBRLShort } from '../../../core/lib/format';
import { useModaSite } from '../state/site';
import { useShop } from '../state/shop';
import { recommendLooks, type FinderAnswers } from '../lib/finder';

/** “Encontrar meu look”: 3 perguntas, uma por vez, e 3 sugestões de estilo (não é prova de ajuste nem promessa técnica). */
export function LookFinder() {
  const site = useModaSite();
  const { panel, close, open, favorites, toggleFavorite } = useShop();
  const isOpen = panel?.kind === 'finder';
  const questions = site.finder.questions;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FinderAnswers>({});

  const done = step >= questions.length;
  const recs = useMemo(() => (done ? recommendLooks(site.looks, answers) : []), [done, site.looks, answers]);

  const reset = () => {
    setStep(0);
    setAnswers({});
  };
  const onClose = () => {
    close();
    reset();
  };
  const toCollection = () => {
    onClose();
    scrollToHash('#colecao');
  };

  const optionLabel = (key: keyof FinderAnswers, id?: string) => {
    if (!id) return null;
    return questions.find((q) => q.key === key)?.options.find((o) => o.id === id)?.label ?? null;
  };

  const q = questions[step];

  return (
    <Dialog titleClassName="font-display text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]" open={isOpen} onClose={onClose} title={site.finder.title} size="lg">
      <div className="m-root !bg-transparent">
        {!done && q && (
          <div>
            <p className="max-w-xl text-sm leading-relaxed text-muted">{site.finder.intro}</p>
            <div className="mt-6 flex items-center gap-3" role="status" aria-live="polite">
              <span className="m-kicker text-muted">
                {step + 1} de {questions.length}
              </span>
              <span className="flex flex-1 gap-1.5" aria-hidden>
                {questions.map((_, i) => (
                  <span key={i} className={`h-[3px] flex-1 rounded-full ${i <= step ? 'bg-text' : 'bg-line'}`} />
                ))}
              </span>
            </div>
            <h3 className="m-display mt-5 text-[1.6rem] sm:text-3xl">{q.title}</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {q.options.map((o) => {
                const selected = answers[q.key] === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [q.key]: o.id }));
                      setStep((s) => s + 1);
                    }}
                    className={`flex min-h-[64px] flex-col justify-center rounded-[14px] border px-5 py-3.5 text-left transition-colors ${
                      selected ? 'border-text bg-text text-bg' : 'border-line bg-surface hover:border-text'
                    }`}
                  >
                    <span className="text-[1rem] font-semibold">{o.label}</span>
                    {o.hint && <span className={`mt-0.5 text-[0.8rem] ${selected ? 'opacity-80' : 'text-muted'}`}>{o.hint}</span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-7 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="m-btn m-btn-outline">
                  <ArrowLeft className="size-4" aria-hidden /> Voltar
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => {
                  setAnswers((a) => {
                    const n = { ...a };
                    delete n[q.key];
                    return n;
                  });
                  setStep((s) => s + 1);
                }}
                className="min-h-[44px] px-3 text-sm font-medium text-muted underline underline-offset-4 hover:text-text"
              >
                Pular
              </button>
            </div>
          </div>
        )}

        {done && (
          <div>
            <p className="m-kicker text-muted">Sugestões para você</p>
            <h3 className="m-display mt-3 text-[1.6rem] sm:text-3xl">Três looks para começar.</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              É uma sugestão de estilo, baseada nas suas respostas, e não uma indicação técnica nem de tamanho. Os valores são os observados no catálogo; {site.collection.disclaimer}
            </p>
            <ul className="mt-6 grid gap-3">
              {recs.map(({ look, reasons }) => {
                const fav = favorites.has(look.id);
                const why = [
                  reasons.includes('activity') ? optionLabel('activity', answers.activity)?.toLowerCase() : null,
                  reasons.includes('palette') ? optionLabel('palette', answers.palette)?.toLowerCase() : null,
                  reasons.includes('length') ? optionLabel('length', answers.length)?.toLowerCase() : null,
                ].filter(Boolean);
                return (
                  <li key={look.id} className="m-card flex items-stretch gap-4 border border-line p-3">
                    <Photo
                      id={look.photo}
                      variant="tile"
                      badge={false}
                      sizes="96px"
                      className="m-photo w-20 shrink-0 self-stretch sm:w-24"
                      imgClassName="object-top"
                    />
                    <div className="flex min-w-0 flex-1 flex-col py-1">
                      <p className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted">Look {String(look.number).padStart(2, '0')}</p>
                      <p className="font-display text-lg font-bold leading-tight tracking-tight">{look.name}</p>
                      <p className="mt-1 text-sm font-semibold">{look.price.amountCents != null ? formatBRLShort(look.price.amountCents) : 'Sob consulta'}</p>
                      <p className="mt-1.5 text-[0.82rem] leading-snug text-muted">
                        {why.length ? `Combina com: ${why.join(' · ')}` : 'Sugestão mais próxima do que você escolheu'}
                      </p>
                      <div className="mt-auto flex items-center gap-2 pt-3">
                        <button type="button" onClick={() => open({ kind: 'look', id: look.id })} className="m-btn m-btn-dark !min-h-[44px] !px-4 text-sm">
                          Ver look
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(look.id)}
                          aria-pressed={fav}
                          aria-label={fav ? `Remover ${look.name} dos favoritos` : `Favoritar ${look.name}`}
                          className="m-icon-btn"
                        >
                          <Heart className="size-5" fill={fav ? 'currentColor' : 'none'} aria-hidden />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button type="button" onClick={toCollection} className="m-btn m-btn-accent">
                Ver coleção completa
              </button>
              <button type="button" onClick={reset} className="m-btn m-btn-outline">
                <RotateCcw className="size-4" aria-hidden /> Refazer
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
