import { useEffect, useState, useRef, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';
import {
  SocketEvent,
  SubscriptionType,
  formatChannel,
  SystemMessagePayload,
  MarketUpdatePayload,
  AnalysisUpdatePayload,
  isMarketUpdate,
  isAnalysisUpdate,
  isSystemMessage
} from '@/types/socket';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000/ws';

export type SubscriptionCallback<T> = (data: T) => void;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [systemMessages, setSystemMessages] = useState<SystemMessagePayload[]>([]);
  const [subscribedChannels, setSubscribedChannels] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbacksRef = useRef<Map<string, Set<SubscriptionCallback<any>>>>(new Map());
  const [latency, setLatency] = useState<number | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      transports: ['websocket'],
    });

    socket.on(SocketEvent.CONNECT, () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socket.on(SocketEvent.DISCONNECT, () => {
      setIsConnected(false);
      console.log('Socket disconnected');
      // Clear subscribed channels on disconnect
      setSubscribedChannels([]);
    });

    socket.on(SocketEvent.CONNECT_ERROR, (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on(SocketEvent.CONNECTION_ESTABLISHED, (data) => {
      console.log('Connection established', data);
      // Resubscribe to previous channels if reconnecting
      if (subscribedChannels.length > 0) {
        subscribedChannels.forEach(channel => {
          socket.emit(SocketEvent.SUBSCRIBE, { channel });
        });
      }
    });

    socket.on(SocketEvent.SUBSCRIPTION_SUCCESS, (data) => {
      console.log('Subscription successful:', data);
      setSubscribedChannels(prev => {
        if (!prev.includes(data.channel)) {
          return [...prev, data.channel];
        }
        return prev;
      });
    });

    socket.on(SocketEvent.SUBSCRIPTION_CLOSED, (data) => {
      console.log('Subscription closed:', data);
      setSubscribedChannels(prev => prev.filter(channel => channel !== data.channel));
    });

    socket.on(SocketEvent.SYSTEM_MESSAGE, (message: SystemMessagePayload) => {
      if (isSystemMessage(message)) {
        setSystemMessages(prev => [...prev, message]);
      }
    });

    socket.on(SocketEvent.MARKET_UPDATE, (data: MarketUpdatePayload) => {
      if (isMarketUpdate(data)) {
        setLastMessage(data);
        const channel = formatChannel('market', data.symbol, data.timeframe);
        triggerCallbacks(channel, data);
      }
    });

    socket.on(SocketEvent.ANALYSIS_UPDATE, (data: AnalysisUpdatePayload) => {
      if (isAnalysisUpdate(data)) {
        setLastMessage(data);
        const channel = formatChannel('analysis', data.symbol, data.timeframe);
        triggerCallbacks(channel, data);
      }
    });

    socket.on(SocketEvent.PONG, (data) => {
      const roundTripTime = Date.now() - data.clientTime;
      setLatency(roundTripTime);
    });

    socketRef.current = socket;

    // Set up ping interval for health checks
    pingIntervalRef.current = setInterval(() => {
      if (socket && socket.connected) {
        socket.emit(SocketEvent.PING, { clientTime: Date.now(), timestamp: Date.now() });
      }
    }, 30000); // Send ping every 30 seconds

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      socket.disconnect();
    };
  }, [subscribedChannels]);

  // Helper function to trigger callbacks for a channel
  const triggerCallbacks = useCallback(<T>(channel: string, data: T) => {
    const callbacks = callbacksRef.current.get(channel);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in callback for channel ${channel}:`, error);
        }
      });
    }
  }, []);

  // Function to subscribe to a channel
  const subscribe = useCallback((channel: string, callback?: SubscriptionCallback<any>) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(SocketEvent.SUBSCRIBE, { channel, timestamp: Date.now() });

      // Add callback if provided
      if (callback) {
        const callbacks = callbacksRef.current.get(channel) || new Set();
        callbacks.add(callback);
        callbacksRef.current.set(channel, callbacks);
      }

      return true;
    }
    return false;
  }, [isConnected]);

  // Function to unsubscribe from a channel
  const unsubscribe = useCallback((channel: string, callback?: SubscriptionCallback<any>) => {
    if (socketRef.current && isConnected) {
      // Remove specific callback if provided
      if (callback) {
        const callbacks = callbacksRef.current.get(channel);
        if (callbacks) {
          callbacks.delete(callback);
          if (callbacks.size === 0) {
            callbacksRef.current.delete(channel);
            socketRef.current.emit(SocketEvent.UNSUBSCRIBE, { channel, timestamp: Date.now() });
          }
        }
      } else {
        // Remove all callbacks and unsubscribe
        callbacksRef.current.delete(channel);
        socketRef.current.emit(SocketEvent.UNSUBSCRIBE, { channel, timestamp: Date.now() });
      }

      return true;
    }
    return false;
  }, [isConnected]);

  // Generic method to listen to an event
  const on = useCallback(<T = any>(event: SocketEvent, callback: (data: T) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  }, []);

  // Subscribe to market updates for a specific symbol and timeframe
  const subscribeToMarketUpdates = useCallback((symbol: string, timeframe: string, callback?: SubscriptionCallback<MarketUpdatePayload>) => {
    const channel = formatChannel('market', symbol, timeframe);
    subscribe(channel, callback);

    return () => {
      unsubscribe(channel, callback);
    };
  }, [subscribe, unsubscribe]);

  // Subscribe to analysis updates for a specific symbol and timeframe
  const subscribeToAnalysisUpdates = useCallback((symbol: string, timeframe: string, callback?: SubscriptionCallback<AnalysisUpdatePayload>) => {
    const channel = formatChannel('analysis', symbol, timeframe);
    subscribe(channel, callback);

    return () => {
      unsubscribe(channel, callback);
    };
  }, [subscribe, unsubscribe]);

  // Generic subscription function
  const subscribeToChannel = useCallback(<T = any>(type: SubscriptionType, symbol: string, timeframe: string | undefined, callback?: SubscriptionCallback<T>) => {
    const channel = formatChannel(type, symbol, timeframe);
    subscribe(channel, callback);

    return () => {
      unsubscribe(channel, callback);
    };
  }, [subscribe, unsubscribe]);

  // Check connection health
  const checkHealth = useCallback(() => {
    if (socketRef.current && isConnected) {
      const clientTime = Date.now();
      socketRef.current.emit(SocketEvent.PING, { clientTime, timestamp: clientTime });

      return new Promise<number>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Socket health check timeout'));
        }, 5000);

        const handlePong = (data: { clientTime: number, serverTime: number }) => {
          clearTimeout(timeout);
          socketRef.current?.off(SocketEvent.PONG, handlePong);
          const roundTripTime = Date.now() - data.clientTime;
          setLatency(roundTripTime);
          resolve(roundTripTime);
        };

        socketRef.current.on(SocketEvent.PONG, handlePong);
      });
    }
    return Promise.reject(new Error('Socket not connected'));
  }, [isConnected]);

  // Clear system messages
  const clearSystemMessages = useCallback(() => {
    setSystemMessages([]);
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    lastMessage,
    systemMessages,
    subscribedChannels,
    latency,
    subscribe,
    unsubscribe,
    on,
    subscribeToMarketUpdates,
    subscribeToAnalysisUpdates,
    subscribeToChannel,
    checkHealth,
    clearSystemMessages,
  };
}
