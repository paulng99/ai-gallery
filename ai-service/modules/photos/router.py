from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from uuid import uuid4
from .models import Photo
from .service import add_photo, list_photos, upload_to_drive, update_photo_ai_data, list_activity_groups
from ..ai.service import ai_service

router = APIRouter()

async def analyze_photo_task(photo_id: str, image_url: str):
    """Background task to analyze photo"""
    if not image_url:
        return
        
    try:
        # 1. Generate Caption & Hashtags
        description, hashtags = await ai_service.process_photo(photo_id, image_url)
        
        # 2. Update DB
        update_photo_ai_data(
            photo_id, 
            description, 
            ",".join(hashtags), 
            "done"
        )
        print(f"Analysis complete for {photo_id}")
    except Exception as e:
        print(f"Analysis failed for {photo_id}: {e}")
        update_photo_ai_data(photo_id, "", "", "error")

@router.get("/photos")
def get_photos():
  items = list_photos()
  return {"items": [p.model_dump() for p in items]}

@router.get("/photos/groups")
def get_photo_groups():
    groups = list_activity_groups()
    return {"items": [g.model_dump() for g in groups]}

@router.post("/photos")
async def create_photo(
  background_tasks: BackgroundTasks,
  file: UploadFile = File(...),
  activityName: str | None = Form(None),
  activityDate: str | None = Form(None),
  location: str | None = Form(None),
  groupName: str | None = Form(None),
  owner: str | None = Form(None),
):
  if not file.filename:
    raise HTTPException(status_code=400, detail="file is required")
  data = await file.read()
  file_id, file_url = upload_to_drive(file.filename, file.content_type or "application/octet-stream", data)
  now = datetime.utcnow().isoformat() + "Z"
  photo = Photo(
    id=str(uuid4()),
    fileId=file_id,
    fileName=file.filename,
    fileUrl=file_url,
    mimeType=file.content_type,
    activityName=activityName,
    activityDate=activityDate,
    location=location,
    groupName=groupName,
    owner=owner,
    createdAt=now,
    embeddingStatus="pending"
  )
  created = add_photo(photo)
  
  # Trigger Background Analysis
  if file_url:
      background_tasks.add_task(analyze_photo_task, photo.id, file_url)
      
  return {"item": created.model_dump()}
