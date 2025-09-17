"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PositionRow {
  symbol: string;
  side: "LONG" | "SHORT";
  size: string;
  entry: string;
  pnl: string;
  pnlPositive: boolean;
}

export function PositionsPanel(): React.ReactElement {
  const rows: PositionRow[] = [
    { symbol: "BTC/USDT", side: "LONG", size: "0.125 BTC", entry: "$42,120", pnl: "+$142.30", pnlPositive: true },
    { symbol: "ETH/USDT", side: "SHORT", size: "2.0 ETH", entry: "$2,720", pnl: "-$36.50", pnlPositive: false },
  ];

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="text-left font-medium py-2">Symbol</th>
                <th className="text-left font-medium py-2">Side</th>
                <th className="text-right font-medium py-2">Size</th>
                <th className="text-right font-medium py-2">Entry</th>
                <th className="text-right font-medium py-2">PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y glass-divider">
              {rows.map((r) => (
                <tr key={`${r.symbol}-${r.side}`}>
                  <td className="py-2">{r.symbol}</td>
                  <td className="py-2">
                    <Badge variant={r.side === "LONG" ? "default" : "destructive"} className="text-xs">
                      {r.side}
                    </Badge>
                  </td>
                  <td className="py-2 text-right">{r.size}</td>
                  <td className="py-2 text-right">{r.entry}</td>
                  <td className={`py-2 text-right ${r.pnlPositive ? "crypto-text-green-dark" : "crypto-text-red-dark"}`}>{r.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}


