# Cryage – AI Coding Agent Instructions

Concise, actionable guidance for AI assistants contributing to this repo. Focus on CURRENT patterns, not aspirations.

## 1. High-Level Architecture
- Monorepo: `frontend/` (Next.js 15 + React 19 + Bun) and `backend/` (FastAPI placeholder, future expansion).
- Frontend drives all user-visible features; backend is skeletal (only `main.py` printing) – AI chat currently handled entirely via Next.js API routes.
- AI flows: `/app/api/chat/route.ts` (streaming Gemini responses) and `/app/api/generate-title/route.ts` (conversation title generation with in-memory caching + sanitization).
- State persistence: thread titles + API key stored in `localStorage` (`thread-title-context.tsx`, fetch override in `assistant.tsx`). No server DB yet.

## 2. Core Frontend Conventions
- App Router structure: root layout in `app/layout.tsx`; primary UI shell lives inside `assistant.tsx` wrapped by providers.
- Dynamic imports used aggressively for heavy/visual blocks (Aurora background, settings panel) to keep initial bundle lean.
- Styling: Tailwind CSS v4 + custom design tokens in `app/globals.css` using OKLCH color values and glass / neon utility classes (`crypto-card-glass`, glow variants, tab styles).
- Prefer composition + small focused components inside `components/` (subfolders: `assistant-ui/`, `ui/`, `terminal/` (currently scaffolded but empty)).
- No inline `any`; rely on TypeScript inference. Avoid introducing global state libraries—current context via React providers only.

## 3. AI / Chat Patterns
- Chat route uses `@ai-sdk/google` with `streamText` and `convertToModelMessages`. Keep model name consistent: `gemini-2.5-flash` unless feature requires variant.
- Reasoning output is enabled via `thinkingConfig.includeThoughts` and surfaced with `sendReasoning: true` in `toUIMessageStreamResponse` – preserve this unless adding a toggle.
- Title generation route: Efficient caching (MD5 hash of contextual slices) + prompt constraints (3–8 words). If modifying, keep truncation, TTL (`CACHE_TTL`), and sanitization logic intact.

## 4. Performance & UX Tactics
- Avoid blocking hydration: large visuals lazy-loaded (`dynamic(... { ssr: false })`). Follow this when adding charts/terminal panels.
- Aurora background is wrapped in `<Idle>` with delayed mount (`Idle` component) to defer non-critical rendering.
- When adding new utilities: prefer extending existing CSS variables/utilities in `globals.css` rather than ad‑hoc styles.
- Keep focus rings accessible: reuse `.focus-ring` utility.

## 5. Planned Trading Terminal (WIP)
- Scaffolded placeholders under `components/terminal/` and `app/terminal/page.tsx` are empty. Follow panel pattern: glass container + heading + content area. Use existing glow / glass utilities.
- Layout should support resizable grid (future). If implementing: encapsulate in a `TradingTerminalLayout` component rather than modifying `assistant.tsx` directly.

## 6. Data & State Handling
- No server persistence yet—do NOT introduce DB calls arbitrarily. If adding persistence, place API expansion under new routes in `app/api/*` or expand backend FastAPI service (coordinate with roadmap in root `README.md`).
- Local caching patterns: simple Maps with TTL + cleanup (see generate-title). Mirror that approach for lightweight memoization.

## 7. File / Code Patterns to Emulate
- `app/api/generate-title/route.ts`: Example of defensive input validation + performance-conscious string slicing.
- `assistant.tsx`: Pattern for fetch monkey‑patch inserting API key—if adding new AI endpoints re-use this injection path.
- `thread-title-context.tsx`: LocalStorage hydration guarded by `typeof window` checks—replicate for any new browser-only persistence.

## 8. Adding New AI Features
- Place lightweight AI utilities inside `app/api/<feature>/route.ts` first; only move to `backend/` once complexity (stream multiplexing, external data fusion) justifies it.
- Always validate `apiKey` early; return structured JSON errors (`{ error, ... }`) with appropriate status.
- Stream responses when conversational or long-running; use `streamText` or similar from AI SDK.

## 9. Scripts & Tooling
- Root scripts orchestrate both services (`bun run dev` uses `concurrently`). Frontend scripts in `frontend/package.json` (analyze, perf checks, lint, typecheck).
- Type safety check: `bun run typecheck:frontend` (root) or `bun run typecheck` (frontend).
- Performance analysis: `bun run analyze` / `bun run perf` (frontend).

## 10. Style & Quality Guardrails
- Maintain OKLCH + token system; do not replace with hex unless tokenizing.
- Prefer serverless (Next API route) for small features to minimize infra drift.
- Avoid introducing Redux/MobX/Zustand—current scale doesn’t require it.
- Keep prompts minimal + deterministic (low `temperature` for utilities like title generation).

## 11. Safe Extension Checklist (Before PR)
1. TypeScript passes (no `any`).
2. New API route validates input + handles missing `apiKey`.
3. Dynamic imports for heavy / optional UI.
4. Uses existing design tokens + utilities.
5. No secret leakage / hardcoded keys.

## 12. Nice-to-Haves (If Adding Terminal Features Next)
- Provide skeleton loading shimmer (reuse shimmer keyframes in `globals.css`).
- Consider panel-level lazy rendering using React.Suspense.
- Use consistent naming: `<Feature>Panel.tsx` inside `components/terminal/`.

---
If anything here seems mismatched with intent or upcoming roadmap, ask for clarification before large-scale refactors.
