from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime

from app.db.database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String, default="sent")  # sent | delivered | read
    created_at = Column(DateTime, default=datetime.utcnow)