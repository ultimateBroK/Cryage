"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/base/button';
import { cn } from '@/utils';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

interface NotificationToastProps {
  notification: ToastNotification;
  onRemove: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'text-green-500 bg-green-50 border-green-200',
  error: 'text-red-500 bg-red-50 border-red-200',
  warning: 'text-yellow-500 bg-yellow-50 border-yellow-200',
  info: 'text-blue-500 bg-blue-50 border-blue-200',
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onRemove,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = iconMap[notification.type];

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onRemove(notification.id), 300);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, notification.id, onRemove]);

  const handleClose = () => {
    setIsVisible(false);
    notification.onClose?.();
    setTimeout(() => onRemove(notification.id), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
            'bg-background/95 border-border/50',
            'min-w-[320px] max-w-[480px]',
            colorMap[notification.type]
          )}
        >
          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-foreground">
              {notification.title}
            </h4>
            {notification.message && (
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
            )}
            {notification.action && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 h-7 text-xs"
                onClick={notification.action.onClick}
              >
                {notification.action.label}
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface NotificationContainerProps {
  notifications: ToastNotification[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove,
  position = 'top-right',
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-2 pointer-events-none',
      positionClasses[position]
    )}>
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationToast
            notification={notification}
            onRemove={onRemove}
          />
        </div>
      ))}
    </div>
  );
};
