import React, { useState, useEffect } from 'react';
import { cn } from "../../lib/utils";

type ToastVariant = 'default' | 'error' | 'success';
type ToastPosition = 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  duration?: number;
  onClose?: () => void;
  visible?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  className,
  variant = 'default',
  position = 'topRight',
  message,
  duration = 3000,
  onClose,
  visible = true,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    if (visible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!isVisible) return null;

  // Mapeo de variantes a clases con colores más fuertes
  const variantClasses = {
    default: "bg-white text-gray-800 border border-gray-300",
    error: "bg-[#b70000]/80 text-white font-medium border-none",
    success: "bg-green-600 text-white font-medium border-none",
  };

  // Mapeo de posiciones a clases
  const positionClasses = {
    topRight: "top-4 right-4",
    topLeft: "top-4 left-4",
    bottomRight: "bottom-4 right-4",
    bottomLeft: "bottom-4 left-4",
  };

  return (
    <div
      className={cn(
        "fixed z-50 max-w-md p-4 rounded-md shadow-lg transition-all duration-300 transform",
        variantClasses[variant],
        positionClasses[position],
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-center justify-between">
        <p className="mr-2">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="text-sm font-medium text-white hover:opacity-80"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}; 