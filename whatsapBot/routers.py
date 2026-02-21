from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import SessionLocal
from models import User, Message
from pydantic import BaseModel
import uuid

router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

class IncomingMessage(BaseModel):
    phone: str
    message: str


@router.post("/message")
async def receive_message(data: IncomingMessage, db: AsyncSession = Depends(get_db)):
    
    # Check if user exists, if not create them
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

    # TODO: plug in your AI/health logic here and get a real answer
    answer = "This is a placeholder answer from Seek."

    # Save the bot's reply
    bot_message = Message(user_id=user.id, role="bot", content=answer)
    db.add(bot_message)
    await db.commit()

    response = {"answer": answer}

    # If new user, send them their chat history link
    if is_new_user:
        response["chat_link"] = f"https://yourapp.com/chat/{user.token}"

    return response


@router.get("/chat/{token}")
async def get_chat_history(token: str, db: AsyncSession = Depends(get_db)):

    # Find user by token
    result = await db.execute(select(User).where(User.token == uuid.UUID(token)))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Invalid token")

    # Get all their messages ordered by time
    result = await db.execute(
        select(Message)
        .where(Message.user_id == user.id)
        .order_by(Message.created_at)
    )
    messages = result.scalars().all()

    return {"messages": [{"role": m.role, "content": m.content, "time": m.created_at} for m in messages]}