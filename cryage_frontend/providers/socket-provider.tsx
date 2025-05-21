'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSocket } from '@/hooks/use-socket';

// Create a context for the socket
export const SocketContext = createContext<ReturnType<typeof useSocket> | undefined>(undefined);

// Hook to use the socket context
export function useSocketContext() {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }

  return context;
}

// Provider component
export function SocketProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
