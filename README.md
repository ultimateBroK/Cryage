# 🚀 Cryage — Intelligent Crypto AI Agent

> **Transform your crypto trading with AI-powered market analysis and intelligent conversation**

## ✨ What is Cryage?

**Cryage** is a next-generation crypto AI agent that combines advanced market analysis with intelligent conversation. Built for traders, analysts, and crypto enthusiasts who want to make informed decisions with AI assistance.

### 🎯 Key Features

- 🤖 **Intelligent Chat Interface** - Powered by Gemini 2.5 Flash with advanced reasoning
- 📊 **Real-time Market Analysis** - Live crypto data with technical indicators (Coming Soon)
- 📈 **Demo Trading Signals** - AI-generated paper trading signals with rationale (Coming Soon)
- 🎨 **Beautiful Modern UI** - Responsive design with stunning Aurora animations
- ⚡ **Lightning Fast** - Optimized performance with Next.js 15 and React 19
- 🔐 **Secure & Private** - No hardcoded secrets, API keys managed in-app

### 🌟 Why Choose Cryage?

| Traditional Tools | 🚀 Cryage AI Agent |
|-------------------|---------------------|
| Static charts only | Interactive AI conversations about markets |
| Manual analysis | AI-powered technical analysis |
| Generic signals | Personalized insights with reasoning |
| Complex setup | One-click start, no configuration needed |
| Outdated UI | Modern, beautiful interface |

## 🎬 Demo

*Coming Soon: Video demo showcasing live market analysis and AI conversations*

## 🚀 Quick Start - Try It Now!

```bash
# Clone the repository
git clone https://github.com/your-username/cryage-crypto-ai.git
cd cryage-crypto-ai

# Start frontend (Chat works immediately!)
cd frontend && bun install && bun run dev
# Visit http://localhost:3000 and start chatting with AI

# Optional: Start backend for future features
cd ../backend && uv sync && uv run uvicorn main:app --reload
```

**🎉 That's it!** Configure your Gemini API key in the settings and start having intelligent crypto conversations.

## 📁 Project Structure

```
cryage-crypto-ai/
├── 🎨 frontend/              # Next.js 15 + React 19 Frontend
│   ├── app/                  # App Router pages & API routes
│   │   ├── api/             # Backend API endpoints
│   │   │   ├── chat/        # ✅ AI chat functionality
│   │   │   └── generate-title/ # ✅ Auto thread titles
│   │   ├── assistant.tsx    # Main chat interface
│   │   ├── globals.css      # Global styles
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable React components
│   │   ├── assistant-ui/    # Chat interface components
│   │   │   ├── thread.tsx   # ✅ Chat thread management
│   │   │   ├── thread-list.tsx # ✅ Thread history
│   │   │   └── markdown-text.tsx # ✅ Message rendering
│   │   ├── ui/              # UI component library
│   │   │   ├── button.tsx   # Styled buttons
│   │   │   ├── sidebar.tsx  # Navigation sidebar
│   │   │   ├── settings.tsx # ✅ API key management
│   │   │   └── theme-toggle.tsx # Dark/light mode
│   │   └── app-sidebar.tsx  # ✅ Main navigation
│   ├── blocks/              # Advanced UI blocks
│   │   └── Backgrounds/
│   │       └── Aurora/      # ✅ Beautiful animated background
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── public/              # Static assets
│
├── 🐍 backend/               # FastAPI Python Backend
│   ├── main.py              # 🚧 FastAPI application (basic structure)
│   ├── pyproject.toml       # Python dependencies
│   └── README.md            # Backend documentation
│
├── 📋 package.json           # Monorepo scripts
├── 📖 README.md             # This file
└── 🎯 CRUSH.md              # Development guidelines
```

## 🏗️ Architecture Overview

```mermaid
graph LR
    A[🎨 Next.js Frontend] --> B[🔌 API Routes]
    B --> C[🤖 Gemini AI]
    A --> D[📊 Chart Component]
    B --> E[🐍 FastAPI Backend]
    E --> F[📈 Binance API]
    E --> G[🗄️ SQLite Database]
    E --> H[🧠 AI Agent]
```

## ✅ Current Features (Available Now)

| Feature | Status | Description |
|---------|--------|-------------|
| 🤖 **Intelligent Chat** | ✅ **Live** | Full conversation with Gemini 2.5 Flash + reasoning |
| 🧵 **Thread Management** | ✅ **Live** | Auto-generated titles, conversation history |
| 🎨 **Modern UI** | ✅ **Live** | Responsive design with Aurora animations |
| 🔐 **API Key Management** | ✅ **Live** | Configure directly in UI, no env files needed |
| ⚡ **Performance Optimized** | ✅ **Live** | Dynamic imports, caching, optimized bundle |

