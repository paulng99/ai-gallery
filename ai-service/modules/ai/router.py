from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from .service import ai_service
from modules.photos.service import update_photo_ai_data, get_photo_by_id

router = APIRouter(prefix="/ai", tags=["AI Analysis"])

class ImageAnalysisRequest(BaseModel):
    image_url: str
    photo_id: Optional[str] = None

class BatchAnalysisRequest(BaseModel):
    photo_ids: List[str]

class AnalysisResponse(BaseModel):
    photo_id: str
    description: str
    hashtags: List[str]
    status: str
    created_at: str

@router.post("/analyze/image")
async def analyze_image(request: ImageAnalysisRequest):
    """
    Analyze a single image and generate caption + hashtags.
    """
    if not request.image_url:
        raise HTTPException(status_code=400, detail="image_url is required")
    
    try:
        description, hashtags = await ai_service.generate_caption(request.image_url)
        
        return {
            "success": True,
            "data": {
                "image_url": request.image_url,
                "description": description,
                "hashtags": hashtags,
                "status": "completed"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

async def analyze_photo_background(photo_id: str, image_url: str):
    """
    Background task to analyze photo and update database.
    """
    try:
        print(f"[AI] Starting background analysis for photo: {photo_id}")
        
        # Run full pipeline: caption -> embedding -> FAISS
        description, hashtags = await ai_service.process_photo(photo_id, image_url)
        
        # Update photo record in database
        update_photo_ai_data(
            photo_id=photo_id,
            description=description,
            hashtags=",".join(hashtags),
            status="completed"
        )
        
        print(f"[AI] Completed analysis for photo: {photo_id}")
        
    except Exception as e:
        print(f"[AI] Error analyzing photo {photo_id}: {e}")
        update_photo_ai_data(
            photo_id=photo_id,
            description="",
            hashtags="",
            status="error"
        )

@router.post("/analyze/photo/{photo_id}")
async def analyze_photo(photo_id: str, background_tasks: BackgroundTasks):
    """
    Analyze a photo by its ID in the database.
    Triggers background analysis.
    """
    photo = get_photo_by_id(photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    if not photo.fileUrl:
        raise HTTPException(status_code=400, detail="Photo has no image URL")
    
    # Add background task
    background_tasks.add_task(analyze_photo_background, photo_id, photo.fileUrl)
    
    return {
        "success": True,
        "message": "Analysis started",
        "photo_id": photo_id,
        "status": "processing"
    }

@router.post("/analyze/batch")
async def analyze_batch(request: BatchAnalysisRequest, background_tasks: BackgroundTasks):
    """
    Batch analyze multiple photos.
    """
    if not request.photo_ids:
        raise HTTPException(status_code=400, detail="photo_ids list is required")
    
    results = []
    for photo_id in request.photo_ids:
        photo = get_photo_by_id(photo_id)
        if photo and photo.fileUrl:
            background_tasks.add_task(analyze_photo_background, photo_id, photo.fileUrl)
            results.append({"photo_id": photo_id, "status": "queued"})
        else:
            results.append({"photo_id": photo_id, "status": "skipped", "reason": "Not found or no URL"})
    
    return {
        "success": True,
        "message": f"Queued {len([r for r in results if r['status'] == 'queued'])} photos for analysis",
        "results": results
    }

@router.get("/analyze/status/{photo_id}")
async def get_analysis_status(photo_id: str):
    """
    Get the AI analysis status for a photo.
    """
    photo = get_photo_by_id(photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    return {
        "photo_id": photo_id,
        "embedding_status": photo.embeddingStatus,
        "description": photo.description or None,
        "hashtags": photo.hashtags.split(",") if photo.hashtags else []
    }

class SemanticSearchRequest(BaseModel):
    query: str
    limit: int = 20

@router.post("/search/semantic")
async def semantic_search(request: SemanticSearchRequest):
    """
    Perform semantic search on photos.
    """
    if not request.query:
        raise HTTPException(status_code=400, detail="query is required")
    
    try:
        photo_ids = await ai_service.search(request.query, request.limit)
        
        # Fetch photo details from database
        from modules.photos.service import list_photos
        all_photos = list_photos()
        
        results = [p.model_dump() for p in all_photos if p.id in photo_ids]
        
        # Sort by relevance (FAISS order)
        results.sort(key=lambda x: photo_ids.index(x["id"]) if x["id"] in photo_ids else len(photo_ids))
        
        return {
            "success": True,
            "query": request.query,
            "results": results,
            "total": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/stats")
async def get_ai_stats():
    """
    Get AI service statistics.
    """
    from modules.photos.service import list_photos
    photos = list_photos()
    
    completed = sum(1 for p in photos if p.embeddingStatus == "completed")
    pending = sum(1 for p in photos if p.embeddingStatus in ["pending", "processing"])
    error = sum(1 for p in photos if p.embeddingStatus == "error")
    
    return {
        "total_photos": len(photos),
        "analyzed": completed,
        "pending": pending,
        "errors": error,
        "index_size": ai_service.index.ntotal if ai_service.index else 0
    }