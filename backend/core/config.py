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
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "ap-south-1")
    AWS_BUCKET_NAME: str = os.getenv("AWS_BUCKET_NAME", "nimbus-vault")

    # Database (RDS Configuration)
    RDS_ENGINE: str = os.getenv("RDS_ENGINE", "mysql")
    RDS_HOST: str = os.getenv("RDS_HOST", "")
    RDS_PORT: str = os.getenv("RDS_PORT", "3306")
    RDS_USER: str = os.getenv("RDS_USER", "")
    RDS_PASSWORD: str = os.getenv("RDS_PASSWORD", "")
    RDS_DB_NAME: str = os.getenv("RDS_DB_NAME", "nimbus")

    @property
    def DATABASE_URL(self) -> str:
        if self.RDS_HOST and self.RDS_USER:
            driver = "postgresql+psycopg2" if self.RDS_ENGINE.lower() == "postgresql" else "mysql+pymysql"
            return f"{driver}://{self.RDS_USER}:{self.RDS_PASSWORD}@{self.RDS_HOST}:{self.RDS_PORT}/{self.RDS_DB_NAME}"
        return os.getenv("DATABASE_URL", "sqlite:///./nimbus.db")
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
