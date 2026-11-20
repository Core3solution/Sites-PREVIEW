import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useDialog } from '../../../core/hooks/dom';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Conteúdo fixo no rodapé do painel (ex.: botões de ação). */
  footer?: ReactNode;
  children: ReactNode;
  /** Largura no desktop. */
  width?: 'md' | 'lg';
}

/**
 * Painel acessível: lateral direito no desktop, folha inferior no celular.
 * Foco preso, Esc fecha, clique no fundo fecha e o foco volta ao botão de origem.
 */
export function Drawer({ open, onClose, title, footer, children, width = 'md' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(open, ref, onClose);
  if (!open) return null;
  return createPortal(
    <div className="m-root fixed inset-0 z-[90]">
      <div className="fade-in absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`m-sheet absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[22px] bg-[var(--brand-bg)] shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-full md:rounded-none ${
          width === 'lg' ? 'md:max-w-[560px]' : 'md:max-w-[440px]'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-7 md:py-5">
          <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
          <button type="button" onClick={onClose} className="m-icon-btn -mr-2" aria-label="Fechar">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-7">{children}</div>
        {footer && <div className="border-t border-line px-5 py-4 md:px-7">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
