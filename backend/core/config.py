import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Nimbus Cloud Drive"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    STORAGE_DIR: str = os.path.join(os.path.dirname(BASE_DIR), "storage")

    # AWS Configuration
    AWS_ACCESS_KEY_ID: str = "AKIA243O5OTZPOOVUM75"
    AWS_SECRET_ACCESS_KEY: str = "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"
    AWS_REGION: str = "ap-south-1"
    AWS_BUCKET_NAME: str = "nimbus-vault-arpit-2026"

    # Database
    DATABASE_URL: str = "mysql+pymysql://nimbus_user:nimbus_password@localhost:3306/nimbus"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
