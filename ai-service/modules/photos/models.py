from pydantic import BaseModel
from typing import Optional

class Photo(BaseModel):
  id: str
  fileId: Optional[str] = None
  fileName: str
  fileUrl: Optional[str] = None
  mimeType: Optional[str] = None
  activityName: Optional[str] = None
  activityDate: Optional[str] = None
  location: Optional[str] = None
  groupName: Optional[str] = None
  owner: Optional[str] = None
  createdAt: str