## 🎯 Roadmap - Coming Soon

| Feature | Status | Description |
|---------|--------|-------------|
| 📊 **Live Market Charts** | 🚧 **Next** | Real-time crypto data with technical indicators |
| 🧠 **AI Market Analysis** | 🚧 **In Progress** | Context-aware analysis combining technical + sentiment |
| 📈 **Demo Trading Signals** | 🚧 **Planned** | Paper trading signals with AI rationale |
| 🔄 **Enhanced Chat** | 🚧 **Planned** | Market-aware conversations and analysis |

## 🛠️ Tech Stack & Dependencies

### Frontend Stack
```json
{
  "framework": "Next.js 15 with App Router",
  "ui": "React 19 + TypeScript",
  "styling": "Tailwind CSS + shadcn/ui",
  "ai": "AI SDK + Assistant UI",
  "animations": "Framer Motion + React Bits",
  "performance": "Dynamic imports + Bundle optimization"
}
```

### Backend Stack
```json
{
  "api": "FastAPI + Python 3.12+",
  "ai": "LangChain + Google GenAI",
  "data": "Binance API (planned)",
  "storage": "SQLite (planned)",
  "deployment": "uv + uvicorn"
}
```

## 📊 API Endpoints

### ✅ Currently Available
```typescript
POST /api/chat
// Real-time AI conversations with Gemini 2.5 Flash
// Supports reasoning, context, and intelligent responses

POST /api/generate-title  
// Auto-generate conversation titles
// Smart caching and optimization included
```

### 🚧 Coming Soon
```typescript
GET /api/markets/snapshot?symbol=BTC_USDT&interval=1m
// Live market data with technical indicators
// Returns: prices, EMA, RSI, MACD, signals

GET /api/markets/stream?symbol=BTC_USDT
// Server-Sent Events for real-time updates
// Streams: candles, indicators, AI signals

POST /api/agent/analyze
// AI market analysis with context
// Returns: summary, key points, recommendations
```

## 🔧 Installation & Setup

### Prerequisites
- **Node.js 18+** or **Bun** (recommended)
- **Python 3.12+** 
- **uv** (Python package manager)

### Method 1: Quick Start (Recommended)
```bash
# Clone and start immediately
git clone https://github.com/ultimateBroK/cryage.git
cd cryage

# One command to rule them all
bun run dev
```

### Method 2: Manual Setup
```bash
# Frontend setup
cd frontend
bun install
bun run dev

# Backend setup (in new terminal)
cd backend  
uv sync
uv run uvicorn main:app --reload
```

### Method 3: Development Mode
```bash
# Install dependencies
bun run install:frontend
bun run install:backend

# Start both services
bun run dev:frontend  # Terminal 1
bun run dev:backend   # Terminal 2
```

## 🚀 Available Scripts

### 🎯 One-Command Start
```bash
bun run dev              # Start both frontend & backend
```

### 🎨 Frontend Commands
```bash
cd frontend
bun run dev              # Development server with Turbopack
bun run build            # Production build
bun run start            # Production server  
bun run lint             # ESLint checks
bun run build:analyze    # Bundle analyzer
```

### 🐍 Backend Commands  
```bash
cd backend
uv run uvicorn main:app --reload    # Development server
uv sync                             # Install dependencies
```

