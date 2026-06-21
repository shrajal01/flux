"use client";

import { useEffect, useRef, useState } from "react";

import { API_BASE_URL } from "@/lib/api";
import { getCurrentUser } from "@/lib/user";

type Props = {
  conversationId: number;
  conversationName: string;
};

export default function ChatWindow({
  conversationId,
  conversationName,
}: Props) {

  const [messages, setMessages] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  const [typingUser, setTypingUser] =
    useState<number | null>(null);

  const typingTimeoutRef =
    useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const socketRef =
    useRef<WebSocket | null>(null);

  const currentUserRef =
    useRef<any>(null);

  const conversationIdRef =
    useRef<number>(conversationId);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const fetchMessages =
    async () => {
      try {
        const response =
          await fetch(
            `${API_BASE_URL}/messages/${conversationId}?limit=500`
          );

        const data =
          await response.json();

        if (!Array.isArray(data)) {
          console.error("MESSAGES NOT ARRAY:", data);
          return;
        }

        setMessages(data);

        if (currentUserRef.current) {

          for (const msg of data) {

            if (
              msg.sender_id !==
                Number(
                  currentUserRef.current.id
                ) &&
              msg.status !== "read"
            ) {

              await fetch(
                `${API_BASE_URL}/messages/${msg.id}/read`,
                {
                  method: "PATCH",
                }
              );

            }

          }

        }

      } catch (error) {
        console.error(error);
      }
    };

  const fetchCurrentUser =
    async () => {
      try {
        const data =
          await getCurrentUser();

        setCurrentUser(data);
        currentUserRef.current = data;

      } catch (error) {
        console.error(
          "USER FETCH ERROR",
          error
        );
      }
    };

  const handleSendMessage =
    async () => {

      if (!message.trim()) return;
      if (!currentUser) return;

      const optimisticMsg = {
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
        const response =
          await fetch(
            `${API_BASE_URL}/messages`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                conversation_id: conversationId,
                sender_id: Number(currentUser.id),
                content: optimisticMsg.content,
              }),
            }
          );

        const data =
          await response.json();

        console.log(
          "POST RESPONSE:",
          data
        );

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === optimisticMsg.id
              ? data
              : msg
          )
        );

        if (!response.ok) {
          throw new Error(
            "Failed to send message"
          );
        }

      } catch (error) {
        console.error(error);
        setMessages((prev) =>
          prev.filter((m) => m.id !== optimisticMsg.id)
        );
      }
    };

  useEffect(() => {
    fetchMessages();
    fetchCurrentUser();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {

  if (!currentUser) return;

  const socket = new WebSocket(
    `ws://127.0.0.1:8000/ws/${currentUser.id}`
  );

 socket.onmessage = async (event) => {
  try {

    const payload =
      JSON.parse(event.data);

    if (
      payload.type === "message" &&
      payload.conversation_id ===
        conversationIdRef.current
    ) {

      const me =
        currentUserRef.current;

      if (
        payload.sender_id ===
        Number(me?.id)
      ) return;

      await fetch(
        `${API_BASE_URL}/messages/${payload.id}/delivered`,
        {
          method: "PATCH",
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: payload.id,
          conversation_id:
            payload.conversation_id,
          sender_id:
            payload.sender_id,
          content:
            payload.content,
          created_at:
            payload.created_at,
          status: "sent",
        },
      ]);

      
    }

    if (
      payload.type === "typing" &&
      payload.conversation_id ===
        conversationIdRef.current
    ) {

      const me =
        currentUserRef.current;

      if (
        payload.user_id ===
        Number(me?.id)
      ) {
        return;
      }

      setTypingUser(
        payload.user_id
      );

      if (
        typingTimeoutRef.current
      ) {
        clearTimeout(
          typingTimeoutRef.current
        );
      }

      typingTimeoutRef.current =
        setTimeout(() => {
          setTypingUser(null);
        }, 2000);
    }

    if (
      payload.type === "message_status"
    ) {

      console.log(
        "STATUS UPDATE RECEIVED",
        payload
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === payload.message_id
            ? {
                ...msg,
                status: payload.status,
              }
            : msg
        )
      );

    }

  } catch (e) {

    console.error(
      "WS PARSE ERROR:",
      e
    );

  }
};

  socket.onclose = () => {
    console.log("WebSocket Closed ❌");
  };

  socketRef.current = socket;

  return () => {
    socket.close();
  };

}, [currentUser]);

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 h-[80vh] flex flex-col">

      <div className="mb-6 border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold">
          {conversationName} Thread
        </h2>

        <p className="text-zinc-400 text-sm mt-1">
          Active Conversation
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 mb-4 flex flex-col gap-4">

        {messages.length === 0 ? (
          <p className="text-zinc-500">
            No messages found
          </p>
        ) : (
          messages.map((msg) => {

            const isMine =
              msg.sender_id === Number(currentUser?.id);

            return (
              <div
                key={msg.id}
                className={`flex w-full ${
                  isMine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[70%]
                    rounded-2xl
                    px-4
                    py-3
                    ${
                      isMine
                        ? "bg-purple-600 text-white"
                        : "bg-zinc-800 text-white"
                    }
                  `}
                >
                  <p>
                    {msg.content}
                  </p>

                  <p className="text-xs opacity-70 mt-2">
                    {new Date(
                      msg.created_at
                    ).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone:
                          "Asia/Kolkata",
                      }
                    )}
                  </p>

                  {isMine && (
                    <p className="text-xs opacity-70 mt-1">
                      {msg.status === "sent" && "✓ Sent"}

                      {msg.status === "delivered" &&
                        "✓✓ Delivered"}

                      {msg.status === "read" &&
                        "👁 Read"}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}

        {typingUser && (
          <p className="
            text-sm
            text-zinc-400
            italic
            px-2
          ">
            User is typing...
          </p>
        )}

        <div ref={messagesEndRef} />

      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => {

            setMessage(
              e.target.value
            );

            if (
              socketRef.current &&
              socketRef.current.readyState ===
                WebSocket.OPEN
            ) {

              socketRef.current.send(
                JSON.stringify({
                  type: "typing",
                  conversation_id:
                    conversationId,
                  user_id:
                    Number(
                      currentUser?.id
                    ),
                })
              );
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="
            flex-1
            bg-zinc-800
            border
            border-zinc-700
            rounded-xl
            px-4
            py-3
            outline-none
          "
        />

        <button
          onClick={handleSendMessage}
          className="
            px-6
            py-3
            rounded-xl
            bg-purple-600
            hover:bg-purple-700
          "
        >
          Send
        </button>
      </div>

    </div>
  );
}