import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartWrapper from '@/components/dashboard/chart-wrapper';
import { createChart } from 'lightweight-charts';

// Mock the hooks used in the component
jest.mock('@/hooks/use-socket', () => ({
  useSocket: jest.fn().mockReturnValue({
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    isConnected: true
  }),
}));

jest.mock('@/hooks/use-market-data', () => ({
  useMarketData: jest.fn().mockReturnValue({
    data: {
      candles: [
        { timestamp: 1625097600000, open: 35000, high: 36000, low: 34500, close: 35500, volume: 100 },
        { timestamp: 1625184000000, open: 35500, high: 36500, low: 35000, close: 36000, volume: 120 },
      ],
    },
    isLoading: false,
    error: null,
  }),
}));

// Mock the store
jest.mock('@/store/theme-store', () => ({
  useThemeStore: jest.fn().mockReturnValue({
    theme: 'dark',
  }),
}));

describe('ChartWrapper', () => {
  beforeEach(() => {
    // Clear mock function calls between tests
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ChartWrapper symbol="BTC/USDT" timeframe="1h" />);

    // Check if the component renders
    expect(screen.getByTestId('chart-wrapper')).toBeInTheDocument();
  });

  it('calls createChart with the correct options', () => {
    render(<ChartWrapper symbol="BTC/USDT" timeframe="1h" />);

    // Check if createChart was called
    expect(createChart).toHaveBeenCalled();

    // Check if it was called with dark theme options
    const callOptions = (createChart as jest.Mock).mock.calls[0][1];
    expect(callOptions.layout.background).toEqual({ color: '#0f0f11' });
  });

  it('handles different themes', () => {
    // Update the mock to return light theme
    require('@/store/theme-store').useThemeStore.mockReturnValue({
      theme: 'light',
    });

    render(<ChartWrapper symbol="BTC/USDT" timeframe="1h" />);

    // Check if it was called with light theme options
    const callOptions = (createChart as jest.Mock).mock.calls[0][1];
    expect(callOptions.layout.background).not.toEqual({ color: '#0f0f11' });
  });

  it('sets up candlestick and volume series', () => {
    const mockChart = createChart(null as any);
    render(<ChartWrapper symbol="BTC/USDT" timeframe="1h" />);

    // Check that the candlestick and histogram series were added
    expect(mockChart.addCandlestickSeries).toHaveBeenCalled();
    expect(mockChart.addHistogramSeries).toHaveBeenCalled();
  });

  // More tests could be added for testing resize handling, data updates, etc.
});
