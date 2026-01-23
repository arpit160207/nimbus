from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from backend.core.config import settings

def test_connection():
    print(f"Testing connection to: {settings.DATABASE_URL}")
    engine = create_engine(settings.DATABASE_URL)
    try:
        with engine.connect() as connection:
            print("✅ Successfully connected to the database!")
    except OperationalError as e:
        print(f"❌ Connection failed: {e}")
        print("\nPossible fixes:")
        print("1. Ensure Docker container is running (`docker ps`)")
        print("2. Ensure port 3306 is mapped")
        print("3. Check credentials in .env")

if __name__ == "__main__":
    test_connection()
