"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp, TrendingDown, Activity, Brain, Database } from 'lucide-react';

interface TradingSignal {
  signal: string;
  symbol: string;
  entry?: string;
  stop_loss?: string;
  take_profit?: string;
  reasoning: string;
  timestamp: string;
}

interface MarketData {
  symbol: string;
  current_price: number;
  price_change_24h: number;
  volume_24h: number;
  high_24h: number;
  low_24h: number;
  timestamp: string;
}

interface TradingAnalysis {
  success: boolean;
  signal?: TradingSignal;
  response: string;
  market_data?: MarketData;
  timestamp: string;
}

interface MemoryItem {
  timestamp: string;
  user_input: string;
  agent_response: string;
  agent_name: string;
}

const TRADING_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT',
  'XRPUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'MATICUSDT'
];

export function TradingInterface() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [userMessage, setUserMessage] = useState('');
  const [analysis, setAnalysis] = useState<TradingAnalysis | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [memoryHistory, setMemoryHistory] = useState<MemoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch market data on symbol change
  useEffect(() => {
    fetchMarketData(selectedSymbol);
  }, [selectedSymbol]);

  // Fetch memory history on component mount
  useEffect(() => {
    fetchMemoryHistory();
  }, []);

  const fetchMarketData = async (symbol: string) => {
    try {
      const response = await fetch(`http://localhost:8000/market-data/${symbol}`);
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
    }
  };

  const fetchMemoryHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/memory/history?limit=10');
      if (response.ok) {
        const data = await response.json();
        setMemoryHistory(data.history || []);
      }
    } catch (err) {
      console.error('Error fetching memory history:', err);
    }
  };

  const handleTradingAnalysis = async () => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/trade-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          symbol: selectedSymbol,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        // Refresh memory history after new analysis
        fetchMemoryHistory();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to get trading analysis');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSignalColor = (signal?: string) => {
    if (!signal) return 'bg-gray-500';
    switch (signal.toUpperCase()) {
      case 'BUY':
        return 'bg-green-500';
      case 'SELL':
        return 'bg-red-500';
      case 'HOLD':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSignalIcon = (signal?: string) => {
    if (!signal) return <Activity className="h-4 w-4" />;
    switch (signal.toUpperCase()) {
      case 'BUY':
        return <TrendingUp className="h-4 w-4" />;
      case 'SELL':
        return <TrendingDown className="h-4 w-4" />;
      case 'HOLD':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cryage Trading Interface</h1>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">AI-Powered Trading Analysis</span>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Trading Analysis</TabsTrigger>
          <TabsTrigger value="market">Market Data</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRADING_SYMBOLS.map((symbol) => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Ask about trading signals, market analysis..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleTradingAnalysis} 
                  disabled={isLoading || !userMessage.trim()}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {analysis && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {analysis.signal && (
                      <Badge className={`${getSignalColor(analysis.signal.signal)} text-white`}>
                        <div className="flex items-center space-x-1">
                          {getSignalIcon(analysis.signal.signal)}
                          <span>{analysis.signal.signal}</span>
                        </div>
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {new Date(analysis.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Analysis Response:</h4>
                    <p className="text-sm whitespace-pre-wrap">{analysis.response}</p>
                  </div>

                  {analysis.signal && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analysis.signal.entry && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h5 className="font-semibold text-green-800">Entry</h5>
                          <p className="text-green-700">{analysis.signal.entry}</p>
                        </div>
                      )}
                      {analysis.signal.stop_loss && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <h5 className="font-semibold text-red-800">Stop Loss</h5>
                          <p className="text-red-700">{analysis.signal.stop_loss}</p>
                        </div>
                      )}
                      {analysis.signal.take_profit && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h5 className="font-semibold text-blue-800">Take Profit</h5>
                          <p className="text-blue-700">{analysis.signal.take_profit}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Data</CardTitle>
            </CardHeader>
            <CardContent>
              {marketData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800">Current Price</h5>
                    <p className="text-2xl font-bold text-blue-700">
                      ${marketData.current_price?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800">24h Change</h5>
                    <p className={`text-2xl font-bold ${marketData.price_change_24h >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {marketData.price_change_24h >= 0 ? '+' : ''}{marketData.price_change_24h?.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800">24h Volume</h5>
                    <p className="text-2xl font-bold text-purple-700">
                      {marketData.volume_24h?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-800">24h High</h5>
                    <p className="text-xl font-bold text-orange-700">
                      ${marketData.high_24h?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-800">24h Low</h5>
                    <p className="text-xl font-bold text-red-700">
                      ${marketData.low_24h?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Memory History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memoryHistory.length > 0 ? (
                  memoryHistory.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{item.agent_name}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h5 className="font-semibold text-sm">User:</h5>
                          <p className="text-sm text-muted-foreground">{item.user_input}</p>
                        </div>
                        <Separator />
                        <div>
                          <h5 className="font-semibold text-sm">Agent:</h5>
                          <p className="text-sm">{item.agent_response}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No memory history available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Backend API</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Trading Team</span>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Memory System</span>
                  <Badge className="bg-green-500">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Vector Database</span>
                  <Badge className="bg-green-500">Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
