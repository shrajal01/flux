from pydantic import BaseModel
from datetime import datetime


class ConversationCreate(BaseModel):
    name: str | None = None
    is_group: bool = False


class ConversationResponse(BaseModel):
    id: int
    name: str | None
    is_group: bool

    other_user_id: int | None = None
    other_username: str | None = None

    created_at: datetime

    class Config:
        from_attributes = True

class DirectConversationCreate(BaseModel):
    receiver_id: int