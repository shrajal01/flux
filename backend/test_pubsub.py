from app.services.pubsub import (
    publish_typing_event
)

publish_typing_event(
    1,
    5
)

print("Published")