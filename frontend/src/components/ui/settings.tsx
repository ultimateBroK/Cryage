"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bell, X } from "lucide-react";
import {
  SettingsSidebar,
  SettingsSidebarContent,
  SettingsSidebarHeader,
  SettingsSidebarTrigger,
} from "@/components/ui/settings-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlerts } from "@/hooks/use-alerts";
import { useNotifications } from "@/hooks/use-notifications";

const API_KEY_STORAGE_KEY = "gemini-api-key";
const MODEL_STORAGE_KEY = "gemini-model";

const GEMINI_MODELS = [
    { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
] as const;

// Enhanced SettingsSidebar component with comprehensive settings
export const SettingsSidebarPanel = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-flash");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { alerts, activeAlerts, toggleAlert } = useAlerts();
  const { notifications: notificationList, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Load saved settings on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    const savedModel = localStorage.getItem(MODEL_STORAGE_KEY);
    const savedAutoRefresh = localStorage.getItem("auto-refresh");
    const savedNotifications = localStorage.getItem("notifications");
    const savedDarkMode = localStorage.getItem("dark-mode");

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedModel && GEMINI_MODELS.some(model => model.value === savedModel)) {
      setSelectedModel(savedModel);
    }
    if (savedAutoRefresh !== null) setAutoRefresh(savedAutoRefresh === "true");
    if (savedNotifications !== null) setNotifications(savedNotifications === "true");
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === "true");
  }, []);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, value);
      window.dispatchEvent(new CustomEvent('apiKeyUpdated'));
    } catch (error) {
      console.error("Failed to save API key to localStorage:", error);
    }
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    try {
      localStorage.setItem(MODEL_STORAGE_KEY, value);
    } catch (error) {
      console.error("Failed to save model selection to localStorage:", error);
    }
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    try {
      localStorage.setItem(key, value.toString());
      if (key === "auto-refresh") setAutoRefresh(value);
      if (key === "notifications") setNotifications(value);
      if (key === "dark-mode") setDarkMode(value);
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  };

  return (
    <SettingsSidebar>
      <SettingsSidebarHeader>
        <h2 className="text-lg font-semibold text-foreground">Settings & Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Configure your AI, dashboard, and privacy settings.
        </p>
      </SettingsSidebarHeader>
      <SettingsSidebarContent>
        <div className="space-y-6">
          {/* API Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">AI Configuration</h3>

            <div className="space-y-2">
              <Label htmlFor="api-key">Gemini API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {GEMINI_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Alerts */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Price Alerts</h3>

            <div className="space-y-3">
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{alert.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {alert.condition === 'above' ? 'Above' :
                         alert.condition === 'below' ? 'Below' :
                         alert.condition === 'rsi_above' ? 'RSI Above' :
                         alert.condition === 'rsi_below' ? 'RSI Below' :
                         'Volume Spike'} {alert.value}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAlert(alert.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground text-center py-2">
                  No active alerts
                </div>
              )}

              <Button variant="outline" size="sm" className="w-full">
                <Bell className="w-4 h-4 mr-2" />
                Add Alert
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                  Mark all read
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {notificationList.length > 0 ? (
                notificationList.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2 rounded text-xs ${notif.isRead ? 'bg-muted/30' : 'bg-muted/70'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{notif.title}</div>
                        <div className="text-muted-foreground mt-1">{notif.message}</div>
                        <div className="text-muted-foreground mt-1">
                          {notif.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      {!notif.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notif.id)}
                          className="h-6 w-6 p-0 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground text-center py-4">
                  No notifications
                </div>
              )}
            </div>

            {notificationList.length > 5 && (
              <div className="text-xs text-muted-foreground text-center">
                +{notificationList.length - 5} more notifications
              </div>
            )}
          </div>

          {/* Dashboard Preferences */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Dashboard Preferences</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-refresh" className="text-sm">
                  Auto-refresh data
                </Label>
                <input
                  id="auto-refresh"
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => handlePreferenceChange("auto-refresh", e.target.checked)}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm">
                  Price alerts
                </Label>
                <input
                  id="notifications"
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => handlePreferenceChange("notifications", e.target.checked)}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-sm">
                  Dark mode
                </Label>
                <input
                  id="dark-mode"
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => handlePreferenceChange("dark-mode", e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Data & Privacy</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Local storage only</span>
                <span className="text-xs text-green-600">✓</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All data is stored locally in your browser. No data is sent to external servers except for AI chat.
              </p>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Keyboard Shortcuts</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>Open Settings</span>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl + ,</kbd>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Switch to Chat</span>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl + 1</kbd>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Switch to Dashboard</span>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl + 2</kbd>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>New Chat</span>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl + N</kbd>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Recent Activity</h3>
            <div className="space-y-2">
              {alerts.length > 0 ? (
                alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="text-xs text-muted-foreground">
                    • {alert.symbol} alert {alert.isActive ? 'activated' : 'deactivated'} - {alert.createdAt.toLocaleDateString()}
                  </div>
                ))
              ) : (
                <>
                  <div className="text-xs text-muted-foreground">
                    • API key updated - 2h ago
                  </div>
                  <div className="text-xs text-muted-foreground">
                    • Settings exported - 1d ago
                  </div>
                  <div className="text-xs text-muted-foreground">
                    • Theme changed - 3d ago
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </SettingsSidebarContent>
    </SettingsSidebar>
  );
};

// Enhanced Settings trigger button component
export const Settings = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const { activeAlerts } = useAlerts();

  // Check for API key on mount
  useEffect(() => {
    const checkStatus = () => {
      const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      setHasApiKey(!!apiKey?.trim());
    };

    checkStatus();

    // Listen for changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === API_KEY_STORAGE_KEY) {
        checkStatus();
      }
    };

    // Listen for custom API key update events
    const handleApiKeyUpdate = () => checkStatus();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('apiKeyUpdated', handleApiKeyUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apiKeyUpdated', handleApiKeyUpdate);
    };
  }, []);

  const hasActiveAlerts = activeAlerts.length > 0;
  const needsAttention = !hasApiKey || hasActiveAlerts;
  const attentionCount = (!hasApiKey ? 1 : 0) + (hasActiveAlerts ? 1 : 0);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <SettingsSidebarTrigger
              className={`group hover:bg-muted/50 transition-all duration-300 w-8 h-8 sm:w-9 sm:h-9 ${
                hasApiKey 
                  ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            />
            {/* Status indicators */}
            {needsAttention && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
            {hasApiKey && !hasActiveAlerts && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">Settings & Preferences</p>
            {hasApiKey && !hasActiveAlerts && (
              <p className="text-xs text-green-400">
                ✓ API key configured
              </p>
            )}
            {attentionCount > 0 && (
              <p className="text-xs text-red-400">
                {attentionCount} item{attentionCount > 1 ? 's' : ''} need{attentionCount > 1 ? '' : 's'} attention
              </p>
            )}
            {!hasApiKey && (
              <p className="text-xs text-yellow-400">• API key required</p>
            )}
            {hasActiveAlerts && (
              <p className="text-xs text-orange-400">
                • {activeAlerts.length} active alert{activeAlerts.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Settings;
