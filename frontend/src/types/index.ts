// Common types used across the application

export interface NotificationItem {
  id: string;
  type: 'message' | 'system' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface TabState {
  activeTab: string;
  previousTab?: string;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export interface CryptoData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
}

export interface TerminalState {
  isConnected: boolean;
  currentCommand: string;
  history: string[];
  output: string[];
}

export interface AgentStatus {
  isActive: boolean;
  status: 'idle' | 'processing' | 'error' | 'disconnected';
  lastActivity?: Date;
}
