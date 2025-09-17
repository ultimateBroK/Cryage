"use client";

import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'message' | 'system' | 'alert';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

const NOTIFICATIONS_STORAGE_KEY = 'cryage-notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        const notificationsWithDates = parsed.map((notif: unknown) => {
          const notifObj = notif as Record<string, unknown>;
          return {
            ...notifObj,
            createdAt: new Date(notifObj.createdAt as string),
          };
        });
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Failed to parse saved notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage
  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  }, []);

  // Add new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      isRead: false,
    };
    const updatedNotifications = [newNotification, ...notifications];
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId
        ? { ...notif, isRead: true }
        : notif
    );
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      isRead: true,
    }));
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Remove notification
  const removeNotification = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Clear all notifications
  const clearAll = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  // Get unread count
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  // Get unread notifications
  const unreadNotifications = notifications.filter(notif => !notif.isRead);

  return {
    notifications,
    unreadCount,
    unreadNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
};