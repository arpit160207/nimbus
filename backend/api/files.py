from typing import List
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from backend.core.utils import get_category_for_file
from backend.core.s3 import s3_service
from backend.api import deps
from pydantic import BaseModel
from backend.models.user import User

router = APIRouter()

class FileInfo(BaseModel):
    name: str
    size: int
    category: str
    path: str 

@router.post("/upload", response_model=FileInfo)
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(deps.get_current_user)): 
    category = get_category_for_file(file.filename)
    user_prefix = current_user.full_name.replace(" ", "_").lower() if current_user.full_name else f"user_{current_user.id}"
    object_name = f"{user_prefix}/{category}/{file.filename}"
    
    # Upload to S3
    s3_service.upload_file(file, object_name)
    
    return FileInfo(
        name=file.filename,
        size=file.size or 0,
        category=category,
        path=object_name
    )

@router.get("/list", response_model=List[dict])
def list_files(current_user: User = Depends(deps.get_current_user)):
    all_files = []
    user_prefix = current_user.full_name.replace(" ", "_").lower() if current_user.full_name else f"user_{current_user.id}"
    # List from each category prefix
    for category in ["photos", "documents", "others"]:
        s3_files = s3_service.list_files(prefix=f"{user_prefix}/{category}/")
        for f in s3_files:
            # Generate a presigned URL valid for 1 hour for preview/download
            url = s3_service.generate_presigned_url(f['key'], expiration=3600)
            download_url = s3_service.generate_presigned_url(f['key'], expiration=3600, force_download=True, filename=f['name'])
            
            all_files.append({
                "name": f['name'],
                "category": category,
                "size": f['size'],
                "url": url, # New field for preview/direct access
                "download_url": download_url,
                "key": f['key']
            })
    return all_files

@router.delete("/delete/{filename}")
def delete_file(filename: str, current_user: User = Depends(deps.get_current_user)):
    category = get_category_for_file(filename)
    user_prefix = current_user.full_name.replace(" ", "_").lower() if current_user.full_name else f"user_{current_user.id}"
    object_name = f"{user_prefix}/{category}/{filename}"
    s3_service.delete_file(object_name)
    return {"status": "deleted"}
