"use client";

import { useEffect, useRef, useState } from "react";

import { API_BASE_URL } from "@/lib/api";
import { getCurrentUser } from "@/lib/user";
import { Message, User } from "@/types";

type Props = {
  conversationId: number;
  conversationName: string;
};

export default function ChatWindow({ conversationId, conversationName }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [typingUser, setTypingUser] = useState<number | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const currentUserRef = useRef<User | null>(null);
  const conversationIdRef = useRef<number>(conversationId);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // ── Data Fetching ─────────────────────────────────────────────────────────

  const fetchMessages = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/${conversationId}?limit=500`
      );

      const data = await response.json();

      if (!Array.isArray(data)) return;

      setMessages(data);

      // Mark incoming messages as read
      if (currentUserRef.current) {
        for (const msg of data) {
          if (
            msg.sender_id !== Number(currentUserRef.current.id) &&
            msg.status !== "read"
          ) {
            await fetch(`${API_BASE_URL}/messages/${msg.id}/read`, {
              method: "PATCH",
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCurrentUser = async (): Promise<void> => {
    try {
      const data = await getCurrentUser();
      setCurrentUser(data);
      currentUserRef.current = data;
    } catch (error) {
      console.error(error);
    }
  };

  // ── Send Message ──────────────────────────────────────────────────────────

  const handleSendMessage = async (): Promise<void> => {
    if (!message.trim() || !currentUser) return;

    // Optimistic update — show message immediately
    const optimisticMsg: Message = {
      id: Date.now(),
      conversation_id: conversationId,
      sender_id: Number(currentUser.id),
      content: message,
      created_at: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender_id: Number(currentUser.id),
          content: optimisticMsg.content,
        }),
      });

      const data: Message = await response.json();

      // Replace optimistic message with real one from server
      setMessages((prev) =>
        prev.map((msg) => (msg.id === optimisticMsg.id ? data : msg))
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchCurrentUser();
  }, [conversationId]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── WebSocket ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!currentUser) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/${currentUser.id}`);

    socket.onmessage = async (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data);

        if (
          payload.type === "message" &&
          payload.conversation_id === conversationIdRef.current
        ) {
          // Ignore messages sent by current user (already shown optimistically)
          if (payload.sender_id === Number(currentUserRef.current?.id)) return;

          await fetch(`${API_BASE_URL}/messages/${payload.id}/delivered`, {
            method: "PATCH",
          });

          setMessages((prev) => [
            ...prev,
            {
              id: payload.id,
              conversation_id: payload.conversation_id,
              sender_id: payload.sender_id,
              content: payload.content,
              created_at: payload.created_at,
              status: "sent",
            },
          ]);
        }

        if (
          payload.type === "typing" &&
          payload.conversation_id === conversationIdRef.current
        ) {
          // Ignore own typing events
          if (payload.user_id === Number(currentUserRef.current?.id)) return;

          setTypingUser(payload.user_id);

          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }

          // Clear typing indicator after 2 seconds of inactivity
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUser(null);
          }, 2000);
        }

        if (payload.type === "message_status") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.message_id
                ? { ...msg, status: payload.status }
                : msg
            )
          );
        }
      } catch (error) {
        console.error("WS parse error:", error);
      }
    };

    socket.onclose = () => {
      // Socket closed — reconnection not implemented
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [currentUser]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 h-[80vh] flex flex-col">

      {/* Chat header */}
      <div className="mb-6 border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold">{conversationName} Thread</h2>
        <p className="text-zinc-400 text-sm mt-1">Active Conversation</p>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto pr-2 mb-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <p className="text-zinc-500">No messages yet</p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === Number(currentUser?.id);

            return (
              <div
                key={msg.id}
                className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    isMine ? "bg-purple-600 text-white" : "bg-zinc-800 text-white"
                  }`}
                >
                  <p>{msg.content}</p>

                  <p className="text-xs opacity-70 mt-2">
                    {new Date(msg.created_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>

                  {/* Message status — only shown for sent messages */}
                  {isMine && (
                    <p className="text-xs opacity-70 mt-1">
                      {msg.status === "sent" && "✓ Sent"}
                      {msg.status === "delivered" && "✓✓ Delivered"}
                      {msg.status === "read" && "👁 Read"}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}

        {typingUser && (
          <p className="text-sm text-zinc-400 italic px-2">User is typing...</p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);

            // Send typing event via WebSocket
            if (socketRef.current?.readyState === WebSocket.OPEN) {
              socketRef.current.send(
                JSON.stringify({
                  type: "typing",
                  conversation_id: conversationId,
                  user_id: Number(currentUser?.id),
                })
              );
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <button
          onClick={handleSendMessage}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700"
        >
          Send
        </button>
      </div>

    </div>
  );
}