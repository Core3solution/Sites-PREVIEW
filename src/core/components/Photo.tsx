import { Camera } from 'lucide-react';
import { useSite } from '../state/site';
import type { PhotoSlot } from '../types';

type Variant = 'background' | 'card' | 'tile' | 'panel';

interface Props {
  id: string;
  variant: Variant;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

const posAbs = /(^|\s)(absolute|fixed)(\s|$)/;

/** Marcas de enquadramento (cantos de visor) do placeholder. */
function CropMarks() {
  const c = 'absolute size-5 border-white/25';
  return (
    <>
      <span className={`${c} left-3 top-3 border-l border-t`} />
      <span className={`${c} right-3 top-3 border-r border-t`} />
      <span className={`${c} bottom-3 left-3 border-b border-l`} />
      <span className={`${c} bottom-3 right-3 border-b border-r`} />
    </>
  );
}

export function PhotoSpec({ slot }: { slot: PhotoSlot }) {
  return (
    <span className="text-[0.7rem] tabular-nums text-white/45">
      {slot.aspect} · mín. {slot.minWidth}px
    </span>
  );
}

/**
 * Fotografia aprovada ou placeholder identificado.
 * O placeholder nunca simula uma foto: mostra o que deve ser fotografado, proporção e resolução mínima.
 */
export function Photo({ id, variant, sizes = '100vw', className = '', imgClassName = '', priority }: Props) {
  const { photos } = useSite();
  const slot = photos[id];
  const wrap = `${posAbs.test(className) ? '' : 'relative '}overflow-hidden ${className}`;
  if (!slot) return <div className={`${wrap} bg-surface-2`} aria-hidden />;

  if (slot.photo) {
    const p = slot.photo;
    const srcSet = p.variants?.map((v) => `${v.src} ${v.width}w`).join(', ');
    return (
      <div className={wrap} data-photo-status="aprovada">
        <img
          src={p.src}
          srcSet={srcSet}
          sizes={sizes}
          width={p.width}
          height={p.height}
          alt={p.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      </div>
    );
  }

  const base = (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--brand-surface-2)_0%,var(--brand-surface)_45%,var(--brand-bg)_100%)]" />
      <div className="photo-sheen absolute inset-0" />
      {variant !== 'tile' && <CropMarks />}
    </>
  );

  if (variant === 'background') {
    return (
      <div className={wrap} data-photo-status="pendente" data-photo-slot={slot.id} aria-hidden>
        {base}
      </div>
    );
  }

  return (
    <div
      className={wrap}
      data-photo-status="pendente"
      data-photo-slot={slot.id}
      role="img"
      aria-label={`Espaço reservado: ${slot.label}. Fotografia pendente.`}
    >
      {base}
      <div className={`absolute inset-0 flex flex-col ${variant === 'panel' ? 'justify-center p-8' : 'justify-end p-4 sm:p-5'} gap-2`}>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.14em] text-white/70">
          <Camera className="size-3" aria-hidden /> Fotografia pendente
        </span>
        {(variant === 'panel' || variant === 'card') && (
          <p className={`max-w-sm text-white/60 ${variant === 'panel' ? 'text-sm leading-relaxed' : 'text-[0.78rem] leading-snug'}`}>{slot.brief}</p>
        )}
        <PhotoSpec slot={slot} />
      </div>
    </div>
  );
}
