# Flux

A real-time messaging application built with FastAPI and Next.js, inspired by WhatsApp and Discord.

---

## Features

- **Real-time messaging** via WebSockets — messages appear instantly without page refresh
- **Direct Messages** — start a one-on-one conversation with any user
- **Group Chats** — create named groups and add multiple members
- **Message Status** — Sent → Delivered → Read receipts
- **Typing Indicators** — see when someone is typing in real time
- **Online Presence** — live tracking of which users are currently online via Redis
- **JWT Authentication** — secure login with access and refresh tokens
- **Conversation Sidebar** — live-updating list of all DMs and groups

---

## Tech Stack

### Backend
| Tool | Purpose |
|---|---|
| FastAPI | REST API + WebSocket server |
| PostgreSQL | Persistent data storage |
| SQLAlchemy | ORM |
| Redis | Online presence + pub/sub |
| python-jose | JWT token generation and verification |
| passlib + bcrypt | Password hashing |
| Uvicorn | ASGI server |

### Frontend
| Tool | Purpose |
|---|---|
| Next.js 16 | React framework |
| React 19 | UI library |
| TypeScript | Type safety |
| TailwindCSS 4 | Styling |
| lucide-react | Icons |
| WebSocket API | Real-time connection to backend |

---

## Project Structure

```
flux/
├── backend/
│   └── app/
│       ├── api/             # Route handlers (auth, conversations, messages, websocket)
│       ├── core/            # Security (JWT) and Redis client
│       ├── db/              # Database engine and session
│       ├── models/          # SQLAlchemy models
│       ├── schemas/         # Pydantic schemas
│       ├── services/        # Presence and pub/sub logic
│       ├── websocket/       # WebSocket connection manager
│       └── main.py          # FastAPI app entry point
└── frontend/
    └── src/
        ├── app/             # Next.js pages (login, register, dashboard)
        ├── components/      # UI components
        │   └── dashboard/   # Sidebar, ConversationPanel, ChatWindow
        ├── lib/             # API helpers, auth utils
        └── types/           # Shared TypeScript types
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- Redis

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Fill in your DATABASE_URL, SECRET_KEY, REDIS_HOST etc.

# Start the server
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT tokens |
| GET | `/auth/me` | Get current authenticated user |
| GET | `/auth/users` | Get all users (excluding self) |
| GET | `/conversations` | Get all conversations for current user |
| POST | `/conversations` | Create a group conversation |
| POST | `/conversations/direct` | Create or open a direct message |
| POST | `/conversations/{id}/members` | Add a member to a group |
| GET | `/messages/{conversation_id}` | Fetch messages for a conversation |
| POST | `/messages/{conversation_id}` | Send a message |
| WS | `/ws/{user_id}` | WebSocket connection for real-time events |

---

## Environment Variables

### Backend `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/flux
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## Author

**Shrajal** — [github.com/shrajal01](https://github.com/shrajal01)