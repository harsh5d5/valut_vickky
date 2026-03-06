from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Your Neon Database URL
SQLALCHEMY_DATABASE_URL = "postgresql://neondb_owner:npg_EOsDJMnU5S8d@ep-steep-snow-a9740sej-pooler.gwc.azure.neon.tech/neondb?sslmode=require"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
