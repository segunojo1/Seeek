from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from datetime import datetime
import uuid

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) # I'm adding ForeignKey to link each message to a specific user in the users table, so i can maintain conversation history for each user and provide context for the Gemini analysis.
    phone_number = Column(String, nullable=False)
    token = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
