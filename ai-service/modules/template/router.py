from fastapi import APIRouter
from .models import TemplateItem
from .service import process_item

router = APIRouter()

@router.get("/template/ping")
def ping():
  return {"message": "pong"}

@router.post("/template/items")
def create_item(item: TemplateItem):
  processed = process_item(item)
  return {"item": processed}
