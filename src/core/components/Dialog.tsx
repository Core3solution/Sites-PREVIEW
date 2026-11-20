import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useDialog } from '../hooks/dom';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  labelledBy?: string;
  size?: 'md' | 'lg';
  /** Classe do título; o padrão segue o estilo de título do tema (`.display`). */
  titleClassName?: string;
}

/** Diálogo modal acessível (foco preso, Esc fecha, clique no fundo fecha). */
export function Dialog({ open, onClose, title, children, size = 'md', titleClassName }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(open, ref, onClose);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
      <div className="fade-in absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`dialog-in panel relative max-h-[92dvh] w-full overflow-y-auto rounded-b-none p-6 sm:rounded-b-[24px] sm:p-8 ${size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-xl'}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className={titleClassName ?? 'display text-text text-2xl sm:text-3xl'}>{title}</h2>
          <button type="button" onClick={onClose} className="btn btn-quiet -mr-2 -mt-1 size-11 !p-0" aria-label="Fechar">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
