/**
 * Theme state
 */
export type Theme = 'light' | 'dark' | 'system'

export interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

/**
 * UI state
 */
export interface UiState {
  activeSymbol: string
  activeTimeframe: string
  showSettings: boolean
  setActiveSymbol: (symbol: string) => void
  setActiveTimeframe: (timeframe: string) => void
  toggleSettings: () => void
}

/**
 * Chart state
 */
export interface ChartOptions {
  showVolume: boolean
  showGrid: boolean
  theme: 'light' | 'dark'
}

export interface ChartState {
  options: ChartOptions
  updateOptions: (options: Partial<ChartOptions>) => void
}
