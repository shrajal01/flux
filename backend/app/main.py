from fastapi import FastAPI

from app.db.database import engine, Base
from app.models import User, Conversation, ConversationMember, Message
from app.api.auth import router as auth_router

from app.api.conversation import (
    router as conversation_router
)
from app.api.message import (
    router as message_router
)
from app.api.websocket import (
    router as websocket_router
)
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(conversation_router)
app.include_router(message_router)
app.include_router(
    websocket_router
)

@app.get("/")
def root():
    return {
        "message": "Flux Backend Running 🚀"
    }