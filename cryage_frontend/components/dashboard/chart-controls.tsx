'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { BarChart4, LineChart, Candlestick, Activity, ChartBar } from 'lucide-react';

interface ChartControlsProps {
  symbol: string;
  timeframe: string;
  onSymbolChange: (symbol: string) => void;
  onTimeframeChange: (timeframe: string) => void;
  showVolume?: boolean;
  onVolumeToggle?: (enabled: boolean) => void;
  showEma?: boolean;
  onEmaToggle?: (enabled: boolean) => void;
  chartType?: 'candles' | 'line' | 'area';
  onChartTypeChange?: (type: 'candles' | 'line' | 'area') => void;
}

export function ChartControls({
  symbol,
  timeframe,
  onSymbolChange,
  onTimeframeChange,
  showVolume = true,
  onVolumeToggle = () => {},
  showEma = false,
  onEmaToggle = () => {},
  chartType = 'candles',
  onChartTypeChange = () => {},
}: ChartControlsProps) {
  // Available symbols and timeframes
  const symbols = [
    { value: 'BTCUSDT', label: 'BTC/USDT' },
    { value: 'ETHUSDT', label: 'ETH/USDT' },
    { value: 'BNBUSDT', label: 'BNB/USDT' },
    { value: 'XRPUSDT', label: 'XRP/USDT' },
    { value: 'ADAUSDT', label: 'ADA/USDT' },
    { value: 'SOLUSDT', label: 'SOL/USDT' },
  ];

  const timeframes = [
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '30m', label: '30m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1d', label: '1d' },
    { value: '1w', label: '1w' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col">
          <span className="text-xs mb-1 text-muted-foreground">Symbol</span>
          <Select
            value={symbol}
            onValueChange={onSymbolChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Symbol" />
            </SelectTrigger>
            <SelectContent>
              {symbols.map((sym) => (
                <SelectItem key={sym.value} value={sym.value}>
                  {sym.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <span className="text-xs mb-1 text-muted-foreground">Timeframe</span>
          <div className="flex flex-wrap gap-1">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeframeChange(tf.value)}
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center space-x-2">
          <Label htmlFor="chart-type" className="text-xs text-muted-foreground">Chart Type</Label>
          <div className="flex bg-secondary rounded-md">
            <Toggle
              pressed={chartType === 'candles'}
              onClick={() => onChartTypeChange('candles')}
              size="sm"
              variant="outline"
              className="rounded-l-md rounded-r-none border-r-0 hover:bg-accent"
              aria-label="Candlestick chart"
            >
              <Candlestick className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={chartType === 'line'}
              onClick={() => onChartTypeChange('line')}
              size="sm"
              variant="outline"
              className="rounded-none border-r-0 hover:bg-accent"
              aria-label="Line chart"
            >
              <LineChart className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={chartType === 'area'}
              onClick={() => onChartTypeChange('area')}
              size="sm"
              variant="outline"
              className="rounded-r-md rounded-l-none hover:bg-accent"
              aria-label="Area chart"
            >
              <BarChart4 className="h-4 w-4" />
            </Toggle>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="volume"
            checked={showVolume}
            onCheckedChange={onVolumeToggle}
          />
          <Label htmlFor="volume" className="cursor-pointer text-xs">
            Volume
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="ema"
            checked={showEma}
            onCheckedChange={onEmaToggle}
          />
          <Label htmlFor="ema" className="cursor-pointer text-xs">
            EMAs
          </Label>
        </div>
      </div>
    </div>
  );
}
