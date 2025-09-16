"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Key, Database, Shield } from "lucide-react";

const API_KEY_STORAGE_KEY = "gemini-api-key";

export const SettingsPanel = () => {
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setHasApiKey(true);
      setApiKey(savedApiKey);
    }

    // Load other preferences
    const savedAutoRefresh = localStorage.getItem("auto-refresh");
    const savedNotifications = localStorage.getItem("notifications");
    const savedDarkMode = localStorage.getItem("dark-mode");

    if (savedAutoRefresh !== null) {
      setAutoRefresh(savedAutoRefresh === "true");
    }
    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true");
    }
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      setHasApiKey(true);

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('apiKeyUpdated'));

      // Show success message
      alert("API key saved successfully!");
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey("");
    setHasApiKey(false);
    window.dispatchEvent(new CustomEvent('apiKeyUpdated'));
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    localStorage.setItem(key, value.toString());

    switch (key) {
      case "auto-refresh":
        setAutoRefresh(value);
        break;
      case "notifications":
        setNotifications(value);
        break;
      case "dark-mode":
        setDarkMode(value);
        break;
    }
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-api">Gemini API Key</Label>
            <div className="flex gap-2">
              <Input
                id="gemini-api"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
                Save
              </Button>
            </div>
            {hasApiKey && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  API Key Configured
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearApiKey}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>
            )}
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
        </CardContent>
      </Card>

      {/* Dashboard Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Dashboard Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-refresh" className="text-sm font-medium">
                Auto-refresh data
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically update market data every 30 seconds
              </p>
            </div>
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={(checked) => handlePreferenceChange("auto-refresh", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-sm font-medium">
                Price alerts
              </Label>
              <p className="text-xs text-muted-foreground">
                Get notified when prices reach your target levels
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={(checked) => handlePreferenceChange("notifications", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-sm font-medium">
                Dark mode
              </Label>
              <p className="text-xs text-muted-foreground">
                Use dark theme for better visibility
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={(checked) => handlePreferenceChange("dark-mode", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Local storage only</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              All data is stored locally in your browser. No data is sent to external servers except for AI chat.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              <Database className="w-4 h-4 mr-2" />
              Export Settings
            </Button>
            <Button variant="outline" className="w-full">
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About Cryage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Version</span>
              <Badge variant="outline">1.0.0</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">AI Model</span>
              <Badge variant="outline">Gemini 2.5 Flash</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Last Updated</span>
              <span className="text-sm text-muted-foreground">Dec 2024</span>
            </div>
          </div>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using Next.js, React, and AI
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="ghost" size="sm">
                <a
                  href="https://github.com/ultimateBroK/cryage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  GitHub
                </a>
              </Button>
              <Button variant="ghost" size="sm">
                Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};