"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, PieChart, Settings, ChevronDown, ChevronUp, Eye, EyeOff, MessageSquare } from "lucide-react";
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
    quickActions: true
  });
  
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();

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
      icon: DollarSign,
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
      icon: Activity,
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
      icon: BarChart3,
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
      icon: PieChart,
    },
  ], []);

  const indicators = useMemo(() => [
    { name: "RSI (14)", value: "65.4", status: "neutral" as const },
    { name: "MACD", value: "+125.3", status: "positive" as const },
    { name: "Volume (24h)", value: "$2.1B", status: "positive" as const },
    { name: "Market Cap", value: "$850B", status: "negative" as const },
  ], []);

  return (
    <div className={`overflow-y-auto h-full ${isMobile ? 'p-2 space-y-3' : 'p-3 sm:p-4 space-y-4 sm:space-y-6'}`}>
      {/* Dashboard Controls */}
      <div className={`flex flex-wrap items-center justify-between gap-2 pb-2 border-b ${isMobile ? 'flex-col sm:flex-row' : ''}`}>
        <div className="flex items-center gap-2">
          <h2 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Market Dashboard</h2>
          <Badge variant="secondary" className={`${isMobile ? 'text-[10px]' : 'text-xs'}`}>
            Live Data
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailedView(!showDetailedView)}
            className={`touch-target ${isMobile ? 'text-[10px] px-2 py-1' : 'text-xs'}`}
          >
            {showDetailedView ? <EyeOff className={`mr-1 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} /> : <Eye className={`mr-1 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />}
            {showDetailedView ? 'Simple' : 'Detailed'}
          </Button>
        </div>
      </div>

      {/* Enhanced Market Overview Cards */}
      <div className={`grid gap-3 sm:gap-4 ${
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
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-l-4 border-l-primary/20 touch-manipulation">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 sm:h-5 sm:w-5 text-primary" />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm font-semibold truncate">{coin.symbol}</CardTitle>
                    <p className="text-xs text-muted-foreground truncate">{coin.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-xs">#{coin.rank}</Badge>
                  {showDetailedView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCardExpansion(coin.symbol)}
                      className="h-6 w-6 p-0"
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
              <CardContent className="space-y-2 sm:space-y-3">
                {/* Main Price Display */}
                <div className="flex items-baseline gap-2">
                  <div className="text-xl sm:text-2xl font-bold trading-price">{coin.price}</div>
                  <div className={`flex items-center text-sm font-medium trading-change ${
                    coin.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {coin.changeType === 'positive' ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {coin.change}
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

                 {/* Expanded Details - Only show in detailed view when expanded */}
                 {showDetailedView && expandedCards.has(coin.symbol) && (
                   <div className="pt-3 border-t space-y-3">
                     {/* Technical Indicators */}
                     <div className="grid grid-cols-2 gap-2">
                       <div className="text-center">
                         <p className="text-xs text-muted-foreground">RSI (14)</p>
                         <p className="text-sm font-medium trading-metric">65.4</p>
                       </div>
                       <div className="text-center">
                         <p className="text-xs text-muted-foreground">MACD</p>
                         <p className="text-sm font-medium trading-metric text-green-600">+125.3</p>
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

      {/* Enhanced Charts and Analysis Section */}
      {visibleSections.charts && (
          <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Charts & Analysis</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSectionVisibility('charts')}
              className="text-xs"
            >
              <EyeOff className="w-4 h-4 mr-1" />
              Hide
            </Button>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Price Chart - Takes 2 columns on xl screens */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                BTC/USDT Price Chart
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">1H</Badge>
                <Badge variant="outline">24H</Badge>
                <Badge variant="secondary">7D</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20 relative overflow-hidden">
              {/* Mock chart visualization */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <path
                    d="M0,150 Q50,120 100,140 T200,100 T300,80 T400,60"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-primary"
                  />
                  <path
                    d="M0,180 Q50,160 100,170 T200,150 T300,140 T400,130"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                    className="text-muted-foreground"
                  />
                </svg>
              </div>
              <div className="text-center relative z-10">
                <BarChart3 className="w-16 h-16 mx-auto mb-3 text-muted-foreground/60" />
                <p className="text-lg font-medium text-muted-foreground">
                  Advanced Chart Integration
                </p>
                <p className="text-sm text-muted-foreground/70 mt-2 max-w-md">
                  Real-time candlestick charts with technical indicators, volume analysis, and drawing tools
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge variant="outline">TradingView</Badge>
                  <Badge variant="outline">Chart.js</Badge>
                  <Badge variant="outline">WebSocket</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Indicators - Takes 1 column */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Technical Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {indicators.map((indicator) => (
              <div key={indicator.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{indicator.name}</span>
                  <Badge
                    variant={
                      indicator.status === 'positive' ? 'default' :
                      indicator.status === 'negative' ? 'destructive' : 'secondary'
                    }
                    className="text-xs trading-metric"
                  >
                    {indicator.value}
                  </Badge>
                </div>
                {/* Mini progress bar for visual representation */}
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      indicator.status === 'positive' ? 'bg-green-500' :
                      indicator.status === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{
                      width: indicator.name === 'RSI (14)' ? '65%' :
                             indicator.name === 'MACD' ? '75%' :
                             indicator.name === 'Volume (24h)' ? '85%' : '55%'
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Additional quick stats */}
            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Fear & Greed</span>
                <Badge variant="secondary">65 (Greed)</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Liquidation Heatmap</span>
                <Badge variant="outline">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      )}

      {/* Enhanced Market Intelligence Section */}
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
            <h3 className="text-base font-semibold">Market Intelligence</h3>
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
        {/* Market News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Market News & Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50/30 dark:bg-blue-950/20 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Bitcoin ETF Sees Record Inflows</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Major ETF providers report $500M in new investments this week, bringing total ETF holdings to $12.8B
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">BTC</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                  <span className="text-xs text-green-600 font-medium">+2.1%</span>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50/30 dark:bg-green-950/20 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Ethereum Dencun Upgrade Completed</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Dencun upgrade successfully deployed on mainnet, reducing gas fees by 90% for L2 transactions
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">ETH</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">5 hours ago</span>
                  <span className="text-xs text-red-600 font-medium">-1.2%</span>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50/30 dark:bg-orange-950/20 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">DeFi TVL Reaches New High</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Total Value Locked in DeFi protocols hits $65B milestone, up 15% from last month
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">DeFi</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                  <span className="text-xs text-green-600 font-medium">+8.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Sentiment & Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Market Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fear & Greed Index */}
            <div className="text-center">
              <div className="text-3xl font-bold trading-price text-orange-600 mb-2">65</div>
              <div className="text-sm font-medium">Fear & Greed Index</div>
              <Badge variant="secondary" className="mt-1">Greed</Badge>
              <div className="w-full bg-muted rounded-full h-2 mt-3">
                <div className="bg-gradient-to-r from-red-500 via-orange-500 to-green-500 h-2 rounded-full" style={{width: '65%'}} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Fear</span>
                <span>Greed</span>
              </div>
            </div>

            {/* Quick Market Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold trading-price">$2.1T</div>
                <div className="text-xs text-muted-foreground">Global Cap</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold trading-volume">$89.2B</div>
                <div className="text-xs text-muted-foreground">24h Volume</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold trading-metric">56.2%</div>
                <div className="text-xs text-muted-foreground">BTC Dominance</div>
              </div>
               <div className="text-center p-3 bg-muted/30 rounded-lg">
                 <div className="text-lg font-bold trading-metric">1,247</div>
                 <div className="text-xs text-muted-foreground">Active Coins</div>
               </div>
             </div>
           </CardContent>
         </Card>
           </div>
          </div>
        </MotionDiv>
      )}

      {/* Enhanced Quick Actions & Tools */}
      {visibleSections.quickActions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Quick Actions</h3>
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
        {/* Trading Tools */}
        <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Trading Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full p-2 rounded-md border hover:bg-muted/50 transition-colors text-left text-sm">
              <div className="font-medium">Advanced Charts</div>
              <div className="text-xs text-muted-foreground">Technical analysis</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-muted/50 transition-colors text-left text-sm">
              <div className="font-medium">Price Alerts</div>
              <div className="text-xs text-muted-foreground">Set notifications</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-muted/50 transition-colors text-left text-sm">
              <div className="font-medium">Calculator</div>
              <div className="text-xs text-muted-foreground">Profit/loss calc</div>
            </button>
          </CardContent>
        </Card>

        {/* Portfolio Management */}
        <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full p-2 rounded-md border hover:bg-muted/50 transition-colors text-left text-sm">
              <div className="font-medium">My Holdings</div>
              <div className="text-xs text-muted-foreground trading-price">$12,450.00</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-muted/50 transition-colors text-left text-sm">
              <div className="font-medium">Performance</div>
              <div className="text-xs text-green-600 trading-change">+8.2% this month</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-muted/50 transition-colors text-left text-sm">
              <div className="font-medium">Watchlist</div>
              <div className="text-xs text-muted-foreground trading-metric">12 coins</div>
            </button>
          </CardContent>
        </Card>

        {/* Market Analysis */}
        <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full p-2 rounded-md border hover:bg-muted/50 transition-colors text-left text-sm">
              <div className="font-medium">Market Scanner</div>
              <div className="text-xs text-muted-foreground">Find opportunities</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-muted/50 transition-colors text-left text-sm">
              <div className="font-medium">Heatmap</div>
              <div className="text-xs text-muted-foreground">Sector performance</div>
            </button>
            <button className="w-full p-2 rounded-md border hover:bg-muted/50 transition-colors text-left text-sm">
              <div className="font-medium">News Feed</div>
              <div className="text-xs text-muted-foreground">Latest updates</div>
            </button>
          </CardContent>
        </Card>

        {/* Quick Stats & Info */}
        <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Markets</span>
              <Badge variant="secondary">247</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">24h Change</span>
              <Badge variant="default" className="text-green-600 trading-change">+2.1%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Top Gainer</span>
              <Badge variant="outline" className="text-xs trading-change">SOL +12.5%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Top Loser</span>
              <Badge variant="outline" className="text-xs text-red-600 trading-change">DOT -5.2%</Badge>
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
