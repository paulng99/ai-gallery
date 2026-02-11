from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Gallery Worker", version="0.1.0")

from modules.template.router import router as template_router
app.include_router(template_router)
from modules.students.router import router as students_router
app.include_router(students_router)

class ImageAnalysisRequest(BaseModel):
    image_url: str
    activity_name: Optional[str] = None

class SearchRequest(BaseModel):
    query: str
    limit: int = 10

@app.get("/")
def read_root():
    return {"status": "online", "service": "AI Gallery Worker"}

@app.post("/analyze/image")
async def analyze_image(request: ImageAnalysisRequest):
    # Placeholder for FAL.ai / Replicate integration
    return {"message": "Image analysis started", "data": request}

@app.post("/search/semantic")
async def semantic_search(request: SearchRequest):
    # Placeholder for FAISS search
    return {"results": [], "query": request.query}

@app.post("/search/face")
async def face_search(student_name: str):
    # Placeholder for Face search
    return {"results": [], "student": student_name}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
