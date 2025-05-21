import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChartControls from '@/components/dashboard/chart-controls';

describe('ChartControls', () => {
  const mockOnTimeframeChange = jest.fn();
  const mockOnSymbolChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(
      <ChartControls
        symbol="BTC/USDT"
        timeframe="1h"
        onTimeframeChange={mockOnTimeframeChange}
        onSymbolChange={mockOnSymbolChange}
      />
    );

    // Check that the component renders with correct defaults
    expect(screen.getByText(/BTC\/USDT/i)).toBeInTheDocument();
    expect(screen.getByText(/1h/i)).toBeInTheDocument();
  });

  it('handles timeframe change', () => {
    render(
      <ChartControls
        symbol="BTC/USDT"
        timeframe="1h"
        onTimeframeChange={mockOnTimeframeChange}
        onSymbolChange={mockOnSymbolChange}
      />
    );

    // Find and click the timeframe button
    const timeframeButton = screen.getByText(/1h/i);
    fireEvent.click(timeframeButton);

    // Find and click a different timeframe option (e.g., 4h)
    const fourHourOption = screen.getByText(/4h/i);
    fireEvent.click(fourHourOption);

    // Check that the callback was called with the correct value
    expect(mockOnTimeframeChange).toHaveBeenCalledWith('4h');
  });

  it('handles symbol change', () => {
    render(
      <ChartControls
        symbol="BTC/USDT"
        timeframe="1h"
        onTimeframeChange={mockOnTimeframeChange}
        onSymbolChange={mockOnSymbolChange}
        availableSymbols={['BTC/USDT', 'ETH/USDT', 'SOL/USDT']}
      />
    );

    // Find and click the symbol selection
    const symbolButton = screen.getByText(/BTC\/USDT/i);
    fireEvent.click(symbolButton);

    // Find and click a different symbol
    const ethOption = screen.getByText(/ETH\/USDT/i);
    fireEvent.click(ethOption);

    // Check that the callback was called with the correct value
    expect(mockOnSymbolChange).toHaveBeenCalledWith('ETH/USDT');
  });

  it('displays correct timeframe options', () => {
    render(
      <ChartControls
        symbol="BTC/USDT"
        timeframe="1h"
        onTimeframeChange={mockOnTimeframeChange}
        onSymbolChange={mockOnSymbolChange}
      />
    );

    // Open the timeframe dropdown
    const timeframeButton = screen.getByText(/1h/i);
    fireEvent.click(timeframeButton);

    // Check that common timeframe options are available
    expect(screen.getByText(/1m/i)).toBeInTheDocument();
    expect(screen.getByText(/5m/i)).toBeInTheDocument();
    expect(screen.getByText(/15m/i)).toBeInTheDocument();
    expect(screen.getByText(/1h/i)).toBeInTheDocument();
    expect(screen.getByText(/4h/i)).toBeInTheDocument();
    expect(screen.getByText(/1d/i)).toBeInTheDocument();
  });

  it('handles empty available symbols', () => {
    render(
      <ChartControls
        symbol="BTC/USDT"
        timeframe="1h"
        onTimeframeChange={mockOnTimeframeChange}
        onSymbolChange={mockOnSymbolChange}
        availableSymbols={[]}
      />
    );

    // Component should still render with default symbol
    expect(screen.getByText(/BTC\/USDT/i)).toBeInTheDocument();
  });
});
