import { ArrowRight } from 'lucide-react';
import { useModaSite } from '../state/site';
import { Photo } from '../../../core/components/Photo';

/** Faixa editorial final (“Do studio para o seu dia.”): painel escuro + recorte de foto à direita. */
export function Editorial() {
  const { editorial } = useModaSite();
  return (
    <section aria-labelledby="editorial-title" className="container-x py-16 sm:py-24">
      <div className="m-dark relative isolate grid overflow-hidden rounded-[22px] lg:grid-cols-[1.1fr_1fr]" data-reveal>
        <div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
          <span className="block h-[3px] w-14 rounded bg-accent" aria-hidden />
          <h2 id="editorial-title" className="m-display mt-6 text-[clamp(2.4rem,8vw,4rem)] text-[var(--m-dark-text)]">
            {editorial.title.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-md text-[1rem] leading-relaxed text-[var(--m-dark-muted)]">{editorial.text}</p>
          <a href={editorial.cta.href} className="m-btn m-btn-accent mt-8 w-full justify-between sm:w-auto sm:justify-center sm:gap-3">
            {editorial.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
        <div className="relative h-72 sm:h-96 lg:h-auto" aria-hidden>
          <Photo id={editorial.photo} variant="background" sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0" imgClassName="object-cover object-[50%_12%]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--m-dark)] via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>
      </div>
    </section>
  );
}
