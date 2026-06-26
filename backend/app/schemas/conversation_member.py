from datetime import datetime

from pydantic import BaseModel


class ConversationMemberCreate(BaseModel):
    user_id: int


class ConversationMemberResponse(BaseModel):
    id: int
    conversation_id: int
    user_id: int
    joined_at: datetime

    class Config:
        from_attributes = True