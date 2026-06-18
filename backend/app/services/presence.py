from app.core.redis import redis_client


def set_user_online(
    user_id: int
):
    redis_client.sadd(
        "online_users",
        user_id
    )


def set_user_offline(
    user_id: int
):
    redis_client.srem(
        "online_users",
        user_id
    )


def get_online_users():
    return list(
        redis_client.smembers(
            "online_users"
        )
    )