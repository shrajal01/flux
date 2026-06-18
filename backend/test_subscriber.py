import redis

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

pubsub = redis_client.pubsub()

pubsub.subscribe(
    "typing:1"
)

print("Listening...")

for message in pubsub.listen():

    if message["type"] == "message":

        print(
            "Received:",
            message["data"]
        )