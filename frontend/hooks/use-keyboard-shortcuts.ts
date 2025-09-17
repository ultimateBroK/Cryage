"use client";

import { useEffect, useCallback } from 'react';

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut =>
      shortcut.key.toLowerCase() === event.key.toLowerCase() &&
      !!shortcut.ctrlKey === event.ctrlKey &&
      !!shortcut.shiftKey === event.shiftKey &&
      !!shortcut.altKey === event.altKey
    );

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Common shortcuts for the app
export const useAppShortcuts = (
  onToggleSettings: () => void,
  onSwitchToChat: () => void,
  onSwitchToDashboard: () => void,
  onNewChat?: () => void
) => {
  const shortcuts: Shortcut[] = [
    {
      key: ',',
      ctrlKey: true,
      action: onToggleSettings,
      description: 'Open settings',
    },
    {
      key: '1',
      ctrlKey: true,
      action: onSwitchToChat,
      description: 'Switch to chat',
    },
    {
      key: '2',
      ctrlKey: true,
      action: onSwitchToDashboard,
      description: 'Switch to dashboard',
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => onNewChat?.(),
      description: 'New chat',
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
};