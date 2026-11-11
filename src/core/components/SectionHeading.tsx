import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  align = 'left',
  aside,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
  align?: 'left' | 'center';
  aside?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${align === 'center' ? 'text-center md:flex-col md:items-center' : ''}`}>
      <div className={`max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`} data-reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="display mt-5 text-[2.15rem] text-balance sm:text-5xl lg:text-[3.6rem]">
          {title}
        </h2>
        {intro && <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted text-pretty">{intro}</p>}
      </div>
      {aside && <div data-reveal style={{ ['--d' as string]: 2 }}>{aside}</div>}
    </div>
  );
}
