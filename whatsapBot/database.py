from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


import os
from dotenv import load_dotenv

load_dotenv()



DATABASE_URL = os.getenv("DATABASE_URL")


DATABASE_URL = os.getenv("DATABASE_URL")  

engine = create_async_engine(DATABASE_URL)

SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass