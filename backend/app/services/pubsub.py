import redis, json

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)


def publish_typing_event(
    conversation_id: int,
    user_id: int
):
    redis_client.publish(
        f"typing:{conversation_id}",
        json.dumps(
            {
                "type": "typing",
                "conversation_id":
                conversation_id,
                "user_id":
                user_id
            }
        )
    )