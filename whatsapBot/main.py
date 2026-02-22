from fastapi import FastAPI
from routers import router
from database import Base, engine
from webhook import router as webhook_router


app = FastAPI()
app.include_router(router)
app.include_router(webhook_router) # the webhook router is responsible for handling incoming messages from Twilio and responding to them.

 
@app.on_event("startup")
async def startup(): 
  async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all) # This is to connect to the DB and synchronize with the models defined in database.py

