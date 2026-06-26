from datetime import datetime

from pydantic import BaseModel


class MessageCreate(BaseModel):
    conversation_id: int
    sender_id: int
    content: str


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str
    status: str  # sent | delivered | read
    created_at: datetime

    class Config:
        from_attributes = True