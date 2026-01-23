from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.api.api import api_router

app = FastAPI(
    title="Nimbus Cloud Drive",
    description="Mini Cloud Drive System with Drag-and-Drop and Auto-Categorization",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    try:
        from backend.core.s3 import s3_service
        print("Testing S3 Connection...")
        s3_service.s3_client.list_buckets()
        print("✅ S3 Connection Successful!")
    except Exception as e:
        print(f"❌ S3 Connection FAILED: {e}")

app.include_router(api_router, prefix=settings.API_V1_STR)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to Nimbus Cloud Drive API"}
