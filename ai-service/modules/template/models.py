from pydantic import BaseModel
from typing import Optional

class TemplateItem(BaseModel):
  id: str
  title: str
  description: Optional[str] = None
