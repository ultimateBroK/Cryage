"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";

interface BookRow {
  price: string;
  size: string;
  total: string;
}

export function OrderBookPanel(): React.ReactElement {
  const asks = useMemo<BookRow[]>(() => [
    { price: "$43,280", size: "0.42", total: "0.42" },
    { price: "$43,275", size: "0.18", total: "0.60" },
    { price: "$43,270", size: "1.12", total: "1.72" },
    { price: "$43,265", size: "0.34", total: "2.06" },
    { price: "$43,260", size: "0.55", total: "2.61" },
  ], []);

  const bids = useMemo<BookRow[]>(() => [
    { price: "$43,240", size: "0.45", total: "0.45" },
    { price: "$43,235", size: "0.26", total: "0.71" },
    { price: "$43,230", size: "0.92", total: "1.63" },
    { price: "$43,225", size: "0.40", total: "2.03" },
    { price: "$43,220", size: "0.61", total: "2.64" },
  ], []);

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {/* Asks */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Asks</div>
            <div className="space-y-1">
              {asks.map((row, i) => (
                <div key={i} className="relative overflow-hidden rounded-md border px-2 py-1.5">
                  <div className="absolute inset-y-0 right-0 bg-red-500/10" style={{ width: `${20 + i * 12}%` }} />
                  <div className="relative z-10 flex justify-between text-xs">
                    <span className="text-red-500 font-medium">{row.price}</span>
                    <span className="text-muted-foreground">{row.size}</span>
                    <span className="text-foreground/80">{row.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bids */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Bids</div>
            <div className="space-y-1">
              {bids.map((row, i) => (
                <div key={i} className="relative overflow-hidden rounded-md border px-2 py-1.5">
                  <div className="absolute inset-y-0 left-0 bg-green-500/10" style={{ width: `${20 + i * 12}%` }} />
                  <div className="relative z-10 flex justify-between text-xs">
                    <span className="text-green-500 font-medium">{row.price}</span>
                    <span className="text-muted-foreground">{row.size}</span>
                    <span className="text-foreground/80">{row.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


