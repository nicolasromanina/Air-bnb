import React, { createContext, useContext, useMemo, useState } from 'react';

type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

type ToastContextValue = {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, 'id'>) => string;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = (t: Omit<ToastItem, 'id'>) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setToasts((s) => [{ id, ...t }, ...s]);
    // Auto remove after 5s
    setTimeout(() => setToasts((s) => s.filter(x => x.id !== id)), 5000);
    return id;
  };

  const remove = (id: string) => setToasts((s) => s.filter(x => x.id !== id));

  const value = useMemo(() => ({ toasts, push, remove }), [toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default useToast;
