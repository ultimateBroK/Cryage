'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Candle, MarketData } from '@/types/api';
import { useSocket } from './use-socket';

async function fetchMarketData(symbol: string, timeframe: string): Promise<MarketData> {
  const response = await fetch(`/api/v1/markets/${symbol}/${timeframe}`);

  if (!response.ok) {
    throw new Error(`Error fetching market data: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

export function useMarketData(symbol: string, timeframe: string) {
  const { isConnected, subscribeToMarketUpdates, unsubscribe } = useSocket();
  const [realtimeCandle, setRealtimeCandle] = useState<Candle | null>(null);

  // Fetch initial market data
  const {
    data: marketData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['marketData', symbol, timeframe],
    queryFn: () => fetchMarketData(symbol, timeframe),
    enabled: Boolean(symbol && timeframe),
    refetchOnWindowFocus: false,
    refetchInterval: 60000, // Refetch every minute as backup
  });

  // Handle real-time updates via WebSocket
  useEffect(() => {
    if (!isConnected || !symbol || !timeframe) return;

    // Subscribe to market updates
    const handleMarketUpdate = (update: any) => {
      if (update && update.data && update.data.candles && update.data.candles.length > 0) {
        // Get the latest candle
        const latestCandle = update.data.candles[update.data.candles.length - 1];
        setRealtimeCandle(latestCandle);
      }
    };

    // Subscribe to market updates
    subscribeToMarketUpdates(symbol, timeframe, handleMarketUpdate);

    // Cleanup subscription
    return () => {
      const channel = `market:${symbol}:${timeframe}`;
      unsubscribe(channel);
    };
  }, [symbol, timeframe, isConnected, subscribeToMarketUpdates, unsubscribe]);

  // Combine fetched data with realtime updates
  const combinedData = useCallback(() => {
    if (!marketData) return { candles: [] };

    const candles = [...marketData.candles];

    // If we have realtime data, update the last candle or add a new one
    if (realtimeCandle) {
      const lastIndex = candles.findIndex(
        (candle) => candle.timestamp === realtimeCandle.timestamp
      );

      if (lastIndex >= 0) {
        // Update existing candle
        candles[lastIndex] = realtimeCandle;
      } else {
        // Add new candle
        candles.push(realtimeCandle);
      }
    }

    return {
      ...marketData,
      candles,
    };
  }, [marketData, realtimeCandle]);

  return {
    marketData: combinedData(),
    isLoading,
    error,
    refetch,
  };
}
