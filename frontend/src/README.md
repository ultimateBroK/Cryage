# Frontend Source Structure

This document outlines the organized structure of the frontend source code following Next.js and React best practices.

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API routes
│   ├── assistant.tsx      # Main assistant page component
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── terminal/          # Terminal feature pages
├── components/            # Reusable UI components
│   ├── features/         # Feature-specific components
│   │   ├── assistant/    # Assistant-related components
│   │   ├── crypto/       # Cryptocurrency dashboard components
│   │   ├── navigation/   # Navigation and sidebar components
│   │   ├── settings/     # Settings panel components
│   │   └── terminal/     # Terminal interface components
│   ├── layouts/          # Layout components
│   ├── common/           # Common utility components
│   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   └── index.ts          # Main component exports
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and contexts
├── blocks/               # Complex UI blocks (animations, backgrounds)
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── styles/               # Global styles and CSS files
```

## Import Conventions

### Feature Components
```typescript
import { Thread, ThreadList } from '@/components/features/assistant';
import { CryptoDashboard } from '@/components/features/crypto';
```

### Layout Components
```typescript
import { MainLayout } from '@/components/layouts';
```

### UI Components
```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

### Common Components
```typescript
import { Idle, Motion } from '@/components/common';
```

### Hooks and Utilities
```typescript
import { useNotifications } from '@/hooks/use-notifications';
import { cn, formatCurrency } from '@/utils';
```

## Component Organization Principles

1. **Feature-Based Structure**: Components are organized by feature/domain rather than by type
2. **Barrel Exports**: Each feature directory has an index.ts file for clean imports
3. **Separation of Concerns**: UI components, business logic, and utilities are clearly separated
4. **Reusability**: Common components are extracted and made reusable
5. **Type Safety**: TypeScript interfaces and types are centralized in the types directory

## Benefits of This Structure

- **Scalability**: Easy to add new features without cluttering existing directories
- **Maintainability**: Related components are grouped together
- **Developer Experience**: Clear import paths and logical organization
- **Performance**: Better tree-shaking with explicit imports
- **Team Collaboration**: Consistent structure makes it easier for team members to navigate

## Adding New Components

1. **Feature Component**: Add to appropriate feature directory in `components/features/`
2. **UI Component**: Add to `components/ui/` for reusable UI elements
3. **Layout Component**: Add to `components/layouts/` for page layouts
4. **Common Component**: Add to `components/common/` for shared utilities

Always update the corresponding index.ts file to export new components.
