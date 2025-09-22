```mermaid 
graph TB
    A[User Types Message] --> B[Check API Key]
    B --> C{API Key Valid?}
    C -->|No| D[Show Notification]
    C -->|Yes| E[useChat Hook]
    E --> F[Fetch Override Injects Key]
    F --> G[POST /api/chat]
    G --> H[Google Gemini AI]
    H --> I[Stream Response]
    I --> J[SSE Format]
    J --> K[UI Updates Real-time]
    K --> L[Auto-scroll Logic]
    L --> M[Message Complete]