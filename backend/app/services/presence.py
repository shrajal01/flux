from app.core.redis import redis_client

ONLINE_USERS_KEY = "online_users"


def set_user_online(user_id: int) -> None:
    """Add user to the online set in Redis."""
    redis_client.sadd(ONLINE_USERS_KEY, user_id)


def set_user_offline(user_id: int) -> None:
    """Remove user from the online set in Redis."""
    redis_client.srem(ONLINE_USERS_KEY, user_id)


def get_online_users() -> list:
    """Return list of all currently online user IDs."""
    return list(redis_client.smembers(ONLINE_USERS_KEY))