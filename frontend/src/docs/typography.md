# Typography System for Cryage Trading App

## Font Configuration

### Primary Fonts
- **Inter**: Modern, clean sans-serif for body text and general UI
- **JetBrains Mono**: Highly readable monospace for trading data, prices, and numbers

### CSS Classes for Trading Data

#### Price Display
```html
<div class="trading-price">$43,250.00</div>
```
- Uses JetBrains Mono font
- Optimized for currency display
- Tabular numbers for consistent alignment

#### Percentage Changes
```html
<div class="trading-change">+2.5%</div>
<div class="trading-change text-red-600">-1.2%</div>
```
- Uses JetBrains Mono font
- Slightly tighter letter spacing for percentages
- Tabular numbers for consistent decimal alignment

#### Volume Data
```html
<div class="trading-volume">$2.1B</div>
```
- Uses JetBrains Mono font
- Optimized for large numbers and abbreviations
- Tabular numbers for consistent digit width

#### General Metrics
```html
<div class="trading-metric">65.4</div>
<div class="trading-metric">1,247</div>
```
- Uses JetBrains Mono font
- General purpose for all numerical data
- Tabular numbers with optimal letter spacing

### Utility Classes

#### Data Grid Optimization
```html
<div class="data-grid">
  <!-- All numbers will have tabular-nums -->
</div>
```

#### Price Display Enhancement
```html
<div class="price-display">
  <!-- Enhanced price display with tabular-nums -->
</div>
```

#### Metric Value Enhancement
```html
<div class="metric-value">
  <!-- Enhanced metric display with tabular-nums -->
</div>
```

## Font Features

### Tabular Numbers
All trading data fonts use `font-variant-numeric: tabular-nums` which:
- Ensures all digits have the same width
- Prevents number jumping in real-time updates
- Creates professional, aligned data displays

### Letter Spacing Optimization
- **Prices**: `letter-spacing: -0.02em` (tighter for currency)
- **Changes**: `letter-spacing: -0.01em` (balanced for percentages)
- **Metrics**: `letter-spacing: -0.01em` (optimal for general numbers)

## Usage Examples

### Market Data Card
```html
<div class="flex items-baseline gap-2">
  <div class="text-2xl font-bold trading-price">$43,250.00</div>
  <div class="flex items-center text-sm font-medium trading-change text-green-600">
    <TrendingUp class="h-4 w-4 mr-1" />
    +2.5%
  </div>
</div>
```

### Watchlist Item
```html
<div class="text-right">
  <div class="text-sm font-semibold trading-price">$2,650.00</div>
  <div class="text-xs trading-change text-red-600">-1.2%</div>
</div>
```

### Volume Display
```html
<div class="grid grid-cols-2 gap-2">
  <div>
    <p class="text-xs text-muted-foreground">Volume</p>
    <p class="text-sm font-medium trading-volume">$2.1B</p>
  </div>
  <div>
    <p class="text-xs text-muted-foreground">Market Cap</p>
    <p class="text-sm font-medium trading-volume">$850B</p>
  </div>
</div>
```

## Performance Benefits

1. **Better Readability**: Monospace font for data prevents misalignment
2. **Professional Appearance**: Consistent number formatting
3. **Real-time Updates**: Tabular numbers prevent UI jumping
4. **Accessibility**: Clear distinction between text and data
5. **Brand Consistency**: Unified typography system across app

## Implementation Notes

- Font variables are defined in `globals.css` under `@theme inline`
- Font imports are handled by Next.js in `layout.tsx`
- CSS classes are optimized for both light and dark themes
- All classes work with Tailwind's responsive utilities
- Font loading is optimized with `display: swap`