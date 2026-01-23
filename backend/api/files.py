from typing import List
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from backend.core.utils import get_category_for_file
from backend.core.s3 import s3_service
from backend.api import deps
from pydantic import BaseModel

router = APIRouter()

class FileInfo(BaseModel):
    name: str
    size: int
    category: str
    path: str 

@router.post("/upload", response_model=FileInfo)
async def upload_file(file: UploadFile = File(...), current_user: str = Depends(deps.get_current_user)): 
    category = get_category_for_file(file.filename)
    object_name = f"{category}/{file.filename}"
    
    # Upload to S3
    s3_service.upload_file(file, object_name)
    
    return FileInfo(
        name=file.filename,
        size=file.size or 0,
        category=category,
        path=object_name
    )

@router.get("/list", response_model=List[dict])
def list_files():
    all_files = []
    # List from each category prefix
    for category in ["photos", "documents", "others"]:
        s3_files = s3_service.list_files(prefix=f"{category}/")
        for f in s3_files:
            # Generate a presigned URL valid for 1 hour for preview/download
            url = s3_service.generate_presigned_url(f['key'], expiration=3600)
            
            all_files.append({
                "name": f['name'],
                "category": category,
                "size": f['size'],
                "url": url, # New field for preview/direct access
                "key": f['key']
            })
    return all_files

@router.delete("/delete/{filename}")
def delete_file(filename: str, current_user: str = Depends(deps.get_current_user)):
    category = get_category_for_file(filename)
    object_name = f"{category}/{filename}"
    s3_service.delete_file(object_name)
    return {"status": "deleted"}

@router.get("/download/{filename}")
def download_file(filename: str):
    # Now we can just redirect to the pre-generated URL if we want, or generate a fresh one
    category = get_category_for_file(filename)
    object_name = f"{category}/{filename}"
    
    url = s3_service.generate_presigned_url(object_name)
    if not url:
        raise HTTPException(status_code=404, detail="File not found")
        
    from starlette.responses import RedirectResponse
    return RedirectResponse(url)
