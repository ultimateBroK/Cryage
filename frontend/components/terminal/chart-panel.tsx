"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

export function ChartPanel(): React.ReactElement {
  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> BTC/USDT</span>
          <div className="hidden sm:flex gap-1">
            <Badge variant="outline">1H</Badge>
            <Badge variant="outline">24H</Badge>
            <Badge variant="secondary">7D</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 md:h-96 lg:h-[28rem] rounded-lg border-2 border-dashed border-muted-foreground/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              <path d="M0,150 Q50,120 100,140 T200,100 T300,80 T400,60" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary" />
              <path d="M0,180 Q50,160 100,170 T200,150 T300,140 T400,130" stroke="currentColor" strokeWidth="1" fill="none" className="text-muted-foreground" />
            </svg>
          </div>
          <div className="text-center relative z-10 p-6">
            <BarChart3 className="w-14 h-14 mx-auto mb-3 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">Integrate TradingView or advanced charts here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


