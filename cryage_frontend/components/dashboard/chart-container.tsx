'use client';

import { useState } from 'react';
import { ChartWrapper } from './chart-wrapper';
import { ChartControls } from './chart-controls';
import { useMarketData } from '@/hooks/use-market-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ChartContainer() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1h');
  const [showVolume, setShowVolume] = useState(true);
  const [showEma, setShowEma] = useState(false);
  const [chartType, setChartType] = useState<'candles' | 'line' | 'area'>('candles');

  const { marketData, isLoading, error } = useMarketData(symbol, timeframe);

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  const handleVolumeToggle = (enabled: boolean) => {
    setShowVolume(enabled);
  };

  const handleEmaToggle = (enabled: boolean) => {
    setShowEma(enabled);
  };

  const handleChartTypeChange = (type: 'candles' | 'line' | 'area') => {
    setChartType(type);
  };

  // Generate placeholder indicator data if showEma is true
  const placeholderIndicators = showEma ? {
    ema34: Array.from({ length: 100 }, (_, i) =>
      30000 + Math.sin(i * 0.1) * 1000 + Math.random() * 200),
    ema89: Array.from({ length: 100 }, (_, i) =>
      30000 + Math.sin(i * 0.05) * 1500 + Math.random() * 100),
    ema200: Array.from({ length: 100 }, (_, i) =>
      30000 + Math.sin(i * 0.02) * 2000)
  } : {};

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {symbol.replace('USDT', '/USDT')} - {timeframe}
        </CardTitle>
        <ChartControls
          symbol={symbol}
          timeframe={timeframe}
          onSymbolChange={handleSymbolChange}
          onTimeframeChange={handleTimeframeChange}
          showVolume={showVolume}
          onVolumeToggle={handleVolumeToggle}
          showEma={showEma}
          onEmaToggle={handleEmaToggle}
          chartType={chartType}
          onChartTypeChange={handleChartTypeChange}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] w-full flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : error ? (
          <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">
            Error loading chart data: {(error as Error).message}
          </div>
        ) : (
          <ChartWrapper
            symbol={symbol}
            timeframe={timeframe}
            candleData={marketData?.candles || []}
            indicators={showEma ? (marketData?.indicators || placeholderIndicators) : {}}
            height={400}
            showVolume={showVolume}
            chartType={chartType}
          />
        )}
      </CardContent>
    </Card>
  );
}
