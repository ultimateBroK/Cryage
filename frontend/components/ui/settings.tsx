"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const API_KEY_STORAGE_KEY = "gemini-api-key";
const MODEL_STORAGE_KEY = "gemini-model";

const GEMINI_MODELS = [
    { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
] as const;

// SettingsSidebar component that contains the settings content
export const SettingsSidebarPanel = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-flash");

  useEffect(() => {
    // Load settings from localStorage on component mount
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    const storedModel = localStorage.getItem(MODEL_STORAGE_KEY);

    if (storedApiKey) {
      setApiKey(storedApiKey);
    }

    if (storedModel && GEMINI_MODELS.some(model => model.value === storedModel)) {
      setSelectedModel(storedModel);
    }
  }, []);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, value);
      // Dispatch custom event to notify other components
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

  return (
    <SettingsSidebar>
      <SettingsSidebarHeader>
        <h2 className="text-lg font-semibold text-foreground">AI Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure your AI model and API key settings.
        </p>
      </SettingsSidebarHeader>
      <SettingsSidebarContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
          <div className="grid gap-2">
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
      </SettingsSidebarContent>
    </SettingsSidebar>
  );
};

// Settings trigger button component
export const Settings = () => {
  return <SettingsSidebarTrigger />;
};

export default Settings;
