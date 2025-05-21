import { AiAnalysis, Candle, MarketData, TechnicalAnalysis } from './api'

/**
 * WebSocket connection status
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error'

/**
 * WebSocket event types
 */
export enum SocketEvent {
  // System events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',
  CONNECTION_ESTABLISHED = 'connection:established',

  // Subscription events
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  SUBSCRIPTION_SUCCESS = 'subscription:success',
  SUBSCRIPTION_CLOSED = 'subscription:closed',

  // Health check events
  PING = 'ping',
  PONG = 'pong',

  // Data events
  MARKET_UPDATE = 'market:update',
  CANDLE_UPDATE = 'candle:update',
  TECH_ANALYSIS_UPDATE = 'analysis:tech:update',
  AI_ANALYSIS_UPDATE = 'analysis:ai:update',
  ANALYSIS_UPDATE = 'analysis:update',

  // System messages
  SYSTEM_MESSAGE = 'system:message'
}

/**
 * Subscription types
 */
export type SubscriptionType = 'market' | 'candle' | 'tech-analysis' | 'ai-analysis' | 'analysis'

export interface Subscription {
  type: SubscriptionType
  symbol: string
  timeframe?: string
}

/**
 * Channel format utilities
 */
export const formatChannel = (type: SubscriptionType, symbol: string, timeframe?: string): string => {
  if (timeframe) {
    return `${type}:${symbol}:${timeframe}`;
  }
  return `${type}:${symbol}`;
}

/**
 * Base payload for all events
 */
export interface BasePayload {
  timestamp: number
}

/**
 * Subscription payloads
 */
export interface SubscriptionPayload extends BasePayload {
  channel: string
}

export interface SubscriptionResponsePayload extends SubscriptionPayload {
  status: 'subscribed' | 'unsubscribed'
}

/**
 * Payload types for different events
 */
export interface MarketUpdatePayload extends BasePayload {
  symbol: string
  timeframe: string
  data: MarketData
}

export interface CandleUpdatePayload extends BasePayload {
  symbol: string
  timeframe: string
  candle: Candle
}

export interface TechAnalysisUpdatePayload extends BasePayload {
  symbol: string
  timeframe: string
  data: TechnicalAnalysis
}

export interface AiAnalysisUpdatePayload extends BasePayload {
  symbol: string
  timeframe: string
  data: AiAnalysis
}

export interface AnalysisUpdatePayload extends BasePayload {
  symbol: string
  timeframe: string
  data: TechnicalAnalysis | AiAnalysis
  analysisType: 'technical' | 'ai'
}

export interface SystemMessagePayload extends BasePayload {
  message: string
  level: 'info' | 'warning' | 'error'
}

export interface PingPayload extends BasePayload {
  clientTime: number
}

export interface PongPayload extends BasePayload {
  clientTime: number
  serverTime: number
  latency: number
}

/**
 * Socket message types
 */
export type SocketMessage<T = any> = {
  event: SocketEvent
  payload: T
  timestamp: string
}

/**
 * Type guards for payload types
 */
export const isMarketUpdate = (
  payload: any
): payload is MarketUpdatePayload => {
  return (
    payload &&
    typeof payload.symbol === 'string' &&
    typeof payload.timeframe === 'string' &&
    payload.data !== undefined
  );
}

export const isAnalysisUpdate = (
  payload: any
): payload is AnalysisUpdatePayload => {
  return (
    payload &&
    typeof payload.symbol === 'string' &&
    typeof payload.timeframe === 'string' &&
    payload.data !== undefined &&
    typeof payload.analysisType === 'string'
  );
}

export const isSystemMessage = (
  payload: any
): payload is SystemMessagePayload => {
  return (
    payload &&
    typeof payload.message === 'string' &&
    typeof payload.level === 'string'
  );
}
