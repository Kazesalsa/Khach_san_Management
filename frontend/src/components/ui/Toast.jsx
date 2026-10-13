import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'success', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto bg-primary text-text-on-dark p-4 rounded-xl shadow-2xl border border-white/10 flex items-start gap-3 backdrop-blur-md"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : toast.type === 'error'
                    ? 'bg-rose-500/20 text-rose-400'
                    : toast.type === 'warning'
                    ? 'bg-amber-500/20 text-accent'
                    : 'bg-primary-dark text-accent'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {toast.type === 'success'
                    ? 'check_circle'
                    : toast.type === 'error'
                    ? 'cancel'
                    : toast.type === 'warning'
                    ? 'warning'
                    : 'info'}
                </span>
              </div>
              <div className="flex-1 pr-2">
                {toast.title && (
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-text-on-dark/80 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-text-on-dark/50 hover:text-white transition-colors p-1"
                aria-label="Đóng thông báo"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
