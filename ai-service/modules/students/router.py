from fastapi import APIRouter
from pydantic import BaseModel
from .service import list_students, add_student

router = APIRouter()

class CreateStudentRequest(BaseModel):
  name: str
  className: str | None = None

@router.get("/students")
def get_students():
  items = list_students()
  return {"items": [s.model_dump() for s in items]}

@router.post("/students")
def create_student(req: CreateStudentRequest):
  item = add_student(req.name, req.className)
  return {"item": item.model_dump()}