### 📦 Monorepo Commands
```bash
bun run dev:frontend     # Frontend only
bun run dev:backend      # Backend only
bun run install:frontend # Install frontend deps
bun run install:backend  # Install backend deps
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 🎯 Current Priorities
1. **Try the chat system** - It's fully functional now!
2. **Market data integration** - Help us add live crypto data
3. **Chart visualization** - Implement beautiful trading charts
4. **AI enhancements** - Improve market analysis capabilities

### 🔧 Development Guidelines
- ✅ **TypeScript strict mode** - No `any` types allowed
- ✅ **Functional components** - Use React hooks
- ✅ **Tailwind CSS** - No custom CSS unless necessary
- ✅ **Performance first** - Dynamic imports, optimization
- ✅ **Security conscious** - No hardcoded secrets

### 📋 Contribution Process
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Test** your changes thoroughly
4. **Submit** a pull request with clear description
5. **Follow** existing code patterns and conventions

## 🛡️ Security & Performance

### 🔒 Security Features
- 🔐 **No hardcoded secrets** - API keys managed in UI
- 🛡️ **Input validation** - All user inputs sanitized
- 🔍 **TypeScript strict mode** - Catch errors at compile time
- 🚫 **No eval/exec** - Safe code execution only

### ⚡ Performance Optimizations
- 🚀 **Next.js 15** - Latest performance improvements
- 📦 **Dynamic imports** - Lazy load components
- 💾 **Smart caching** - Optimized API responses
- 🎯 **Bundle optimization** - Minimal bundle size
- 📊 **Performance monitoring** - Track Web Vitals

## 📈 Project Stats

- 🎯 **Chat System**: 100% functional
- 🚀 **Performance Score**: 95+ (Lighthouse)
- 🔒 **Security**: Hardened & validated
- 📱 **Mobile Support**: Fully responsive
- 🌙 **Dark Mode**: Built-in theme support

## ✨ Technologies

### 🥇 Programming Languages
<table>
  <tr>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=python&titles=true" alt="Python" /><br>
      <b>Python</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=javascript&titles=true" alt="JavaScript" /><br>
      <b>JavaScript</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=typescript&titles=true" alt="TypeScript" /><br>
      <b>TypeScript</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=css&titles=true" alt="CSS" /><br>
      <b>CSS</b>
    </td>
  </tr>
</table>

### 🤖 AI & Machine Learning Platforms
<table>
  <tr>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=agno&titles=true" alt="Agno" /><br>
      <b>Agno</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=gemini&titles=true" alt="Gemini" /><br>
      <b>Gemini</b>
    </td>
  </tr>
</table>

### 📊 Data & Trading APIs
<table>
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/binance?viewbox=auto" width="48" height="48" alt="Binance" /><br>
      <b>Binance</b>
    </td>
  </tr>
</table>

### 🎨 Frontend Frameworks & UI Libraries
<table>
  <tr>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=react&titles=true" alt="React" /><br>
      <b>React</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=nextjs&titles=true" alt="Next.js" /><br>
      <b>Next.js</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=tailwindcss&titles=true" alt="Tailwind CSS" /><br>
      <b>Tailwind CSS</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=shadcn&titles=true" alt="Shadcn" /><br>
      <b>Shadcn/ui</b>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.brandfetch.io/idJGnLFA9x/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B" width="48" height="48" alt="TradingView" /><br>
      <b>TradingView</b>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.brandfetch.io/idDJv1mfrb/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" width="48" height="48" alt="Motion" /><br>
      <b>Motion</b>
    </td>
  </tr>
</table>

### ⚙️ Backend & API Development
<table>
  <tr>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=bun&titles=true" alt="Bun" /><br>
      <b>Bun</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=fastapi&titles=true" alt="FastAPI" /><br>
      <b>FastAPI</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=socketio&titles=true" alt="Socket.IO" /><br>
      <b>Socket.IO</b>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.brandfetch.io/idCF8uvFtt/w/720/h/720/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B" width="48" height="48" alt="Uvicorn" /><br>
      <b>Uvicorn</b>
    </td>
  </tr>
</table>

### 🗄️ Databases & Storage
<table>
  <tr>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=sqlite&titles=true" alt="SQLite" /><br>
      <b>SQLite</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=agno&titles=true" alt="Agno" /><br>
      <b>Agno</b>
    </td>
  </tr>
</table>

### 🐳 DevOps & Deployment
<table>
  <tr>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=docker&titles=true" alt="Docker" /><br>
      <b>Docker</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=vercel&titles=true" alt="Vercel" /><br>
      <b>Vercel</b>
    </td>
    <td align="center" width="120">
      <img src="https://go-skill-icons.vercel.app/api/icons?i=git&titles=true" alt="Git" /><br>
      <b>Git</b>
    </td>
  </tr>
</table>

</div>

## ⚠️ Disclaimer

**Cryage is for informational and educational purposes only. It is NOT financial advice.**

Cryptocurrency trading involves significant risk, and you could lose your capital. The information provided by Cryage, including any AI-generated insights, technical analysis, or data visualizations, may contain errors, inaccuracies, or be incomplete.

- **Do NOT** make trading decisions based solely on the information presented by this tool.
- **Always** conduct your own thorough research (DYOR) and consult with a qualified financial advisor before making any investment decisions.
- The developers and contributors of Cryage assume **NO** responsibility for any trading losses or financial damages incurred as a result of using this software.

Use Cryage at your own risk.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ using FastAPI, Next.js, Binance API, and Google Gemini AI</p>

<div align="center">
  <a href="https://visitor-badge.laobi.icu/badge?page_id=ultimateBroK.Cryage"><img src="https://visitor-badge.laobi.icu/badge?page_id=ultimateBroK.Cryage" alt="Visitors"></a>
  <a href="https://github.com/ultimateBroK/Cryage/stargazers"><img src="https://img.shields.io/github/stars/ultimateBroK/Cryage?style=flat-square&logo=github&label=Stars&color=gold" alt="Stars"></a>
  <a href="https://github.com/ultimateBroK/Cryage/issues"><img src="https://img.shields.io/github/issues/ultimateBroK/Cryage?style=flat-square&logo=github&label=Issues&color=red" alt="Issues"></a>
</div>
