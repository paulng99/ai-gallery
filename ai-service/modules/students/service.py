from typing import List
from uuid import uuid4
from .models import Student

_store: List[Student] = []

def list_students() -> List[Student]:
  return _store

def add_student(name: str, className: str | None = None) -> Student:
  s = Student(id=str(uuid4()), name=name, className=className)
  _store.insert(0, s)
  return s
