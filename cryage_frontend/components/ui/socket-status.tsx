'use client';

import { useEffect, useState } from 'react';
import { useSocket, SystemMessage } from '@/hooks/use-socket';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';

export function SocketStatus() {
  const {
    isConnected,
    systemMessages,
    clearSystemMessages,
    checkHealth,
    subscribe,
    unsubscribe
  } = useSocket();

  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check socket health periodically
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        checkHealth()
          .then((pingTime) => {
            setLatency(pingTime);
            setError(null);
          })
          .catch((err) => {
            setError(err.message);
          });
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isConnected, checkHealth]);

  // Function to test subscriptions
  const testSubscription = () => {
    const testChannel = 'market:BTC-USDT:1h';
    subscribe(testChannel);

    // Unsubscribe after 5 seconds
    setTimeout(() => {
      unsubscribe(testChannel);
    }, 5000);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Socket Connection</h3>
        <Badge variant={isConnected ? "success" : "destructive"}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      {latency !== null && (
        <div className="text-sm">
          Latency: <span className="font-mono">{latency}ms</span>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm">
          Error: {error}
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={testSubscription}
          disabled={!isConnected}
        >
          Test Subscription
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={clearSystemMessages}
        >
          Clear Messages
        </Button>
      </div>

      {systemMessages.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">System Messages</h4>
          <div className="max-h-32 overflow-y-auto text-sm space-y-1">
            {systemMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  msg.level === 'error'
                    ? 'bg-red-100 dark:bg-red-900/20'
                    : msg.level === 'warning'
                    ? 'bg-yellow-100 dark:bg-yellow-900/20'
                    : 'bg-blue-100 dark:bg-blue-900/20'
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
