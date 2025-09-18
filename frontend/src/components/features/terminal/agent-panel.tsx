"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Activity, TrendingUp, TrendingDown } from "lucide-react";

export function AgentPanel(): React.ReactElement {
	return (
		<Card variant="glass" className="h-full">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm flex items-center gap-2">
					<MessageSquare className="w-4 h-4" />
					Agent Console
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="text-xs text-muted-foreground">
					Your AI agent can summarize market, draft strategies, and execute playbooks.
				</div>
				
				{/* Live Market Data Showcase */}
				<div className="space-y-2 pt-2 border-t">
					<div className="flex justify-between items-center">
						<span className="text-xs text-muted-foreground">BTC/USDT</span>
						<div className="flex items-center gap-2">
							<span className="text-sm font-bold trading-price">$43,250.00</span>
							<TrendingUp className="w-3 h-3 text-green-600" />
							<span className="text-xs trading-change text-green-600">+2.5%</span>
						</div>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-xs text-muted-foreground">ETH/USDT</span>
						<div className="flex items-center gap-2">
							<span className="text-sm font-bold trading-price">$2,650.00</span>
							<TrendingDown className="w-3 h-3 text-red-600" />
							<span className="text-xs trading-change text-red-600">-1.2%</span>
						</div>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-xs text-muted-foreground">Volume 24h</span>
						<span className="text-sm trading-volume">$2.1B</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-xs text-muted-foreground">Market Cap</span>
						<span className="text-sm trading-volume">$850B</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<Button variant="outline" size="sm" className="justify-start">
						Market Summary
					</Button>
					<Button variant="outline" size="sm" className="justify-start">
						Screen Opportunities
					</Button>
					<Button variant="outline" size="sm" className="justify-start">
						Risk Report
					</Button>
					<Button variant="outline" size="sm" className="justify-start">
						Create Plan
					</Button>
				</div>
				
				<div className="flex items-center gap-2 pt-2 border-t">
					<Badge variant="secondary" className="text-xs">Connected</Badge>
					<span className="text-xs text-muted-foreground">Gemini runtime</span>
				</div>
			</CardContent>
		</Card>
	);
}