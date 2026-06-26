import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.connection_manager import manager
from app.services.presence import set_user_online, set_user_offline
from app.services.pubsub import publish_typing_event

router = APIRouter()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket, user_id)

    # Mark user online in Redis
    try:
        set_user_online(user_id)
    except Exception:
        pass

    try:
        while True:
            data = await websocket.receive_text()

            try:
                payload = json.loads(data)

                # Handle typing indicator events
                if payload.get("type") == "typing":
                    try:
                        publish_typing_event(
                            payload["conversation_id"],
                            payload["user_id"],
                        )
                    except Exception:
                        pass

            except json.JSONDecodeError:
                pass

            # Broadcast raw event to all connected clients
            await manager.broadcast(data)

    except WebSocketDisconnect:
        manager.disconnect(websocket)

        # Mark user offline in Redis
        try:
            set_user_offline(user_id)
        except Exception:
            pass

    except Exception:
        manager.disconnect(websocket)


@router.get("/ws-test")
def ws_test():
    return {"status": "router loaded"}