"use client";

import { useState, useCallback, useMemo } from 'react';
import { ToastNotification } from '@/components/ui/feedback/notification-toast';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // Default 5 seconds
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast types
  const success = useCallback((title: string, message?: string, options?: Partial<ToastNotification>) => {
    return addToast({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, options?: Partial<ToastNotification>) => {
    return addToast({
      type: 'error',
      title,
      message,
      duration: 8000, // Longer duration for errors
      ...options,
    });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, options?: Partial<ToastNotification>) => {
    return addToast({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options,
    });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, options?: Partial<ToastNotification>) => {
    return addToast({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [addToast]);

  // Memoized values
  const hasToasts = useMemo(() => toasts.length > 0, [toasts.length]);
  const toastCount = useMemo(() => toasts.length, [toasts.length]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    hasToasts,
    toastCount,
  };
};
