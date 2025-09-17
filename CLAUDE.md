# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cryage is a crypto AI agent monorepo with a Next.js 15 frontend and FastAPI backend. The application provides intelligent crypto market analysis and conversation powered by Gemini AI.

## Development Commands

### Root Commands (Monorepo)
```bash
bun run dev              # Start both frontend and backend concurrently
bun run dev:frontend     # Start frontend only
bun run dev:backend      # Start backend only
bun run install:frontend # Install frontend dependencies
bun run install:backend  # Install backend dependencies
bun run build            # Build frontend
bun run lint             # Run frontend linting
bun run typecheck:frontend # Check TypeScript types
```

### Frontend Commands
```bash
cd frontend
bun run dev              # Development with Turbopack
bun run build            # Production build
bun run lint             # ESLint
bun run typecheck        # TypeScript checking
bun run analyze          # Bundle analysis
bun run perf             # Performance check
```

### Backend Commands
```bash
cd backend
uv sync                 # Install dependencies
uv run uvicorn main:app --reload  # Development server
```

## Architecture

### Monorepo Structure
- **Frontend-driven**: All user-visible features in Next.js frontend
- **Skeletal backend**: FastAPI backend is minimal placeholder for future expansion
- **AI via API routes**: Chat functionality handled entirely by Next.js API routes

### Key Components
- **Chat Interface**: `frontend/app/assistant.tsx` - Main UI shell with providers
- **AI API Routes**:
  - `frontend/app/api/chat/route.ts` - Streaming Gemini responses
  - `frontend/app/api/generate-title/route.ts` - Conversation title generation
- **State Management**: LocalStorage for thread titles and API keys
- **UI Components**: Organized in `frontend/components/` with subfolders for assistant-ui, ui, and terminal

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, AI SDK, Assistant UI
- **Backend**: FastAPI, Python 3.12+, uv (package manager)
- **AI**: Gemini 2.5 Flash via @ai-sdk/google
- **Build**: Bun.js (runtime and package manager)

## Development Patterns

### Code Style
- **TypeScript strict mode**: No `any` types, prefer interfaces over types
- **Functional components**: Use React hooks, avoid classes
- **Tailwind CSS**: Use existing design tokens and utilities in `app/globals.css`
- **Performance**: Dynamic imports for heavy components, minimize `use client`

### File Organization
- **Components**: Place in `frontend/components/` with descriptive names (lowercase-dashes)
- **API Routes**: Place in `frontend/app/api/` following Next.js App Router
- **Dynamic Imports**: Use for heavy/visual components (Aurora background, settings panel)
- **Styling**: Extend existing CSS variables in `globals.css` rather than custom styles

### AI/Chat Patterns
- **Model**: Use `gemini-2.5-flash` consistently unless feature requires variant
- **Streaming**: Use `streamText` from AI SDK for conversational responses
- **Reasoning**: Enabled via `thinkingConfig.includeThoughts` and `sendReasoning: true`
- **Caching**: Use simple Maps with TTL for lightweight memoization (see title generation)
- **API Key**: Managed via UI, injected via fetch monkey-patch in `assistant.tsx`

### Performance Optimization
- **Dynamic Loading**: Wrap heavy components in `dynamic(... { ssr: false })`
- **Idle Rendering**: Use `<Idle>` component to defer non-critical rendering
- **Bundle Analysis**: Use `bun run analyze` to monitor bundle size
- **Web Vitals**: Optimize for LCP, CLS, FID

## Security & State

### Security
- **No hardcoded secrets**: API keys managed in UI only
- **Input validation**: Validate all inputs in API routes
- **TypeScript**: Catch errors at compile time

### State Management
- **LocalStorage**: Used for thread titles and API key persistence
- **No global state**: Current scale doesn't require Redux/MobX/Zustand
- **Serverless**: Prefer Next.js API routes for small features

## Important Files

### Configuration
- `package.json` (root): Monorepo scripts and dependencies
- `frontend/package.json`: Frontend dependencies and scripts
- `backend/pyproject.toml`: Python dependencies
- `frontend/tsconfig.json`: TypeScript configuration

### Core Application
- `frontend/app/assistant.tsx`: Main chat interface with providers
- `frontend/app/api/chat/route.ts`: AI chat API endpoint
- `frontend/app/api/generate-title/route.ts`: Title generation with caching
- `frontend/app/globals.css`: Design tokens and utility classes

### UI Components
- `frontend/components/assistant-ui/`: Chat interface components
- `frontend/components/ui/`: Reusable UI components
- `frontend/blocks/Backgrounds/Aurora/`: Animated background

## Development Guidelines

### Adding New Features
1. **AI Features**: Place in `frontend/app/api/<feature>/route.ts` first
2. **Validation**: Always validate `apiKey` early in API routes
3. **Performance**: Use dynamic imports for heavy UI components
4. **Styling**: Extend existing CSS utilities rather than creating custom styles

### Before PR Checklist
- TypeScript passes (no `any`)
- New API route validates input and handles missing `apiKey`
- Dynamic imports for heavy/optional UI
- Uses existing design tokens and utilities
- No secret leakage or hardcoded keys

## Future Expansion

### Backend Integration
- Currently minimal (only `main.py` printing)
- Planned for market data integration via Binance API
- Will handle complex streaming and data fusion

### Trading Terminal
- Scaffolded under `frontend/components/terminal/`
- Planned panel-based layout with resizable grid
- Will integrate with backend for market data

## Notes

- **Bun.js**: Required as runtime and package manager
- **No src/ directory**: Frontend uses standard Next.js structure (app/, components/, etc.)
- **Glass/Neon styling**: Custom utility classes in `globals.css` using OKLCH colors
- **Mobile-first**: Responsive design with Tailwind CSS