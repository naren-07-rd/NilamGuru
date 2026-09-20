import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

from .models import Base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not configured in .env")


if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg://",
        1
    )


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)


def test_database_connection():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        print("✅ Successfully connected to PostgreSQL!")

    except Exception as error:
        print("❌ Database connection failed.")
        print("Error:", error)


def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")

    except Exception as error:
        print("❌ Failed to create database tables.")
        print("Error:", error)