/**
 * API Response Types
 */

export interface ApiResponse<T> {
  data: T
  success: boolean
  timestamp: string
}

/**
 * Market Data Types
 */

export interface Symbol {
  symbol: string
  baseAsset: string
  quoteAsset: string
  status: string
  displayName?: string
}

export interface Candle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface MarketData {
  symbol: string
  timeframe: string
  candles: Candle[]
  lastUpdated: string
}

/**
 * Analysis Types
 */

export interface TechnicalIndicator {
  type: string
  value: number | number[] | string
  signal?: 'buy' | 'sell' | 'neutral'
  color?: string
}

export interface TechnicalAnalysis {
  symbol: string
  timeframe: string
  indicators: Record<string, TechnicalIndicator>
  lastUpdated: string
}

export interface AiAnalysis {
  symbol: string
  timeframe: string
  summary: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  keyPoints: string[]
  lastUpdated: string
}
