import redis

# Single shared Redis client instance used across the app
redis_client = redis.Redis(
    host="localhost",
    port=6379,
    db=0,
    decode_responses=True,
)