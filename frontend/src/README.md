# Frontend Source Structure

This document outlines the organized structure of the frontend source code following Next.js and React best practices.

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API routes (AI chat, title generation)
│   │   ├── chat/          # ✅ AI chat functionality
│   │   └── generate-title/ # ✅ Auto conversation titles
│   ├── assistant.tsx      # ✅ Main assistant interface
│   ├── layout.tsx         # ✅ Root layout with providers
│   ├── page.tsx           # ✅ Home page
│   ├── loading.tsx        # ✅ Loading component
│   ├── error.tsx          # ✅ Error boundary
│   └── terminal/          # 🚧 Terminal feature page (scaffolded)
├── components/            # Reusable UI components
│   ├── features/         # Feature-specific components
│   │   ├── assistant/    # ✅ Assistant-related components
│   │   │   ├── thread.tsx           # Chat thread management
│   │   │   ├── thread-list.tsx     # Conversation history
│   │   │   ├── markdown-text.tsx   # Message rendering
│   │   │   └── tooltip-icon-button.tsx # UI helpers
│   │   ├── crypto/       # 🚧 Cryptocurrency dashboard
│   │   │   └── crypto-dashboard.tsx
│   │   ├── navigation/   # ✅ Navigation and sidebar
│   │   │   ├── app-sidebar.tsx     # Main navigation
│   │   │   └── contextual-sidebar.tsx
│   │   ├── settings/     # ✅ Settings panel
│   │   │   └── settings-panel.tsx
│   │   └── terminal/     # 🚧 Terminal interface panels
│   │       ├── agent-panel.tsx      # AI agent panel
│   │       ├── chart-panel.tsx      # Chart display
│   │       ├── order-book-panel.tsx # Order book
│   │       ├── positions-panel.tsx  # Trading positions
│   │       ├── watchlist-panel.tsx  # Watchlist
│   │       └── layout.tsx          # Terminal layout
│   ├── layouts/          # ✅ Layout components
│   │   └── main-layout.tsx
│   ├── common/           # ✅ Common utility components
│   │   ├── idle.tsx              # Deferred rendering
│   │   ├── motion.tsx            # Animation wrapper
│   │   ├── optimized-image.tsx   # Image optimization
│   │   ├── page-transition.tsx   # Page transitions
│   │   └── page-transition-wrapper.tsx
│   ├── ui/               # ✅ Base UI components (shadcn/ui)
│   │   ├── button.tsx    # Styled buttons
│   │   ├── card.tsx      # Card containers
│   │   ├── input.tsx     # Form inputs
│   │   ├── sidebar.tsx   # Sidebar components
│   │   ├── theme-toggle.tsx # Dark/light mode
│   │   ├── settings.tsx  # Settings interface
│   │   ├── tooltip.tsx   # Tooltips
│   │   ├── tabs.tsx      # Tab navigation
│   │   ├── badge.tsx     # Status badges
│   │   ├── skeleton.tsx  # Loading skeletons
│   │   ├── switch.tsx    # Toggle switches
│   │   ├── reasoning.tsx # AI reasoning display
│   │   └── cryage-logo.tsx # Application logo
│   └── index.ts          # ✅ Main component exports
├── hooks/                # ✅ Custom React hooks
│   ├── use-alerts.ts           # Alert management
│   ├── use-auto-thread-title.ts # Auto thread titles
│   ├── use-keyboard-shortcuts.ts # Keyboard shortcuts
│   ├── use-mobile.ts           # Mobile detection
│   ├── use-notifications.ts    # Notification system
│   ├── use-performance.ts      # Performance monitoring
│   └── use-scroll-animation.ts  # Scroll animations
├── lib/                  # ✅ Utility libraries and contexts
│   ├── agent-status-context.tsx # Agent status state
│   ├── thread-title-context.tsx # Thread title state
│   └── utils.ts               # Core utilities (cn function)
├── blocks/               # ✅ Complex UI blocks
│   ├── Backgrounds/      # Animated backgrounds
│   │   └── Aurora/       # Aurora background animation
│   └── Animations/      # UI animations
│       └── StarBorder/   # Star border effect
├── types/                # ✅ TypeScript type definitions
│   └── index.ts          # Common interfaces (Notification, CryptoData, etc.)
├── utils/                # ✅ Utility functions
│   └── index.ts          # Formatters, debounce, throttle, etc.
└── styles/               # ✅ Global styles and CSS
    └── globals.css       # Tailwind + custom design tokens
