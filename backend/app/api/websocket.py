import json

from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect
)

from app.websocket.connection_manager import (
    manager
)

from app.services.presence import (
    set_user_online,
    set_user_offline
)

from app.services.pubsub import (
    publish_typing_event
)

router = APIRouter()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: int
):

    print(
        f"WS CONNECTING USER {user_id}"
    )

    print(
        "WS ROUTE MANAGER:",
        id(manager)
    )

    await manager.connect(
        websocket
    )

    print(
        "ACTIVE CONNECTIONS:",
        len(manager.active_connections)
    )

    # Redis presence
    try:
        set_user_online(
            user_id
        )

        print(
            f"USER {user_id} ONLINE"
        )

    except Exception as e:

        print(
            "REDIS ONLINE ERROR:",
            e
        )

    try:

        while True:

            data = await websocket.receive_text()

            print(
                "WS RECEIVED:",
                data
            )

            try:

                payload = json.loads(
                    data
                )

                if (
                    payload.get("type")
                    == "typing"
                ):

                    try:

                        publish_typing_event(
                            payload[
                                "conversation_id"
                            ],
                            payload[
                                "user_id"
                            ]
                        )

                    except Exception as e:

                        print(
                            "PUBSUB ERROR:",
                            e
                        )

            except Exception as e:

                print(
                    "JSON ERROR:",
                    e
                )

            await manager.broadcast(
                data
            )

    except WebSocketDisconnect:

        print(
            f"WS DISCONNECTED USER {user_id}"
        )

        manager.disconnect(
            websocket
        )

        print(
            "ACTIVE CONNECTIONS:",
            len(manager.active_connections)
        )

        try:

            set_user_offline(
                user_id
            )

        except Exception as e:

            print(
                "REDIS OFFLINE ERROR:",
                e
            )

    except Exception as e:

        print(
            "WS ERROR:",
            e
        )

        manager.disconnect(
            websocket
        )

        print(
            "ACTIVE CONNECTIONS:",
            len(manager.active_connections)
        )


@router.get("/ws-test")
def ws_test():

    return {
        "status": "router loaded"
    }