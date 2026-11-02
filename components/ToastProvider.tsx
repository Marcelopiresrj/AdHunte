'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';

export type ToastVariant = 'success' | 'info' | 'ai';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  showToast: (title: string, description?: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, description?: string, variant: ToastVariant = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, variant }]);
      setTimeout(() => {
        removeToast(id);
      }, 3400);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Top-Right Sliding Toast Stack */}
      <div
        aria-live="polite"
        className="fixed top-16 right-5 z-[100] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 56, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 56, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl bg-[#161820]/95 border border-[#C084FC]/45 shadow-[0_10px_30px_rgba(0,0,0,0.65)] backdrop-blur-md text-white"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {toast.variant === 'ai' ? (
                    <Sparkles className="w-4 h-4 text-[#C084FC]" />
                  ) : toast.variant === 'info' ? (
                    <Info className="w-4 h-4 text-[#C084FC]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#C084FC]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white leading-snug">
                    {toast.title}
                  </p>
                  {toast.description && (
                    <p className="text-[11px] text-neutral-300 mt-0.5 truncate">
                      {toast.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
                aria-label="Fechar notificação"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
