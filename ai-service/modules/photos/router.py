from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from uuid import uuid4
from .models import Photo
from .service import add_photo, list_photos, upload_to_drive

router = APIRouter()

@router.get("/photos")
def get_photos():
  items = list_photos()
  return {"items": [p.model_dump() for p in items]}

@router.post("/photos")
async def create_photo(
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
  )
  created = add_photo(photo)
  return {"item": created.model_dump()}
