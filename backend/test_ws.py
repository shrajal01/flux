import asyncio, websockets, json

async def main():
    async with websockets.connect(
        "ws://127.0.0.1:8000/ws/5"
    ) as websocket:

        print("CONNECTED")

        await websocket.send(
            json.dumps(
                {
                    "type": "typing",
                    "conversation_id": 1,
                    "user_id": 5
                }
            )
        )

        response = await websocket.recv()

        print("RECEIVED:", response)

        input("Press Enter to disconnect...")

asyncio.run(main())