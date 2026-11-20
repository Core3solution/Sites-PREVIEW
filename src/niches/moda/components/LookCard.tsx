import type { CSSProperties } from 'react';
import { Heart } from 'lucide-react';
import { Photo } from '../../../core/components/Photo';
import { formatBRLShort } from '../../../core/lib/format';
import { useShop } from '../state/shop';
import type { ColorSwatch, Look } from '../types';

/** “01”, “02”… (número do look com 2 dígitos). */
export const lookNumber = (n: number) => String(n).padStart(2, '0');

/** “Look 01 · Layer sálvia”. */
export const lookLabel = (look: Look) => `Look ${lookNumber(look.number)} · ${look.name}`;

/** “Sálvia e Grafite” / “Off-white, Verde-claro e Rosa”. */
export function colorNames(colors: ColorSwatch[]): string {
  const names = colors.map((c) => c.name);
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}` : (names[0] ?? '');
}

/** Cinza do fundo de estúdio das fotos (evita “emenda” quando a foto é exibida inteira, sem cortar). */
export const studioBg = 'bg-[linear-gradient(180deg,#c7c5c6_0%,#c6c4c5_55%,#bdbbbc_100%)]';

interface Props {
  look: Look;
  /** Carregamento prioritário (primeira linha da grade). */
  priority?: boolean;
  /** Atraso escalonado da animação de entrada (0, 1, 2…). */
  revealDelay?: number;
}

/**
 * Card de look da coleção: foto inteira em fundo de estúdio, favorito no canto, nome, cores e preço.
 * O card inteiro abre a visualização rápida (um único botão com área estendida; o favorito fica acima dela).
 */
export function LookCard({ look, priority = false, revealDelay }: Props) {
  const { favorites, toggleFavorite, open } = useShop();
  const fav = favorites.has(look.id);
  const label = lookLabel(look);
  const colors = colorNames(look.colors);

  return (
    <li
      className="group relative flex min-w-0 flex-col"
      data-reveal
      style={revealDelay != null ? ({ '--d': revealDelay } as CSSProperties) : undefined}
    >
      <div className={`m-photo relative aspect-[4/5] ${studioBg}`}>
        <Photo
          id={look.photo}
          variant="tile"
          badge={false}
          priority={priority}
          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, 46vw"
          className="absolute inset-0"
          imgClassName="!w-auto mx-auto block object-cover [mask-image:linear-gradient(90deg,transparent,black_14%,black_86%,transparent)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.035]"
        />
        {/* Ação discreta no hover (desktop). Decorativa: o nome acessível está no botão do card. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-1.5 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand-bg)_92%,transparent)] py-2.5 text-[0.8rem] font-semibold tracking-tight text-[var(--brand-text)] opacity-0 shadow-[0_8px_24px_-14px_rgb(0_0_0/0.45)] backdrop-blur transition-[opacity,transform] duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none [@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
        >
          Ver look
        </span>
      </div>

      <button
        type="button"
        onClick={() => toggleFavorite(look.id)}
        aria-pressed={fav}
        aria-label={`${fav ? 'Remover' : 'Adicionar'} ${label} ${fav ? 'dos' : 'aos'} favoritos`}
        className="absolute right-1 top-1 z-[3] grid size-11 place-items-center rounded-full text-[var(--brand-text)] transition-transform duration-200 active:scale-90 sm:right-2 sm:top-2"
      >
        <span className="grid size-8 place-items-center rounded-full bg-[color-mix(in_srgb,var(--brand-bg)_78%,transparent)] backdrop-blur-sm transition-colors group-hover:bg-[var(--brand-bg)]">
          <Heart className={`size-[17px] ${fav ? 'fill-current' : ''}`} strokeWidth={1.8} aria-hidden />
        </span>
      </button>

      <div className="flex min-w-0 flex-col gap-2 pt-3 sm:pt-3.5">
        <h3 className="min-w-0 text-[0.86rem] font-semibold leading-snug tracking-tight text-[var(--brand-text)] sm:text-[0.95rem]">
          <button
            type="button"
            onClick={() => open({ kind: 'look', id: look.id })}
            aria-haspopup="dialog"
            className="text-left focus-visible:!outline-none after:absolute after:inset-0 after:z-[2] after:rounded-[var(--m-radius)] after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[var(--brand-text)] focus-visible:after:[outline-style:solid]"
          >
            {label}
          </button>
        </h3>
        <div className="flex min-h-5 items-center justify-between gap-3">
          <span role="img" aria-label={`Cores: ${colors}`} title={colors} className="flex items-center gap-1.5">
            {look.colors.map((c) => (
              <span key={c.name} className="m-swatch" style={{ background: c.hex }} />
            ))}
          </span>
          <span className="text-[0.86rem] font-semibold tabular-nums tracking-tight text-[var(--brand-text)] sm:text-[0.95rem]">
            {look.price.amountCents != null ? formatBRLShort(look.price.amountCents) : 'Sob consulta'}
          </span>
        </div>
      </div>
    </li>
  );
}
