from pathlib import Path
from backend.core.config import settings
import shutil

def get_category_for_file(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    if ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']:
        return "photos"
    elif ext in ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx', '.ppt', '.pptx']:
        return "documents"
    else:
        return "others"

def save_upload_file(upload_file, category: str):
    target_dir = Path(settings.STORAGE_DIR) / category
    target_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = target_dir / upload_file.filename
    # Handle duplicates by renaming? For prototype, overwrite or straightforward save.
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return str(file_path), upload_file.size