```

## Import Conventions

### Feature Components
```typescript
import { Thread, ThreadList } from '@/components/features/assistant';
import { CryptoDashboard } from '@/components/features/crypto';
import { TerminalLayout } from '@/components/features/terminal';
```

### Layout Components
```typescript
import { MainLayout } from '@/components/layouts';
```

### UI Components
```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings } from '@/components/ui/settings';
import { ThemeToggle } from '@/components/ui/theme-toggle';
```

### Common Components
```typescript
import { Idle, Motion } from '@/components/common';
import { PageTransitionWrapper } from '@/components/common/page-transition-wrapper';
```

### Hooks and Utilities
```typescript
import { useNotifications, usePerformance } from '@/hooks';
import { cn, formatCurrency, formatPercentage } from '@/utils';
import { type NotificationItem, type CryptoData } from '@/types';
```

### Context Providers
```typescript
import { AgentStatusProvider } from '@/lib/agent-status-context';
import { ThreadTitleProvider } from '@/lib/thread-title-context';
```

### Blocks/Animations
```typescript
import { Aurora } from '@/blocks/Backgrounds/Aurora';
import { StarBorder } from '@/blocks/Animations/StarBorder';
```

## Component Organization Principles

1. **Feature-Based Structure**: Components are organized by feature/domain rather than by type
2. **Barrel Exports**: Each directory has an index.ts file for clean imports and better tree-shaking
3. **Separation of Concerns**: UI components, business logic, and utilities are clearly separated
4. **Reusability**: Common components are extracted and made reusable across features
5. **Type Safety**: TypeScript interfaces and types are centralized in the types directory
6. **Performance**: Heavy components use dynamic imports and the Idle component for deferred rendering
7. **Accessibility**: All UI components follow accessibility best practices

## Key Design Patterns

### Context Pattern
State management using React Context for:
- Agent status tracking
- Thread title management
- Future: user preferences, theme state

### Feature Composition
Each feature is self-contained with:
- Components (`.tsx`)
- Types (defined in `types/index.ts`)
- Hooks (custom hooks in `hooks/`)
- Utilities (shared via `utils/`)

### Performance Optimization
- Dynamic imports for heavy components
- Idle component for deferred rendering
- Debounce/throttle utilities
- Bundle analysis scripts

## Benefits of This Structure

- **Scalability**: Easy to add new features without cluttering existing directories
- **Maintainability**: Related components are grouped together by feature
- **Developer Experience**: Clear import paths and logical organization
- **Performance**: Better tree-shaking with explicit imports and dynamic loading
- **Team Collaboration**: Consistent structure makes it easier for team members to navigate
- **Type Safety**: Centralized types ensure consistency across the application

## Adding New Components

### 1. Feature Component
Add to appropriate feature directory in `components/features/`:
```typescript
// components/features/new-feature/NewComponent.tsx
export const NewComponent = () => {
  return <div>New Feature Component</div>;
};

// components/features/new-feature/index.ts
export { NewComponent } from './NewComponent';
```

### 2. UI Component
Add to `components/ui/` for reusable UI elements:
```typescript
// components/ui/new-component.tsx
import { cn } from '@/lib/utils';

interface NewComponentProps {
  className?: string;
}

export const NewComponent = ({ className }: NewComponentProps) => {
  return <div className={cn('base-styles', className)}>New UI Component</div>;
};
```

### 3. Layout Component
Add to `components/layouts/` for page layouts:
```typescript
// components/layouts/new-layout.tsx
interface NewLayoutProps {
  children: React.ReactNode;
}

export const NewLayout = ({ children }: NewLayoutProps) => {
  return (
    <div className="layout-container">
      {children}
    </div>
  );
};
```

### 4. Common Component
Add to `components/common/` for shared utilities:
```typescript
// components/common/new-utility.tsx
export const NewUtility = () => {
  // Common utility logic
};
```

### 5. Hook
Add to `hooks/` for custom React hooks:
```typescript
// hooks/use-new-feature.ts
export const useNewFeature = () => {
  // Hook logic
  return { /* state and functions */ };
};
```

### 6. Type Definition
Add to `types/index.ts` for new interfaces:
```typescript
// types/index.ts
export interface NewFeatureType {
  id: string;
  // other properties
}
```

## Development Guidelines

### TypeScript
- Enable strict mode in `tsconfig.json`
- No `any` types - use proper TypeScript interfaces
- Prefer interfaces over types for object shapes
- Use generic types for reusable components

### Styling
- Use Tailwind CSS utility classes
- Extend existing design tokens in `styles/globals.css`
- Use the `cn` utility for conditional class merging
- Follow mobile-first responsive design

### Performance
- Use dynamic imports for heavy components: `dynamic(() => import('./Component'), { ssr: false })`
- Wrap non-critical components in `<Idle>` for deferred rendering
- Use React.memo for components that receive the same props frequently
- Implement proper key props in lists

### Accessibility
- Use semantic HTML elements
- Implement ARIA labels and roles
- Ensure keyboard navigation support
- Test with screen readers

## Best Practices

1. **Always update index.ts files** when adding new components for clean imports
2. **Use proper TypeScript typing** for all component props and return values
3. **Follow naming conventions**: PascalCase for components, camelCase for functions/variables
4. **Keep components small and focused** - single responsibility principle
5. **Use composition over inheritance** for component design
6. **Implement proper error boundaries** for error handling
7. **Add proper loading states** for async operations
8. **Write JSDoc comments** for complex components and utilities

## File Naming Conventions

- **Components**: PascalCase (e.g., `ThreadList.tsx`, `CryptoDashboard.tsx`)
- **Hooks**: camelCase with `use-` prefix (e.g., `useNotifications.ts`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Types**: PascalCase interfaces/types (e.g., `NotificationItem.ts`)
- **Files**: kebab-case for directories, descriptive names

This structure ensures a scalable, maintainable, and performant frontend architecture that can grow with the project's complexity.