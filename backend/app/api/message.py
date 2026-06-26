import json

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.message import Message
from app.models.conversation import Conversation
from app.schemas.message import MessageCreate, MessageResponse
from app.websocket.connection_manager import manager

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.post("", response_model=MessageResponse)
async def send_message(message: MessageCreate, db: Session = Depends(get_db)):
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == message.conversation_id)
        .first()
    )

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    new_message = Message(
        conversation_id=message.conversation_id,
        sender_id=message.sender_id,
        content=message.content,
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    # Broadcast new message to all connected WebSocket clients
    try:
        await manager.broadcast(
            json.dumps({
                "type": "message",
                "conversation_id": new_message.conversation_id,
                "sender_id": new_message.sender_id,
                "content": new_message.content,
                "id": new_message.id,
                "created_at": new_message.created_at.isoformat(),
            })
        )
    except Exception:
        pass

    return new_message


@router.get("/{conversation_id}")
def get_messages(
    conversation_id: int,
    page: int = 1,
    limit: int = Query(default=20, le=1000),
    db: Session = Depends(get_db),
):
    # Paginated messages ordered oldest first
    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )


@router.patch("/{message_id}/delivered")
async def mark_delivered(message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    message.status = "delivered"
    db.commit()
    db.refresh(message)

    # Notify the original sender about delivery status via WebSocket
    try:
        await manager.send_to_user(
            message.sender_id,
            json.dumps({
                "type": "message_status",
                "message_id": message.id,
                "status": "delivered",
            }),
        )
    except Exception:
        pass

    return message


@router.patch("/{message_id}/read")
async def mark_read(message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    message.status = "read"
    db.commit()
    db.refresh(message)

    # Broadcast read status to all clients in the conversation
    await manager.broadcast(
        json.dumps({
            "type": "message_status",
            "message_id": message.id,
            "status": "read",
        })
    )

    return message