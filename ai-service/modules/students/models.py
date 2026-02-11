from pydantic import BaseModel
from typing import Optional

class Student(BaseModel):
  id: str
  name: str
  className: Optional[str] = None
