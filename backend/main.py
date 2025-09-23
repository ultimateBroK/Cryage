from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="Cryage Backend",
    description="Backend API for Cryage crypto agent",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Cryage Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "cryage-backend"}

def main():
    print("Hello from backend!")


if __name__ == "__main__":
    main()
