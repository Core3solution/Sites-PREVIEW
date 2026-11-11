import { useState } from 'react';
import { getMedia, srcSet } from '../lib/media';

interface Props {
  media: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  alt?: string;
}

/** Imagem responsiva com placeholder desfocado e entrada suave. */
export function Media({ media, sizes, className = '', imgClassName = '', priority, alt }: Props) {
  const m = getMedia(media);
  const [loaded, setLoaded] = useState(false);
  if (!m) return <div className={`bg-surface-2 ${className}`} aria-hidden />;
  return (
    <div
      className={`${/(^|\s)(absolute|fixed)(\s|$)/.test(className) ? '' : 'relative '}overflow-hidden ${className}`}
      style={{ backgroundImage: `url(${m.placeholder})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <img
        src={m.files[m.files.length - 1].src}
        srcSet={srcSet(m)}
        sizes={sizes}
        width={m.width}
        height={m.height}
        alt={alt ?? m.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        ref={(el) => {
          if (el?.complete && el.naturalWidth) setLoaded(true);
        }}
        className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
}
