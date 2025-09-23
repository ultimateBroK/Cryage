"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { NotificationContainer } from '@/components/ui/notification-toast';
import { useToast } from '@/hooks/use-toast';
import { useNotifications, Notification } from '@/hooks/use-notifications';

interface NotificationContextType {
  // Toast notifications (temporary)
  toast: {
    success: (title: string, message?: string, options?: Partial<import('@/components/ui/notification-toast').ToastNotification>) => string;
    error: (title: string, message?: string, options?: Partial<import('@/components/ui/notification-toast').ToastNotification>) => string;
    warning: (title: string, message?: string, options?: Partial<import('@/components/ui/notification-toast').ToastNotification>) => string;
    info: (title: string, message?: string, options?: Partial<import('@/components/ui/notification-toast').ToastNotification>) => string;
    remove: (id: string) => void;
    clear: () => void;
  };
  
  // Persistent notifications
  persistent: {
    notifications: Notification[];
    unreadCount: number;
    unreadNotifications: Notification[];
    add: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    remove: (id: string) => void;
    clear: () => void;
    getByType: (type: Notification['type']) => Notification[];
  };
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const toast = useToast();
  const persistent = useNotifications();

  const contextValue: NotificationContextType = {
    toast: {
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
      remove: toast.removeToast,
      clear: toast.clearAllToasts,
    },
    persistent: {
      notifications: persistent.notifications,
      unreadCount: persistent.unreadCount,
      unreadNotifications: persistent.unreadNotifications,
      add: persistent.addNotification,
      markAsRead: persistent.markAsRead,
      markAllAsRead: persistent.markAllAsRead,
      remove: persistent.removeNotification,
      clear: persistent.clearAll,
      getByType: persistent.getNotificationsByType,
    },
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer
        notifications={toast.toasts}
        onRemove={toast.removeToast}
        position="top-right"
      />
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
