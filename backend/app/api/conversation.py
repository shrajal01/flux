from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.conversation import Conversation
from app.models.conversation_member import (
    ConversationMember
)
from app.schemas.conversation import (
    ConversationCreate,
    ConversationResponse,
    DirectConversationCreate
)
from app.schemas.conversation_member import (
    ConversationMemberCreate,
    ConversationMemberResponse
)
from app.core.security import get_current_user


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
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_conversation = Conversation(
        name=conversation.name,
        is_group=conversation.is_group
    )

    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    creator = ConversationMember(
    conversation_id=new_conversation.id,
    user_id=int(current_user["sub"])
    )

    db.add(creator)
    db.commit()

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
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = int(current_user["sub"])

    conversation_ids = (
        db.query(
            ConversationMember.conversation_id
        )
        .filter(
            ConversationMember.user_id == user_id
        )
        .all()
    )

    conversation_ids = [
        c[0] for c in conversation_ids
    ]

    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.id.in_(conversation_ids)
        )
        .all()
    )

    result = []

    for conversation in conversations:

        if conversation.is_group:

            result.append(
                ConversationResponse(
                    id=conversation.id,
                    name=conversation.name,
                    is_group=True,
                    created_at=conversation.created_at
                )
            )

        else:

            other_member = (
                db.query(ConversationMember)
                .filter(
                    ConversationMember.conversation_id == conversation.id,
                    ConversationMember.user_id != user_id
                )
                .first()
            )

            other_user = (
                db.query(User)
                .filter(
                    User.id == other_member.user_id
                )
                .first()
            )

            result.append(
                ConversationResponse(
                    id=conversation.id,
                    name=other_user.username,
                    is_group=False,
                    other_user_id=other_user.id,
                    other_username=other_user.username,
                    created_at=conversation.created_at
                )
            )

    return result

@router.post(
    "/direct",
    response_model=ConversationResponse
)
def create_direct_conversation(
    data: DirectConversationCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sender_id = int(current_user["sub"])
    receiver_id = data.receiver_id

    print("========== CREATE DM ==========")
    print("Sender ID:", sender_id)
    print("Receiver ID:", receiver_id)

    if sender_id == receiver_id:
        raise HTTPException(
            status_code=400,
            detail="Cannot create conversation with yourself"
        )

    receiver = (
        db.query(User)
        .filter(User.id == receiver_id)
        .first()
    )

    print("Receiver Object:", receiver)
    print("Receiver Username:", receiver.username)

    if not receiver:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    existing_conversations = (
    db.query(Conversation)
    .filter(Conversation.is_group == False)
    .all()
    )

    for conversation in existing_conversations:

        members = (
            db.query(ConversationMember)
            .filter(
                ConversationMember.conversation_id == conversation.id
            )
            .all()
        )

        member_ids = [
            member.user_id
            for member in members
        ]

        if sorted(member_ids) == sorted([sender_id, receiver_id]):
            return ConversationResponse(
                id=conversation.id,
                name=receiver.username,
                is_group=False,
                other_user_id=receiver.id,
                other_username=receiver.username,
                created_at=conversation.created_at
            )

    conversation = Conversation(
        is_group=False,
        name=None
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    db.add(
        ConversationMember(
            conversation_id=conversation.id,
            user_id=sender_id
        )
    )

    db.add(
        ConversationMember(
            conversation_id=conversation.id,
            user_id=receiver_id
        )
    )

    db.commit()

    return ConversationResponse(
    id=conversation.id,
    name=receiver.username,
    is_group=False,
    other_user_id=receiver.id,
    other_username=receiver.username,
    created_at=conversation.created_at
)