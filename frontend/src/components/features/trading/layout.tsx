"use client";

import React from "react";
import { WatchlistPanel } from "./watchlist-panel";
import { ChartPanel } from "./chart-panel";
import { OrderBookPanel } from "./order-book-panel";
import { PositionsPanel } from "./positions-panel";
import { AgentPanel } from "./agent-panel";

export function TerminalLayout(): React.ReactElement {
	return (
		<div className="grid h-full w-full grid-rows-[auto_1fr] gap-2 p-2 sm:p-3">
			{/* Glass toolbar header for terminal context */}
			<div className="glass-toolbar rounded-xl px-3 py-2 flex items-center gap-3">
				<span className="text-sm font-medium">Terminal</span>
				<span className="text-xs text-muted-foreground">AI Agent × Trading</span>
			</div>

			{/* Responsive trading terminal grid */}
			<div className="grid gap-2 sm:gap-3 grid-cols-1 lg:grid-cols-12 auto-rows-[minmax(140px,auto)] h-full">
				{/* Left column: Watchlist (lg: span 3) */}
				<div className="lg:col-span-3 min-h-[240px]">
					<WatchlistPanel />
				</div>

				{/* Center: Chart (lg: span 6) */}
				<div className="lg:col-span-6 min-h-[320px]">
					<ChartPanel />
				</div>

				{/* Right: Order Book (lg: span 3) */}
				<div className="lg:col-span-3 min-h-[240px]">
					<OrderBookPanel />
				</div>

				{/* Bottom left: Positions (lg: span 6) */}
				<div className="lg:col-span-6 min-h-[220px]">
					<PositionsPanel />
				</div>

				{/* Bottom right: Agent Console (lg: span 6) */}
				<div className="lg:col-span-6 min-h-[220px]">
					<AgentPanel />
				</div>
			</div>
		</div>
	);
}
