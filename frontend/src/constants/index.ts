/**
 * Application constants
 */

// Storage keys
export const STORAGE_KEYS = {
  API_KEY: 'gemini-api-key',
  MODEL: 'gemini-model',
  THEME: 'theme',
  AUTO_REFRESH: 'auto-refresh',
  NOTIFICATIONS: 'notifications',
  DARK_MODE: 'dark-mode',
} as const;

// AI Models
export const GEMINI_MODELS = [
  { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
] as const;

// API Endpoints
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  GENERATE_TITLE: '/api/generate-title',
  HEALTH: '/api/health',
} as const;

// Default values
export const DEFAULTS = {
  MODEL: 'gemini-2.5-flash',
  THEME: 'dark',
  AUTO_REFRESH: true,
  NOTIFICATIONS: false,
  DARK_MODE: true,
} as const;

// Cache settings
export const CACHE = {
  TITLE_TTL: 1000 * 60 * 60, // 1 hour
  MAX_CACHE_SIZE: 1000,
  MAX_SANITIZE_CACHE_SIZE: 500,
} as const;

// UI Settings
export const UI = {
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
  MAX_MOBILE_WIDTH: 768,
} as const;