from fastapi import FastAPI
from routers import router
from database import Base, engine


app = FastAPI()
app.include_router(router)

 
@app.on_event("startup")
async def startup(): 
  async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all) # This is to connect to the DB and synchronize with the models defined in database.py

