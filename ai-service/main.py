from fastapi import FastAPI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Gallery Worker", version="0.1.0")

# Import and include routers
from modules.template.router import router as template_router
app.include_router(template_router)

from modules.students.router import router as students_router
app.include_router(students_router)

from modules.photos.router import router as photos_router
app.include_router(photos_router)

from modules.ai.router import router as ai_router
app.include_router(ai_router)

@app.get("/")
def read_root():
    """Health check endpoint."""
    return {
        "status": "online", 
        "service": "AI Gallery Worker",
        "version": "0.1.0"
    }

@app.get("/health")
def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "service": "AI Gallery Worker"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)