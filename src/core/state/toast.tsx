import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Toast { id: number; text: string; tone: 'ok' | 'error' }
const Ctx = createContext<(text: string, tone?: Toast['tone']) => void>(() => {});

/** Aviso discreto com região aria-live para leitores de tela. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = useCallback((text: string, tone: Toast['tone'] = 'ok') => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), text, tone });
    timer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <Ctx.Provider value={show}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex justify-center px-4 md:bottom-8">
        {toast && (
          <div key={toast.id} className="toast-in flex items-center gap-2.5 rounded-full border border-line bg-surface-2/95 px-5 py-3 text-sm text-text shadow-2xl backdrop-blur">
            {toast.tone === 'ok' ? <CheckCircle2 className="size-4 text-accent" aria-hidden /> : <AlertCircle className="size-4 text-red-400" aria-hidden />}
            {toast.text}
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
