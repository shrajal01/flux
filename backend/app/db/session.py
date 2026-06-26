from .database import SessionLocal


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()