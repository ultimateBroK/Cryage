# Cryage Trading System

Hệ thống trading AI với Agno + FastAPI + Google Gemini, team agents, tool call, memory, vector DB, và evals.

## 🚀 Tính năng chính

- **Team Agents**: 3 agents chuyên biệt (Researcher, DecisionMaker, Trader)
- **AI Analysis**: Phân tích thị trường với Google Gemini 2.0 Flash
- **Real-time Data**: Tích hợp Binance API cho dữ liệu crypto
- **Memory System**: Lưu trữ lịch sử chat và trading signals
- **Vector Database**: Pinecone cho knowledge storage và retrieval
- **Technical Analysis**: EMA, MACD, RSI, Bollinger Bands, Support/Resistance
- **Evaluation System**: Kiểm thử chất lượng agents
- **Modern UI**: Next.js frontend với Tailwind CSS và shadcn/ui

## 📁 Cấu trúc dự án

```
backend/
├── agents/                 # Individual AI agents
│   ├── researcher.py       # Market research agent
│   ├── decision_maker.py  # Trading signal decision agent
│   └── trader.py          # Trade execution agent
├── teams/                  # Agent teams
│   └── trading_team.py     # Collaborative trading team
├── tools/                  # External tools
│   ├── binance_tool.py    # Binance API integration
│   └── technical_analysis_tool.py  # Technical indicators
├── memory/                 # Memory management
│   └── memory_manager.py   # Chat history & signal storage
├── storage/                # Vector database
│   └── vector_db.py       # Pinecone integration
├── evals/                  # Evaluation system
│   └── eval_agent.py      # Agent testing & validation
└── main.py                # FastAPI application

frontend/
├── src/
│   ├── components/features/trading/
│   │   ├── trading-interface.tsx  # Main trading UI
│   │   └── index.ts
│   └── app/trading/
│       └── page.tsx               # Trading page
```

## 🛠️ Cài đặt

### Backend Setup

1. **Cài đặt dependencies:**
```bash
cd backend
uv sync
```

2. **Cấu hình environment:**
```bash
cp env.example .env
# Chỉnh sửa .env với API keys của bạn
```

3. **Chạy backend:**
```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. **Cài đặt dependencies:**
```bash
cd frontend
bun install
```

2. **Chạy frontend:**
```bash
bun run dev
```

## 🔧 API Endpoints

### Trading Analysis
- `POST /trade-predict` - Main trading prediction endpoint
- `POST /market-analysis` - Comprehensive market analysis
- `GET /market-data/{symbol}` - Get market data for symbol

### Memory & Knowledge
- `GET /memory/history` - Get chat history
- `GET /memory/signals` - Get trading signals
- `POST /memory/search` - Search memory
- `GET /vector-db/stats` - Vector database statistics
- `POST /vector-db/query` - Query knowledge

### System Management
- `POST /evaluate` - Run system evaluation
- `GET /team/status` - Get team status
- `GET /health` - Health check

## 🤖 Agents

### 1. Researcher Agent
- **Chức năng**: Phân tích thị trường, kỹ thuật
- **Indicators**: EMA 34-89, MACD, RSI, ICT Killzone
- **Focus**: Support/Resistance, market structure

### 2. Decision Maker Agent
- **Chức năng**: Quyết định tín hiệu mua/bán
- **Output**: Signal, Entry, Stop Loss, Take Profit
- **Format**: Structured trading signals

### 3. Trader Agent
- **Chức năng**: Execution và risk management
- **Focus**: Entry/exit strategy, position sizing
- **Guidance**: Practical trading advice

## 📊 Technical Analysis

### Indicators Supported
- **EMA**: 34, 89 periods
- **MACD**: 12, 26, 9 periods
- **RSI**: 14 period
- **Bollinger Bands**: 20 period, 2 std dev
- **Support/Resistance**: Local extrema detection
- **Trend Analysis**: EMA crossover signals

### Market Data
- **Real-time prices**: Binance API
- **24h statistics**: Volume, change, high/low
- **Kline data**: OHLCV for technical analysis
- **Order book**: Market depth (optional)

## 🧠 Memory System

### Chat History
- Lưu trữ tương tác user-agent
- Context cho agents
- Search functionality

### Trading Signals
- Lưu trữ signals với metadata
- Timestamp và reasoning
- Vector search cho similar signals

### Market Analysis
- Phân tích thị trường
- Technical indicators
- Market sentiment

## 🔍 Vector Database

### Knowledge Storage
- Trading knowledge
- Market analysis
- Historical signals
- Technical patterns

### Search & Retrieval
- Semantic search
- Similar signal finding
- Context retrieval
- Knowledge base queries

## ✅ Evaluation System

### Test Categories
1. **Basic Response**: Agent response functionality
2. **Signal Extraction**: Trading signal detection
3. **Market Data**: Market data integration
4. **Memory**: Memory system functionality
5. **Vector DB**: Knowledge storage/retrieval

### Running Tests
```python
# Basic test
python -m evals.eval_agent

# Comprehensive evaluation
from evals.eval_agent import run_comprehensive_evaluation
results = run_comprehensive_evaluation()
```

## 🎯 Usage Examples

### 1. Basic Trading Analysis
```bash
curl -X POST "http://localhost:8000/trade-predict" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Phân tích tín hiệu BTC hôm nay?",
    "symbol": "BTCUSDT"
  }'
```

### 2. Market Data
```bash
curl "http://localhost:8000/market-data/BTCUSDT"
```

### 3. Memory Search
```bash
curl -X POST "http://localhost:8000/memory/search?query=bitcoin&limit=5"
```

### 4. System Evaluation
```bash
curl -X POST "http://localhost:8000/evaluate" \
  -H "Content-Type: application/json" \
  -d '{"test_type": "all"}'
```

## 🔐 Environment Variables

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional (for advanced features)
BINANCE_API_KEY=your_binance_api_key
BINANCE_API_SECRET=your_binance_secret
PINECONE_API_KEY=your_pinecone_api_key
```

## 🚀 Deployment

### Docker
```bash
# Backend
cd backend
docker build -t cryage-backend .
docker run -p 8000:8000 --env-file .env cryage-backend

# Frontend
cd frontend
docker build -t cryage-frontend .
docker run -p 3000:3000 cryage-frontend
```

### Production
- Sử dụng environment variables
- Cấu hình CORS cho production domains
- Setup monitoring và logging
- Database backup cho vector storage

## 📈 Performance

### Optimization
- Caching cho market data
- Batch processing cho technical analysis
- Async operations cho API calls
- Memory cleanup cho old data

### Monitoring
- Health checks
- Performance metrics
- Error tracking
- Usage analytics

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🆘 Support

- GitHub Issues: Bug reports và feature requests
- Documentation: README files và code comments
- Community: Discord/Telegram channels

---

**Lưu ý**: Hệ thống này chỉ dành cho mục đích giáo dục và nghiên cứu. Không sử dụng cho trading thực tế mà không có proper risk management.
