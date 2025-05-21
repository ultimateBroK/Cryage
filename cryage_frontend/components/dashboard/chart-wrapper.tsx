'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  createChart,
  ColorType,
  CrosshairMode,
  IChartApi,
  TimeScaleMarkers,
  SeriesMarkerPosition,
  IPriceLine,
  CandlestickData,
  HistogramData,
  ChartOptions,
  DeepPartial
} from 'lightweight-charts';
import { Candle } from '@/types/api';
import { useTheme } from 'next-themes';

interface ChartWrapperProps {
  symbol: string;
  timeframe: string;
  candleData?: Candle[];
  indicators?: {
    ema34?: number[];
    ema89?: number[];
    ema200?: number[];
  };
  height?: number;
  width?: string;
  className?: string;
  showVolume?: boolean;
  chartType?: 'candles' | 'line' | 'area';
}

export function ChartWrapper({
  symbol,
  timeframe,
  candleData = [],
  indicators = {},
  height = 400,
  width = '100%',
  className = '',
  showVolume = true,
  chartType = 'candles',
}: ChartWrapperProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  // Chart colors based on theme
  const chartColors = {
    background: isDarkTheme ? '#111111' : '#ffffff',
    text: isDarkTheme ? '#d1d5db' : '#1f2937',
    grid: isDarkTheme ? '#333333' : '#e5e7eb',
    upColor: '#36bd5a',
    downColor: '#e03131',
    borderUpColor: '#36bd5a',
    borderDownColor: '#e03131',
    wickUpColor: '#36bd5a',
    wickDownColor: '#e03131',
    volumeUpColor: 'rgba(54, 189, 90, 0.5)',
    volumeDownColor: 'rgba(224, 49, 49, 0.5)',
    ema34Color: '#1e88e5',
    ema89Color: '#9c27b0',
    ema200Color: '#ff9800',
    crosshairColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
  };

  // Chart configuration options
  const getChartOptions = useCallback((): DeepPartial<ChartOptions> => {
    return {
      width: chartContainerRef.current?.clientWidth || 800,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: chartColors.background },
        textColor: chartColors.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: 12,
      },
      grid: {
        vertLines: {
          color: chartColors.grid,
          style: 0.5,
        },
        horzLines: {
          color: chartColors.grid,
          style: 0.5,
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: chartColors.crosshairColor,
          width: 1,
          style: 1,
          labelBackgroundColor: chartColors.background,
        },
        horzLine: {
          color: chartColors.crosshairColor,
          width: 1,
          style: 1,
          labelBackgroundColor: chartColors.background,
        },
      },
      rightPriceScale: {
        borderColor: chartColors.grid,
        visible: true,
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.2 : 0.1,
        },
        autoScale: true,
      },
      timeScale: {
        borderColor: chartColors.grid,
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        rightOffset: 12,
        barSpacing: 6,
        minBarSpacing: 4,
      },
      handleScroll: {
        vertTouchDrag: false,
        pressedMouseMove: true,
        horzTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
      watermark: {
        color: 'rgba(0, 0, 0, 0.05)',
        visible: true,
        text: symbol.toUpperCase(),
        fontSize: 36,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
    };
  }, [height, showVolume, chartColors, symbol]);

  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current && !chart) {
      const newChart = createChart(chartContainerRef.current, getChartOptions());
      setChart(newChart);

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && newChart) {
          newChart.applyOptions({
            width: chartContainerRef.current.clientWidth
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        newChart.remove();
      };
    }
  }, [getChartOptions, chart]);

  // Update chart data when candles change
  useEffect(() => {
    if (!chart || !candleData) return;

    // Clear all existing series
    chart.getSeries().forEach(series => {
      chart.removeSeries(series);
    });

    // Format candles for the chart
    const formattedCandles = candleData.length > 0
      ? candleData.map(candle => ({
          time: candle.timestamp / 1000, // Convert to seconds
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }))
      : Array.from({ length: 50 }, (_, i) => {
          const time = Math.floor(Date.now() / 1000) - (50 - i) * 3600;
          return {
            time,
            open: 30000 + Math.random() * 5000,
            high: 30000 + Math.random() * 7000,
            low: 30000 + Math.random() * 3000,
            close: 30000 + Math.random() * 5000,
          };
        });

    // Add the primary price series based on chart type
    let primarySeries;

    if (chartType === 'candles') {
      // Create candlestick series
      primarySeries = chart.addCandlestickSeries({
        upColor: chartColors.upColor,
        downColor: chartColors.downColor,
        borderUpColor: chartColors.borderUpColor,
        borderDownColor: chartColors.borderDownColor,
        wickUpColor: chartColors.wickUpColor,
        wickDownColor: chartColors.wickDownColor,
        priceLineVisible: true,
        priceLineWidth: 1,
        lastValueVisible: true,
      });

      primarySeries.setData(formattedCandles);
    }
    else if (chartType === 'line') {
      // Create line series
      primarySeries = chart.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
        priceLineVisible: true,
      });

      // Convert candlestick data to line data
      const lineData = formattedCandles.map(candle => ({
        time: candle.time,
        value: candle.close
      }));

      primarySeries.setData(lineData);
    }
    else if (chartType === 'area') {
      // Create area series
      primarySeries = chart.addAreaSeries({
        topColor: 'rgba(41, 98, 255, 0.56)',
        bottomColor: 'rgba(41, 98, 255, 0.04)',
        lineColor: 'rgba(41, 98, 255, 1)',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
        priceLineVisible: true,
      });

      // Convert candlestick data to area data
      const areaData = formattedCandles.map(candle => ({
        time: candle.time,
        value: candle.close
      }));

      primarySeries.setData(areaData);
    }

    // Create volume series if enabled
    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      // Format volume data
      const volumeData = candleData.length > 0
        ? candleData.map(candle => ({
            time: candle.timestamp / 1000,
            value: candle.volume,
            color: candle.close >= candle.open
              ? chartColors.volumeUpColor
              : chartColors.volumeDownColor,
          }))
        : formattedCandles.map(candle => ({
            time: candle.time,
            value: Math.random() * 1000000,
            color: candle.close >= candle.open
              ? chartColors.volumeUpColor
              : chartColors.volumeDownColor,
          }));

      volumeSeries.setData(volumeData);
    }

    // Add EMAs if available
    if (indicators.ema34 && indicators.ema34.length > 0) {
      const ema34Series = chart.addLineSeries({
        color: chartColors.ema34Color,
        lineWidth: 2,
        title: 'EMA 34',
        priceLineVisible: false,
      });

      const ema34Data = indicators.ema34.map((value, index) => ({
        time: candleData[index]?.timestamp / 1000 || formattedCandles[index]?.time || 0,
        value,
      }));

      ema34Series.setData(ema34Data);
    }

    if (indicators.ema89 && indicators.ema89.length > 0) {
      const ema89Series = chart.addLineSeries({
        color: chartColors.ema89Color,
        lineWidth: 2,
        title: 'EMA 89',
        priceLineVisible: false,
      });

      const ema89Data = indicators.ema89.map((value, index) => ({
        time: candleData[index]?.timestamp / 1000 || formattedCandles[index]?.time || 0,
        value,
      }));

      ema89Series.setData(ema89Data);
    }

    if (indicators.ema200 && indicators.ema200.length > 0) {
      const ema200Series = chart.addLineSeries({
        color: chartColors.ema200Color,
        lineWidth: 2,
        title: 'EMA 200',
        priceLineVisible: false,
      });

      const ema200Data = indicators.ema200.map((value, index) => ({
        time: candleData[index]?.timestamp / 1000 || formattedCandles[index]?.time || 0,
        value,
      }));

      ema200Series.setData(ema200Data);
    }

    // Fit content
    chart.timeScale().fitContent();

    return () => {
      chart.getSeries().forEach(series => {
        chart.removeSeries(series);
      });
    };
  }, [
    chart,
    candleData,
    indicators,
    showVolume,
    chartType,
    chartColors.upColor,
    chartColors.downColor,
    chartColors.borderUpColor,
    chartColors.borderDownColor,
    chartColors.wickUpColor,
    chartColors.wickDownColor,
    chartColors.volumeUpColor,
    chartColors.volumeDownColor,
    chartColors.ema34Color,
    chartColors.ema89Color,
    chartColors.ema200Color
  ]);

  // Update chart on theme change
  useEffect(() => {
    if (!chart) return;

    chart.applyOptions(getChartOptions());
  }, [chart, getChartOptions]);

  return (
    <div
      ref={chartContainerRef}
      className={`w-full h-full relative ${className}`}
      style={{ width, height }}
    />
  );
}
