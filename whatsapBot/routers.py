from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from database import SessionLocal
from models import User, Message
import os
import uuid
import asyncio
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
APP_URL = os.getenv("APP_URL", "http://localhost:8000")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

router = APIRouter()

# Dependency for DB session
async def get_db():
    async with SessionLocal() as session:
        yield session

# Incoming message schema
class IncomingMessage(BaseModel):
    phone: str
    message: str

# Endpoint to receive a user message and respond
@router.post("/message")
async def receive_message(data: IncomingMessage, db: AsyncSession = Depends(get_db)):

    # Check if user exists, else create
    result = await db.execute(select(User).where(User.phone_number == data.phone))
    user = result.scalar_one_or_none()
    is_new_user = False

    if not user:
        user = User(phone_number=data.phone)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        is_new_user = True

    # Save the user's message
    user_message = Message(user_id=user.id, role="user", content=data.message)
    db.add(user_message)
    await db.commit()
    await db.refresh(user_message)

    # Call Gemini API in a thread-safe way
    try:
        gemini_response = await asyncio.to_thread(
            model.generate_content,
            f"You are Seek, a health assistant that answers questions about food and drugs. Answer this: {data.message}"
        )
        answer = gemini_response.text
    except Exception as e:
        print("Gemini error:", e)
        raise HTTPException(status_code=500, detail="AI service failed")

    # Save the bot's reply
    bot_message = Message(user_id=user.id, role="bot", content=answer)
    db.add(bot_message)
    await db.commit()
    await db.refresh(bot_message)

    # If new user, return chat link
    if is_new_user:
        return {
            "answer": answer,
            "chat_link": f"{APP_URL}/chat/{user.token}"
        }

    return {"answer": answer}

# Endpoint to fetch chat history
@router.get("/chat/{token}")
async def get_chat_history(token: str, db: AsyncSession = Depends(get_db)):

    try:
        user_uuid = uuid.UUID(token)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid token format")

    result = await db.execute(select(User).where(User.token == user_uuid))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Invalid token")

    result = await db.execute(
        select(Message).where(Message.user_id == user.id).order_by(Message.created_at)
    )
    messages = result.scalars().all()

    return {
        "messages": [
            {"role": m.role, "content": m.content, "time": m.created_at} for m in messages
        ]
    }

# Test endpoint to verify Gemini API works
@router.post("/test")
async def test_bot(data: IncomingMessage):
    try:
        gemini_response = await asyncio.to_thread(
            model.generate_content,
            f"You are Seek, a health assistant that answers questions about food and drugs. Answer this: {data.message}"
        )
        answer = gemini_response.text
    except Exception as e:
        print("Gemini error:", e)
        raise HTTPException(status_code=500, detail="AI service failed")

    return {
        "you_sent": data.message,
        "seek_replied": answer
    }