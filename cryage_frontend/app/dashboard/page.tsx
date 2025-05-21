'use client';

import { SocketStatus } from '@/components/ui/socket-status';
import { ChartContainer } from '@/components/dashboard/chart-container';

export default function Dashboard() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <ChartContainer />

        <div className="grid items-start gap-6 lg:col-span-1">
          <SocketStatus />

          <div className="rounded-xl border bg-card p-6 shadow">
            <h3 className="text-lg font-medium">AI Analysis</h3>
            <div className="mt-2 text-sm text-muted-foreground">
              AI analysis will appear here
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow">
            <h3 className="text-lg font-medium">Technical Indicators</h3>
            <div className="mt-2 text-sm text-muted-foreground">
              Technical indicators will appear here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
