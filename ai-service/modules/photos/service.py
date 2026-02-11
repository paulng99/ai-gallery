import io
import json
import os
import sqlite3
from typing import List, Optional, Tuple
from .models import Photo

def _get_db_path() -> str:
  env_path = os.environ.get("PHOTO_DB_PATH")
  if env_path:
    return env_path
  base = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data"))
  os.makedirs(base, exist_ok=True)
  return os.path.join(base, "photos.db")

def _init_db() -> None:
  conn = sqlite3.connect(_get_db_path())
  conn.execute(
    """
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      file_id TEXT,
      file_name TEXT NOT NULL,
      file_url TEXT,
      mime_type TEXT,
      activity_name TEXT,
      activity_date TEXT,
      location TEXT,
      group_name TEXT,
      owner TEXT,
      created_at TEXT NOT NULL,
      description TEXT,
      hashtags TEXT,
      embedding_status TEXT DEFAULT 'pending'
    )
    """
  )
  # Check for missing columns (migration)
  cursor = conn.execute("PRAGMA table_info(photos)")
  cols = [row[1] for row in cursor.fetchall()]
  if "description" not in cols:
    conn.execute("ALTER TABLE photos ADD COLUMN description TEXT")
  if "hashtags" not in cols:
    conn.execute("ALTER TABLE photos ADD COLUMN hashtags TEXT")
  if "embedding_status" not in cols:
    conn.execute("ALTER TABLE photos ADD COLUMN embedding_status TEXT DEFAULT 'pending'")
  
  conn.commit()
  conn.close()

_init_db()

def list_photos() -> List[Photo]:
  conn = sqlite3.connect(_get_db_path())
  cursor = conn.execute(
    """
    SELECT id, file_id, file_name, file_url, mime_type, activity_name,
           activity_date, location, group_name, owner, created_at,
           description, hashtags, embedding_status
    FROM photos
    ORDER BY created_at DESC
    """
  )
  rows = cursor.fetchall()
  conn.close()
  items = []
  for row in rows:
    items.append(
      Photo(
        id=row[0],
        fileId=row[1],
        fileName=row[2],
        fileUrl=row[3],
        mimeType=row[4],
        activityName=row[5],
        activityDate=row[6],
        location=row[7],
        groupName=row[8],
        owner=row[9],
        createdAt=row[10],
        description=row[11],
        hashtags=row[12],
        embeddingStatus=row[13] or 'pending'
      )
    )
  return items

def add_photo(photo: Photo) -> Photo:
  conn = sqlite3.connect(_get_db_path())
  conn.execute(
    """
    INSERT INTO photos (
      id, file_id, file_name, file_url, mime_type, activity_name,
      activity_date, location, group_name, owner, created_at,
      description, hashtags, embedding_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
    (
      photo.id,
      photo.fileId,
      photo.fileName,
      photo.fileUrl,
      photo.mimeType,
      photo.activityName,
      photo.activityDate,
      photo.location,
      photo.groupName,
      photo.owner,
      photo.createdAt,
      photo.description,
      photo.hashtags,
      photo.embeddingStatus or 'pending'
    ),
  )
  conn.commit()
  conn.close()
  return photo

def update_photo_ai_data(photo_id: str, description: str, hashtags: str, status: str) -> None:
  conn = sqlite3.connect(_get_db_path())
  conn.execute(
    """
    UPDATE photos 
    SET description = ?, hashtags = ?, embedding_status = ?
    WHERE id = ?
    """,
    (description, hashtags, status, photo_id)
  )
  conn.commit()
  conn.close()

def _get_drive_service():
  raw = os.environ.get("GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON")
  if not raw:
    return None
  try:
    info = json.loads(raw)
  except json.JSONDecodeError:
    return None
  from google.oauth2 import service_account
  from googleapiclient.discovery import build

  credentials = service_account.Credentials.from_service_account_info(
    info,
    scopes=["https://www.googleapis.com/auth/drive"],
  )
  return build("drive", "v3", credentials=credentials, cache_discovery=False)

def upload_to_drive(file_name: str, mime_type: str, data: bytes) -> Tuple[Optional[str], Optional[str]]:
  folder_id = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")
  service = _get_drive_service()
  if not folder_id or not service:
    return None, None
  from googleapiclient.http import MediaIoBaseUpload

  media = MediaIoBaseUpload(io.BytesIO(data), mimetype=mime_type, resumable=False)
  body = {"name": file_name, "parents": [folder_id]}
  created = service.files().create(body=body, media_body=media, fields="id").execute()
  file_id = created.get("id")
  file_url = None
  if file_id:
    service.permissions().create(
      fileId=file_id,
      body={"type": "anyone", "role": "reader"},
    ).execute()
    file_url = f"https://drive.google.com/uc?id={file_id}"
  return file_id, file_url
