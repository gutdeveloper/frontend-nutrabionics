import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '../components/atoms/Toast';

type ToastType = 'default' | 'error' | 'success';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'default',
    visible: false,
  });

  const showToast = (message: string, type: ToastType = 'default') => {
    // Si hay un toast visible, primero lo ocultamos
    if (toast.visible) {
      setToast((prev) => ({ ...prev, visible: false }));
      
      // Breve retraso para que el efecto de transición sea visible
      setTimeout(() => {
        setToast({ message, type, visible: true });
      }, 300);
    } else {
      setToast({ message, type, visible: true });
    }
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast.visible && (
        <Toast
          message={toast.message}
          variant={toast.type}
          onClose={hideToast}
          visible={toast.visible}
          // Para mensajes de error, aumentamos la duración
          duration={toast.type === 'error' ? 5000 : 3000}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
}; 