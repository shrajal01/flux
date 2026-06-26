from fastapi import WebSocket


class ConnectionManager:
    """Manages active WebSocket connections and per-user routing."""

    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.user_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int) -> None:
        """Accept connection and register it for the given user."""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.user_connections[user_id] = websocket

    def disconnect(self, websocket: WebSocket) -> None:
        """Remove connection from active list and user map."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

        for uid, ws in list(self.user_connections.items()):
            if ws == websocket:
                del self.user_connections[uid]

    async def broadcast(self, message: str) -> None:
        """Send message to all active connections, cleaning up dead ones."""
        disconnected = []

        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                disconnected.append(connection)

        for connection in disconnected:
            if connection in self.active_connections:
                self.active_connections.remove(connection)

    async def send_personal_message(self, message: str, websocket: WebSocket) -> None:
        """Send message to a specific WebSocket connection."""
        await websocket.send_text(message)

    async def send_to_user(self, user_id: int, message: str) -> None:
        """Send message to a specific user by their user ID."""
        websocket = self.user_connections.get(user_id)

        if websocket:
            try:
                await websocket.send_text(message)
            except Exception:
                pass


# Singleton instance shared across the app
manager = ConnectionManager()