from datetime import datetime

from pydantic import BaseModel


class ConversationCreate(BaseModel):
    name: str | None = None
    is_group: bool = False


class DirectConversationCreate(BaseModel):
    receiver_id: int


class ConversationResponse(BaseModel):
    id: int
    name: str | None
    is_group: bool
    other_user_id: int | None = None      # only set for DMs
    other_username: str | None = None     # only set for DMs
    created_at: datetime

    class Config:
        from_attributes = True