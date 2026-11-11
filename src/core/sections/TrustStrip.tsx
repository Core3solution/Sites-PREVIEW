import { useSite } from '../state/site';

/** Faixa com as frentes de serviço (derivada das categorias do catálogo). */
export function TrustStrip() {
  const { services } = useSite();
  const labels = services.categories.map((c) => c.label);
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {labels.map((l) => (
        <li key={l} className="flex items-center gap-10 whitespace-nowrap font-display text-sm uppercase tracking-[0.3em] text-white/55" style={{ fontStretch: '115%' }}>
          {l}
          <span className="size-1.5 rotate-45 bg-accent" aria-hidden />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative overflow-hidden border-y border-line/70 bg-surface/60 py-5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="marquee flex w-max">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
