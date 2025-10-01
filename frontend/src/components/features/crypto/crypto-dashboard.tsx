"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { TrendingUp, Activity, BarChart3, Settings, ChevronDown, ChevronUp, Eye, EyeOff, Sparkles, Zap, Target, Shield, Clock, MessageSquare, TrendingDown as TrendingDownIcon } from "lucide-react";
import { MotionDiv } from "@/components/common/motion";
import { useIsMobile, useDeviceType } from "@/hooks/use-mobile";

const CryptoDashboardComponent = () => {
  // Progressive disclosure state
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    marketOverview: true,
    charts: true,
    news: true,
    quickActions: true,
    analytics: true
  });
  const [liveData, setLiveData] = useState({
    lastUpdate: new Date(),
    activeTraders: 1247,
    marketCap: "$2.1T",
    volume24h: "$89.2B",
    btcDominance: "56.2%"
  });
  
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        lastUpdate: new Date(),
        activeTraders: prev.activeTraders + Math.floor(Math.random() * 10) - 5,
        marketCap: `$${(2.1 + (Math.random() * 0.1 - 0.05)).toFixed(1)}T`,
        volume24h: `$${(89.2 + (Math.random() * 5 - 2.5)).toFixed(1)}B`,
        btcDominance: `${(56.2 + (Math.random() * 2 - 1)).toFixed(1)}%`
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Toggle card expansion
  const toggleCardExpansion = useCallback((cardId: string) => {
    setExpandedCards(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(cardId)) {
        newExpanded.delete(cardId);
      } else {
        newExpanded.add(cardId);
      }
      return newExpanded;
    });
  }, []);

  // Toggle section visibility
  const toggleSectionVisibility = useCallback((section: keyof typeof visibleSections) => {
    setVisibleSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Custom crypto icons (Trust Wallet style)
  const BitcoinIcon = () => (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
      ₿
    </div>
  );

  const EthereumIcon = () => (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
      Ξ
    </div>
  );

  const BinanceIcon = () => (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
      B
    </div>
  );

  const CardanoIcon = () => (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
      A
    </div>
  );

  // Enhanced mock data - in real app, this would come from API
  const marketData = useMemo(() => [
    {
      symbol: "BTC/USDT",
      name: "Bitcoin",
      price: "$43,250",
      change: "+2.5%",
      changeType: "positive" as const,
      volume: "$2.1B",
      marketCap: "$850B",
      rank: 1,
      high24h: "$44,120",
      low24h: "$42,890",
      icon: BitcoinIcon,
      volatility: "Medium",
      sentiment: "Bullish",
      technicalScore: 75,
    },
    {
      symbol: "ETH/USDT",
      name: "Ethereum",
      price: "$2,650",
      change: "-1.2%",
      changeType: "negative" as const,
      volume: "$890M",
      marketCap: "$318B",
      rank: 2,
      high24h: "$2,720",
      low24h: "$2,610",
      icon: EthereumIcon,
      volatility: "Low",
      sentiment: "Neutral",
      technicalScore: 62,
    },
    {
      symbol: "BNB/USDT",
      name: "Binance Coin",
      price: "$315",
      change: "+0.8%",
      changeType: "positive" as const,
      volume: "$245M",
      marketCap: "$47.2B",
      rank: 4,
      high24h: "$318",
      low24h: "$312",
      icon: BinanceIcon,
      volatility: "Low",
      sentiment: "Bullish",
      technicalScore: 68,
    },
    {
      symbol: "ADA/USDT",
      name: "Cardano",
      price: "$0.485",
      change: "-3.1%",
      changeType: "negative" as const,
      volume: "$156M",
      marketCap: "$17.1B",
      rank: 8,
      high24h: "$0.502",
      low24h: "$0.478",
      icon: CardanoIcon,
      volatility: "High",
      sentiment: "Bearish",
      technicalScore: 45,
    },
  ], []);

  // Placeholder for future indicators data when needed on mobile/desktop views

  const marketMetrics = useMemo(() => [
    { name: "Fear & Greed", value: "65", status: "greed", icon: Target, description: "Market Sentiment Index" },
    { name: "Volatility", value: "Medium", status: "neutral", icon: Zap, description: "Market Volatility" },
    { name: "Liquidity", value: "High", status: "positive", icon: Shield, description: "Market Liquidity" },
    { name: "Active Time", value: "Peak", status: "positive", icon: Clock, description: "Trading Activity" },
  ], []);

  return (
    <div className={`overflow-y-auto h-full ${isMobile ? 'p-3 space-y-4' : 'p-3 sm:p-4 space-y-4 sm:space-y-6'}`}>
      {/* Enhanced Header with Live Data */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b bg-gradient-to-r from-blue-50/5 to-purple-50/5 dark:from-blue-950/10 dark:to-purple-950/10 rounded-lg p-4 ${isMobile ? '' : ''}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <h2 className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Scientific Market Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`${isMobile ? 'text-[10px]' : 'text-xs'} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Live Data
            </Badge>
            <Badge variant="outline" className={`${isMobile ? 'text-[10px]' : 'text-xs'}`}>
              Updated: {liveData.lastUpdate.toLocaleTimeString()}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailedView(!showDetailedView)}
            className={`touch-target ${isMobile ? 'text-[10px] px-2 py-1' : 'text-xs'} border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700`}
          >
            {showDetailedView ? <EyeOff className={`mr-1 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} /> : <Eye className={`mr-1 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />}
            {showDetailedView ? 'Simple' : 'Detailed'}
          </Button>
        </div>
      </div>

      {/* Live Market Overview */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-4'}`}>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className={`text-center ${isMobile ? 'p-2' : 'p-3'}`}>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Market Cap</div>
            <div className={`font-bold text-blue-800 dark:text-blue-200 ${isMobile ? 'text-base' : 'text-lg'}`}>{liveData.marketCap}</div>
            <div className="text-xs text-blue-500 dark:text-blue-400">Global</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className={`text-center ${isMobile ? 'p-2' : 'p-3'}`}>
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">24h Volume</div>
            <div className={`font-bold text-green-800 dark:text-green-200 ${isMobile ? 'text-base' : 'text-lg'}`}>{liveData.volume24h}</div>
            <div className="text-xs text-green-500 dark:text-green-400">Trading</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className={`text-center ${isMobile ? 'p-2' : 'p-3'}`}>
            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">BTC Dominance</div>
            <div className={`font-bold text-purple-800 dark:text-purple-200 ${isMobile ? 'text-base' : 'text-lg'}`}>{liveData.btcDominance}</div>
            <div className="text-xs text-purple-500 dark:text-purple-400">Market Share</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className={`text-center ${isMobile ? 'p-2' : 'p-3'}`}>
            <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">Active Traders</div>
            <div className={`font-bold text-orange-800 dark:text-orange-200 ${isMobile ? 'text-base' : 'text-lg'}`}>{liveData.activeTraders.toLocaleString()}</div>
            <div className="text-xs text-orange-500 dark:text-orange-400">Online</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Scientific Market Cards */}
      <div className={`grid gap-4 ${
        showDetailedView
          ? isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
          : isMobile ? 'grid-cols-1' : deviceType === 'tablet' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      }`}>
        {marketData.map((coin, index) => {
          const IconComponent = coin.icon;
          return (
              <MotionDiv
                key={coin.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
              <Card className={`hover:shadow-lg transition-all duration-200 hover:scale-[1.02] touch-manipulation crypto-card-glass ${
                coin.changeType === 'positive' 
                  ? 'border-l-4 border-l-green-500/30 hover:border-l-green-500/50' 
                  : 'border-l-4 border-l-red-500/30 hover:border-l-red-500/50'
              }`}>
              <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-2' : 'pb-2 sm:pb-3'}`}>
                <div className="flex items-center gap-2">
                  <IconComponent />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm font-semibold truncate">{coin.symbol}</CardTitle>
                    <p className="text-xs text-muted-foreground truncate">{coin.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                    #{coin.rank}
                  </Badge>
                  {showDetailedView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCardExpansion(coin.symbol)}
                      className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                    >
                      {expandedCards.has(coin.symbol) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className={`${isMobile ? 'space-y-3 p-3' : 'space-y-2 sm:space-y-3'}`}>
                {/* Main Price Display */}
                <div className="flex items-baseline gap-2">
                  <div className={`text-xl sm:text-2xl font-bold trading-price ${
                    coin.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {coin.price}
                  </div>
                  <div className={`flex items-center text-sm font-medium trading-change ${
                    coin.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {coin.changeType === 'positive' ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {coin.change}
                  </div>
                </div>

                {/* Scientific Metrics */}
                <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'gap-2'}`}>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">Volatility</p>
                    <p className={`text-xs font-medium ${
                      coin.volatility === 'Low' ? 'text-green-600' : 
                      coin.volatility === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {coin.volatility}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">Sentiment</p>
                    <p className={`text-xs font-medium ${
                      coin.sentiment === 'Bullish' ? 'text-green-600' : 
                      coin.sentiment === 'Neutral' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {coin.sentiment}
                    </p>
                  </div>
                </div>

                {/* 24h Range */}
                <div className="flex justify-between text-xs text-muted-foreground trading-price">
                  <span>L: {coin.low24h}</span>
                  <span>H: {coin.high24h}</span>
                </div>

                {/* Volume and Market Cap */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="text-center p-1 sm:p-0">
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="text-xs sm:text-sm font-medium trading-volume">{coin.volume}</p>
                  </div>
                  <div className="text-center p-1 sm:p-0">
                    <p className="text-xs text-muted-foreground">Market Cap</p>
                    <p className="text-xs sm:text-sm font-medium trading-volume">{coin.marketCap}</p>
                  </div>
                </div>

                 {/* Expanded Scientific Details */}
                 {showDetailedView && expandedCards.has(coin.symbol) && (
                   <div className="pt-3 border-t space-y-3">
                     {/* Technical Score */}
                     <div className="text-center">
                       <p className="text-xs text-muted-foreground">Technical Score</p>
                       <div className="flex items-center justify-center gap-2 mt-1">
                         <div className="w-full bg-muted rounded-full h-2">
                           <div 
                             className={`h-2 rounded-full ${
                               coin.technicalScore >= 70 ? 'bg-green-500' :
                               coin.technicalScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                             }`}
                             style={{ width: `${coin.technicalScore}%` }}
                           />
                         </div>
                         <span className="text-sm font-medium">{coin.technicalScore}</span>
                       </div>
                     </div>

                     {/* Advanced Metrics */}
                     <div className="grid grid-cols-2 gap-2 text-xs">
                       <div className="text-center">
                         <p className="text-muted-foreground">RSI (14)</p>
                         <p className="font-medium trading-metric">65.4</p>
                       </div>
                       <div className="text-center">
                         <p className="text-muted-foreground">MACD</p>
                         <p className="font-medium trading-metric text-green-600">+125.3</p>
                       </div>
                     </div>

                     {/* Additional Stats */}
                     <div className="grid grid-cols-3 gap-2 text-xs">
                       <div className="text-center">
                         <p className="text-muted-foreground">ATH</p>
                         <p className="font-medium trading-price">$73,750</p>
                       </div>
                       <div className="text-center">
                         <p className="text-muted-foreground">ATL</p>
                         <p className="font-medium trading-price">$67.81</p>
                       </div>
                       <div className="text-center">
                         <p className="text-muted-foreground">Supply</p>
                         <p className="font-medium trading-metric">19.7M</p>
                       </div>
                     </div>
                   </div>
                 )}
              </CardContent>
              </Card>
            </MotionDiv>
          );
        })}
      </div>

      {/* Enhanced Scientific Analytics Section */}
      {visibleSections.analytics && (
          <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Scientific Analytics
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSectionVisibility('analytics')}
              className="text-xs"
            >
              <EyeOff className="w-4 h-4 mr-1" />
              Hide
            </Button>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Advanced Price Chart */}
        <Card className="xl:col-span-2 bg-gradient-to-br from-blue-50/5 to-purple-50/5 dark:from-blue-950/10 dark:to-purple-950/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                BTC/USDT Scientific Analysis
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">1H</Badge>
                <Badge variant="outline" className="text-xs">24H</Badge>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">7D</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'h-64' : 'h-80'} bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200/30 dark:border-blue-800/30 relative overflow-hidden`}>
              {/* Enhanced scientific chart visualization */}
              <div className="absolute inset-0 opacity-30">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Main price line */}
                  <path
                    d="M0,150 Q50,120 100,140 T200,100 T300,80 T400,60"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-blue-500"
                  />
                  
                  {/* Moving average */}
                  <path
                    d="M0,160 Q50,140 100,150 T200,120 T300,100 T400,85"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-purple-500"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Volume bars */}
                  <rect x="20" y="170" width="15" height="20" fill="currentColor" className="text-green-500/50" />
                  <rect x="60" y="165" width="15" height="25" fill="currentColor" className="text-green-500/50" />
                  <rect x="100" y="175" width="15" height="15" fill="currentColor" className="text-red-500/50" />
                  <rect x="140" y="160" width="15" height="30" fill="currentColor" className="text-green-500/50" />
                  <rect x="180" y="155" width="15" height="35" fill="currentColor" className="text-green-500/50" />
                </svg>
              </div>
              <div className="text-center relative z-10">
                <BarChart3 className="w-16 h-16 mx-auto mb-3 text-blue-500/60" />
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  Advanced Scientific Chart Analysis
                </p>
                <p className="text-sm text-muted-foreground/70 mt-2 max-w-md">
                  Real-time candlestick charts with technical indicators, volume analysis, and AI-powered pattern recognition
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge variant="outline" className="text-xs">TradingView</Badge>
                  <Badge variant="outline" className="text-xs">AI Analysis</Badge>
                  <Badge variant="outline" className="text-xs">WebSocket</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scientific Market Metrics */}
        <Card className="bg-gradient-to-br from-purple-50/5 to-blue-50/5 dark:from-purple-950/10 dark:to-blue-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Market Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'space-y-4 p-3' : 'space-y-4'}`}>
            {marketMetrics.map((metric) => {
              const IconComponent = metric.icon;
              return (
                <div key={metric.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <Badge
                      variant={
                        metric.status === 'positive' ? 'default' :
                        metric.status === 'negative' ? 'destructive' : 'secondary'
                      }
                      className="text-xs trading-metric"
                    >
                      {metric.value}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                  {/* Scientific progress bar */}
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metric.status === 'positive' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        metric.status === 'negative' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                        'bg-gradient-to-r from-blue-500 to-blue-600'
                      }`}
                      style={{
                        width: metric.name === 'Fear & Greed' ? '65%' :
                               metric.name === 'Volatility' ? '50%' :
                               metric.name === 'Liquidity' ? '85%' : '90%'
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Scientific Analysis Summary */}
            <div className="pt-4 border-t space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">AI Analysis Summary</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Market shows moderate bullish sentiment with increasing volume. Technical indicators suggest potential upward momentum in the short term.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      )}

      {/* Enhanced Scientific Intelligence Section */}
      {visibleSections.news && (
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              Scientific Intelligence
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSectionVisibility('news')}
              className="text-xs"
            >
              <EyeOff className="w-4 h-4 mr-1" />
              Hide
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Scientific Market News */}
        <Card className="bg-gradient-to-br from-green-50/5 to-blue-50/5 dark:from-green-950/10 dark:to-blue-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              Market Intelligence Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50/30 dark:bg-blue-950/20 rounded-r-lg hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300">Bitcoin ETF Sees Record Inflows</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Major ETF providers report $500M in new investments this week, bringing total ETF holdings to $12.8B
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2 flex-shrink-0 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">BTC</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                  <Badge variant="secondary" className="text-xs text-green-600">+2.1%</Badge>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50/30 dark:bg-green-950/20 rounded-r-lg hover:bg-green-50/50 dark:hover:bg-green-950/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-green-700 dark:text-green-300">Ethereum Dencun Upgrade Completed</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Dencun upgrade successfully deployed on mainnet, reducing gas fees by 90% for L2 transactions
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2 flex-shrink-0 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">ETH</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">5 hours ago</span>
                  <Badge variant="secondary" className="text-xs text-red-600">-1.2%</Badge>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50/30 dark:bg-purple-950/20 rounded-r-lg hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-300">DeFi TVL Reaches New High</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Total Value Locked in DeFi protocols hits $65B milestone, up 15% from last month
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2 flex-shrink-0 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">DeFi</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                  <Badge variant="secondary" className="text-xs text-green-600">+8.5%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scientific Market Sentiment */}
        <Card className="bg-gradient-to-br from-purple-50/5 to-green-50/5 dark:from-purple-950/10 dark:to-green-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Scientific Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enhanced Fear & Greed Index */}
            <div className="text-center">
              <div className="text-3xl font-bold trading-price text-orange-600 mb-2">65</div>
              <div className="text-sm font-medium">Fear & Greed Index</div>
              <Badge variant="secondary" className="mt-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Greed</Badge>
              <div className="w-full bg-muted rounded-full h-3 mt-3">
                <div className="bg-gradient-to-r from-red-500 via-orange-500 to-green-500 h-3 rounded-full" style={{width: '65%'}} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Extreme Fear</span>
                <span>Extreme Greed</span>
              </div>
            </div>

            {/* Scientific Market Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-lg font-bold trading-price text-blue-600 dark:text-blue-400">{liveData.marketCap}</div>
                <div className="text-xs text-muted-foreground">Global Cap</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-lg font-bold trading-volume text-green-600 dark:text-green-400">{liveData.volume24h}</div>
                <div className="text-xs text-muted-foreground">24h Volume</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-lg font-bold trading-metric text-purple-600 dark:text-purple-400">{liveData.btcDominance}</div>
                <div className="text-xs text-muted-foreground">BTC Dominance</div>
              </div>
               <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg border border-orange-200 dark:border-orange-800">
                 <div className="text-lg font-bold trading-metric text-orange-600 dark:text-orange-400">{liveData.activeTraders.toLocaleString()}</div>
                 <div className="text-xs text-muted-foreground">Active Traders</div>
               </div>
             </div>

             {/* AI Insights */}
             <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
               <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">AI Market Insights</h4>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Current market conditions indicate moderate risk appetite with increasing institutional adoption. Technical analysis suggests continued upward momentum.
               </p>
             </div>
           </CardContent>
         </Card>
           </div>
          </div>
        </MotionDiv>
      )}

      {/* Enhanced Scientific Tools & Actions */}
      {visibleSections.quickActions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Scientific Tools
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSectionVisibility('quickActions')}
              className="text-xs"
            >
              <EyeOff className="w-4 h-4 mr-1" />
              Hide
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Scientific Trading Tools */}
        <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-blue-50/5 to-purple-50/5 dark:from-blue-950/10 dark:to-purple-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Trading Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full p-2 rounded-md border hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors text-left text-sm">
              <div className="font-medium">Advanced Charts</div>
              <div className="text-xs text-muted-foreground">Technical analysis</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors text-left text-sm">
              <div className="font-medium">Price Alerts</div>
              <div className="text-xs text-muted-foreground">Set notifications</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors text-left text-sm">
              <div className="font-medium">Calculator</div>
              <div className="text-xs text-muted-foreground">Profit/loss calc</div>
            </button>
          </CardContent>
        </Card>

        {/* Scientific Portfolio Management */}
        <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-green-50/5 to-blue-50/5 dark:from-green-950/10 dark:to-blue-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full p-2 rounded-md border hover:bg-green-50/50 dark:hover:bg-green-950/30 transition-colors text-left text-sm">
              <div className="font-medium">My Holdings</div>
              <div className="text-xs text-muted-foreground trading-price">$12,450.00</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-green-50/50 dark:hover:bg-green-950/30 transition-colors text-left text-sm">
              <div className="font-medium">Performance</div>
              <div className="text-xs text-green-600 trading-change">+8.2% this month</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-green-50/50 dark:hover:bg-green-950/30 transition-colors text-left text-sm">
              <div className="font-medium">Watchlist</div>
              <div className="text-xs text-muted-foreground trading-metric">12 coins</div>
            </button>
          </CardContent>
        </Card>

        {/* Scientific Market Analysis */}
        <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-purple-50/5 to-green-50/5 dark:from-purple-950/10 dark:to-green-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full p-2 rounded-md border hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors text-left text-sm">
              <div className="font-medium">Market Scanner</div>
              <div className="text-xs text-muted-foreground">Find opportunities</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors text-left text-sm">
              <div className="font-medium">Heatmap</div>
              <div className="text-xs text-muted-foreground">Sector performance</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors text-left text-sm">
              <div className="font-medium">News Feed</div>
              <div className="text-xs text-muted-foreground">Latest updates</div>
            </button>
          </CardContent>
        </Card>

        {/* Scientific Quick Stats */}
        <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-orange-50/5 to-blue-50/5 dark:from-orange-950/10 dark:to-blue-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-500" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Markets</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">247</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">24h Change</span>
              <Badge variant="default" className="text-green-600 trading-change bg-green-100 dark:bg-green-900">+2.1%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Top Gainer</span>
              <Badge variant="outline" className="text-xs trading-change bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">SOL +12.5%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Top Loser</span>
              <Badge variant="outline" className="text-xs text-red-600 trading-change bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">DOT -5.2%</Badge>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export const CryptoDashboard = React.memo(CryptoDashboardComponent);
