import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Portal/Container */}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs shadow-lg animate-in slide-in-from-bottom-5 duration-200 ${
              t.type === 'success'
                ? 'bg-[#E6FCF5] border-[#A9E34B] text-[#099268] dark:bg-[#103024] dark:border-[#2b6045] dark:text-[#63E6BE]'
                : t.type === 'error'
                ? 'bg-[#FFF5F5] border-[#FFC9C9] text-[#E03131] dark:bg-[#341818] dark:border-[#602b2b] dark:text-[#FFA8A8]'
                : 'bg-white border-border text-foreground dark:bg-zinc-800 dark:border-zinc-700'
            }`}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#099268] dark:text-[#63E6BE]" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#E03131] dark:text-[#FFA8A8]" />
            )}
            <span className="flex-1 font-semibold">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
