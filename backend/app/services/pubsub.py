import json

from app.core.redis import redis_client


def publish_typing_event(conversation_id: int, user_id: int) -> None:
    """Publish a typing event to the Redis channel for a conversation."""
    redis_client.publish(
        f"typing:{conversation_id}",
        json.dumps({
            "type": "typing",
            "conversation_id": conversation_id,
            "user_id": user_id,
        }),
    )