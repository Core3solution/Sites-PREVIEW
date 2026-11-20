import { useModaSite } from '../state/site';

/** Wordmark textual do nicho moda: nome em display pesado + ponto quadrado no acento (como no layout da marca). */
export function ModaWordmark({ size = 'md', tone = 'dark' }: { size?: 'md' | 'lg'; tone?: 'dark' | 'light' }) {
  const { brand } = useModaSite();
  if (brand.logo) return <img src={brand.logo.src} alt={brand.logo.alt} className={size === 'lg' ? 'h-10 w-auto' : 'h-7 w-auto'} />;
  return (
    <span className={`inline-flex items-end font-display font-extrabold leading-none tracking-[-0.02em] ${size === 'lg' ? 'text-[2.6rem]' : 'text-[1.7rem]'} ${tone === 'light' ? 'text-[var(--m-dark-text)]' : 'text-text'}`} aria-label={brand.name}>
      <span aria-hidden>{brand.wordmark.primary}</span>
      <span aria-hidden className={`ml-[0.08em] inline-block bg-accent ${size === 'lg' ? 'mb-[0.16em] size-[0.36em]' : 'mb-[0.16em] size-[0.34em]'}`} />
    </span>
  );
}
