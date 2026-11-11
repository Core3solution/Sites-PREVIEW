import { useSite } from '../state/site';

/** Logo oficial quando disponível; caso contrário, identificação textual provisória. */
export function Wordmark({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const { brand } = useSite();
  if (brand.logo) {
    return <img src={brand.logo.src} alt={brand.logo.alt} className={size === 'lg' ? 'h-14 w-auto' : 'h-10 w-auto'} />;
  }
  const big = size === 'lg';
  return (
    <span className="inline-flex flex-col items-start leading-none" aria-label={brand.name}>
      <span
        className={`font-display font-extrabold uppercase text-text ${big ? 'text-[2.1rem]' : 'text-[1.32rem]'}`}
        style={{ fontStretch: '78%', letterSpacing: '0.06em' }}
        aria-hidden
      >
        {brand.wordmark.primary}
      </span>
      <span className={`mt-1 flex items-center gap-2 ${big ? 'text-[0.72rem]' : 'text-[0.66rem]'} font-semibold uppercase text-muted`} aria-hidden>
        <span className="h-px w-4 bg-accent" />
        <span style={{ letterSpacing: big ? '0.42em' : '0.34em' }}>{brand.wordmark.secondary}</span>
      </span>
    </span>
  );
}
