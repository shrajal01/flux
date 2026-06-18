from app.services.presence import (
    set_user_online,
    get_online_users
)

set_user_online(5)

print(
    get_online_users()
)
