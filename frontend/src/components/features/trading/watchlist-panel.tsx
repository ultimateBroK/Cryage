"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";
import { Badge } from "@/components/ui/base/badge";

interface WatchlistItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export function WatchlistPanel(): React.ReactElement {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTC/USDT");

  const items = useMemo<WatchlistItem[]>(() => [
    { symbol: "BTC/USDT", name: "Bitcoin", price: "$43,250", change: "+2.5%", isPositive: true },
    { symbol: "ETH/USDT", name: "Ethereum", price: "$2,650", change: "-1.2%", isPositive: false },
    { symbol: "SOL/USDT", name: "Solana", price: "$145.20", change: "+12.5%", isPositive: true },
    { symbol: "AVAX/USDT", name: "Avalanche", price: "$32.45", change: "+8.3%", isPositive: true },
    { symbol: "DOT/USDT", name: "Polkadot", price: "$6.85", change: "-5.2%", isPositive: false },
    { symbol: "LINK/USDT", name: "Chainlink", price: "$14.20", change: "-3.8%", isPositive: false },
  ], []);

  const onSelect = useCallback((symbol: string) => setSelectedSymbol(symbol), []);

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y glass-divider overflow-y-auto max-h-full">
          {items.map((item) => (
            <button
              key={item.symbol}
              type="button"
              onClick={() => onSelect(item.symbol)}
              className={`w-full text-left px-3 py-2 sm:px-4 sm:py-2.5 transition-colors ${
                selectedSymbol === item.symbol
                  ? "bg-foreground/5"
                  : "hover:bg-foreground/5"
              }`}
              aria-pressed={selectedSymbol === item.symbol}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{item.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">{item.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold trading-price">{item.price}</div>
                  <div className={`text-xs ${item.isPositive ? "crypto-text-green-dark" : "crypto-text-red-dark"} trading-change`}>
                    {item.change}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <Badge variant="outline" className="text-xs">{selectedSymbol}</Badge>
          <span className="text-xs text-muted-foreground">Tap an asset to focus</span>
        </div>
      </CardContent>
    </Card>
  );
}


