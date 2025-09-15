# Assistant Chat - Full Stack Application

This is a full-stack application with separate frontend and backend services.

## Project Structure

```
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── blocks/       # UI blocks/animations
│   ├── public/       # Static assets
│   └── scripts/      # Build scripts
├── backend/          # Python FastAPI backend
│   ├── main.py       # FastAPI application
│   └── pyproject.toml # Python dependencies
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Python 3.12+
- uv (Python package manager)

### Frontend Development

```bash
cd frontend
bun install
bun run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

### Backend Development

```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```

The backend will be available at [http://localhost:8000](http://localhost:8000)

### Running Both Services

You can run both frontend and backend simultaneously. Open two terminal windows:

**Terminal 1 (Frontend):**
```bash
cd frontend && bun run dev
```

**Terminal 2 (Backend):**
```bash
cd backend && uv run uvicorn main:app --reload
```

## Development

### Frontend Stack
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Assistant UI
- AI SDK

### Backend Stack
- FastAPI
- Python 3.12+
- LangChain
- Google GenAI
- Pydantic

## Scripts

### Frontend Scripts
```bash
cd frontend
bun run dev          # Development server
bun run build        # Production build
bun run start        # Production server
bun run lint         # Linting
```

### Backend Scripts
```bash
cd backend
uv run uvicorn main:app --reload  # Development server
uv run uvicorn main:app --host 0.0.0.0 --port 8000  # Production server
```

## Features

- **Integrated API Key Setup**: No need for environment files - API key can be configured directly in the UI
- **Clean Project Structure**: Separate frontend and backend for better maintainability  
- **Easy Development**: Simple scripts to run both services simultaneously
- **Modern Stack**: Next.js 15, React 19, FastAPI, and TypeScript

## Contributing

1. Make sure both frontend and backend start successfully
2. Test your changes in both environments
3. Follow the existing code structure and patterns