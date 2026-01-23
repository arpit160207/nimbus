from sqlalchemy.orm import Session
from backend.db.session import engine, SessionLocal
from backend.db.base import Base

# Import all models so Base has them before creating tables
from backend.models.user import User

def init_db(db: Session) -> None:
    # Tables should be created with Alembic migrations
    # But for simplicity, we create them here if they don't exist
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")

if __name__ == "__main__":
    db = SessionLocal()
    init_db(db)
