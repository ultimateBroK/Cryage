"use client";

import { useState, useEffect, useCallback } from 'react';

export interface Alert {
  id: string;
  symbol: string;
  condition: 'above' | 'below' | 'rsi_above' | 'rsi_below' | 'volume_spike';
  value: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

const ALERTS_STORAGE_KEY = 'cryage-alerts';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);

  // Load alerts from localStorage on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (savedAlerts) {
      try {
        const parsed = JSON.parse(savedAlerts);
        const alertsWithDates = parsed.map((alert: any) => ({
          ...alert,
          createdAt: new Date(alert.createdAt),
          triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
        }));
        setAlerts(alertsWithDates);
      } catch (error) {
        console.error('Failed to parse saved alerts:', error);
      }
    }
  }, []);

  // Update active alerts whenever alerts change
  useEffect(() => {
    const active = alerts.filter(alert => alert.isActive && !alert.triggeredAt);
    setActiveAlerts(active);
  }, [alerts]);

  // Save alerts to localStorage
  const saveAlerts = useCallback((newAlerts: Alert[]) => {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(newAlerts));
    setAlerts(newAlerts);
  }, []);

  // Add new alert
  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'createdAt'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    const updatedAlerts = [...alerts, newAlert];
    saveAlerts(updatedAlerts);
  }, [alerts, saveAlerts]);

  // Remove alert
  const removeAlert = useCallback((alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    saveAlerts(updatedAlerts);
  }, [alerts, saveAlerts]);

  // Toggle alert active status
  const toggleAlert = useCallback((alertId: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, isActive: !alert.isActive }
        : alert
    );
    saveAlerts(updatedAlerts);
  }, [alerts, saveAlerts]);

  // Mark alert as triggered
  const triggerAlert = useCallback((alertId: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, triggeredAt: new Date() }
        : alert
    );
    saveAlerts(updatedAlerts);
  }, [alerts, saveAlerts]);

  // Clear all triggered alerts
  const clearTriggeredAlerts = useCallback(() => {
    const updatedAlerts = alerts.filter(alert => !alert.triggeredAt);
    saveAlerts(updatedAlerts);
  }, [alerts, saveAlerts]);

  return {
    alerts,
    activeAlerts,
    addAlert,
    removeAlert,
    toggleAlert,
    triggerAlert,
    clearTriggeredAlerts,
  };
};