from fastapi import APIRouter
from backend.api import auth, files

api_router = APIRouter()

api_router.include_router(auth.router, tags=["login"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
