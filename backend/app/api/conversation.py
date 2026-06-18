from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.conversation import Conversation
from app.models.conversation_member import (
    ConversationMember
)
from app.schemas.conversation import (
    ConversationCreate,
    ConversationResponse
)
from app.schemas.conversation_member import (
    ConversationMemberCreate,
    ConversationMemberResponse
)


router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"]
)


@router.post(
    "",
    response_model=ConversationResponse
)
def create_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db)
):
    new_conversation = Conversation(
        name=conversation.name,
        is_group=conversation.is_group
    )

    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return new_conversation

@router.post(
    "/{conversation_id}/members",
    response_model=ConversationMemberResponse
)
def add_member(
    conversation_id: int,
    member: ConversationMemberCreate,
    db: Session = Depends(get_db)
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    new_member = ConversationMember(
        conversation_id=conversation_id,
        user_id=member.user_id
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return new_member

@router.get(
    "",
    response_model=list[ConversationResponse]
)
def get_conversations(
    db: Session = Depends(get_db)
):
    conversations = (
        db.query(Conversation)
        .all()
    )

    return conversations