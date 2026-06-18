from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.active_connections = []

    async def connect(
        self,
        websocket: WebSocket
    ):
        await websocket.accept()

        self.active_connections.append(
            websocket
        )

    def disconnect(
        self,
        websocket: WebSocket
    ):
        if websocket in self.active_connections:
            self.active_connections.remove(
                websocket
            )

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


manager = ConnectionManager()