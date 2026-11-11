import { Star } from 'lucide-react';
import { useSite } from '../state/site';

/** Faixa amarela com bordas quadriculadas — linguagem visual do Instagram/estúdio da empresa. */
export function TrustStrip() {
  const { services } = useSite();
  const labels = services.categories.map((c) => c.label);
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {labels.map((l) => (
        <li key={l} className="flex items-center gap-8 whitespace-nowrap font-display text-[1.35rem] font-black uppercase text-accent-ink" style={{ fontStretch: '72%', letterSpacing: '0.04em' }}>
          {l}
          <Star className="size-4 fill-accent-ink text-accent-ink" aria-hidden />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative bg-accent" role="region" aria-label="Serviços">
      <div className="checker h-2.5" aria-hidden />
      <div className="overflow-hidden py-3.5">
        <div className="marquee flex w-max">
          {row()}
          {row(true)}
        </div>
      </div>
      <div className="checker h-2.5" aria-hidden />
    </div>
  );
}
