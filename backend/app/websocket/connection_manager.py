from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.active_connections = []
        self.user_connections = {}

    async def connect(
        self,
        websocket: WebSocket,
        user_id: int
    ):
        await websocket.accept()

        self.active_connections.append(
            websocket
        )

        self.user_connections[user_id] = websocket

    def disconnect(
        self,
        websocket: WebSocket
    ):
        if websocket in self.active_connections:
            self.active_connections.remove(
                websocket
            )

        for uid, ws in list(
            self.user_connections.items()
        ):
            if ws == websocket:
                del self.user_connections[uid]

    async def send_personal_message(
        self,
        message: str,
        websocket: WebSocket
    ):
        await websocket.send_text(
            message
        )

    async def broadcast(
        self,
        message: str
    ):

        print(
            "ACTIVE CONNECTIONS:",
            len(self.active_connections)
        )

        disconnected = []

        for connection in self.active_connections:
            try:
                await connection.send_text(
                    message
                )

            except Exception:
                disconnected.append(
                    connection
                )

        for connection in disconnected:
            if connection in self.active_connections:
                self.active_connections.remove(
                    connection
                )

    async def send_to_user(
        self,
        user_id: int,
        message: str
    ):
        websocket = self.user_connections.get(
            user_id
        )

        if websocket:
            try:
                await websocket.send_text(
                    message
                )

            except Exception:
                pass


manager = ConnectionManager()