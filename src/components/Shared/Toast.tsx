import { useState, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  duration?: number;
}

interface ToastState {
  message: string;
  visible: boolean;
}

export function useToastNotification() {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false });

  const showToast = useCallback((message: string, duration: number = 1500) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, duration);
  }, []);

  return { toast, showToast };
}

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-2 px-4 py-2 rounded-lg',
        'bg-card border border-border shadow-lg',
        'transition-all duration-300 ease-out',
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2 pointer-events-none'
      )}
      role="status"
      aria-live="polite"
    >
      <CheckCircle className="h-4 w-4 text-success" />
      <span className="text-sm font-medium text-foreground">{message}</span>
    </div>
  );
}
