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

  console.log(
    "CHATWINDOW RENDERED 🔥"
  );

  const [messages, setMessages] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const socketRef =
    useRef<WebSocket | null>(null);

 const fetchMessages =
  async () => {
    try {

      console.log(
        "FETCHING MESSAGES..."
      );

      const response =
        await fetch(
          `${API_BASE_URL}/messages/${conversationId}`
        );

      const data =
        await response.json();

      console.log(
        "FETCHED MESSAGES:",
        data.length
      );

      console.log(
        data
      );

      setMessages(data);

    } catch (error) {
      console.error(error);
    }
  };
  const fetchCurrentUser =
    async () => {
      try {
        const data =
          await getCurrentUser();

        console.log(
          "USER DATA:",
          data
        );
        setCurrentUser(data);

      } catch (error) {
        console.error(
          "USER FETCH ERROR",
          error
        );
      }
    };

  const handleSendMessage =
    async () => {

      console.log("SEND CLICKED");

      if (!message.trim()) {
        console.log("EMPTY MESSAGE");
        return;
      }

      if (!currentUser) {
        console.log("USER NOT LOADED");
        return;
      }

      console.log(
        "SENDING...",
        message
      );


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
                sender_id: Number(currentUser.sub),
                content: message,
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to send message"
          );
        }

        setMessage("");

        await fetchMessages();

      } catch (error) {
        console.error(error);
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

    console.log(
        "CURRENT USER:",
        currentUser
    );

    console.log(
        "CURRENT USER ID:",
        currentUser?.id
      );

    if (!currentUser) return;

    console.log(
        "TRYING WS..."
    );

    const socket = new WebSocket(
    `ws://127.0.0.1:8000/ws/${currentUser.sub}`
  );

    socket.onopen = () => {
      console.log(
        "WebSocket Connected ✅",
        currentUser.id
      );
    };

    socket.onmessage = (event) => {
      console.log("RAW WS:", event.data);

      const payload = JSON.parse(event.data);

      console.log("PARSED WS:", payload);

      if (
        payload.type === "message" &&
        payload.conversation_id === conversationId
      ) {
        console.log("FETCHING NEW MESSAGES...");
        fetchMessages();
      }
    };

    

    

    socket.onclose = () => {
      console.log(
        "WebSocket Closed ❌",
        currentUser.id
      );
    };

    socketRef.current = socket;

    return () => {
        socket.close();
    };

    }, [currentUser]);

    console.log(
      "MESSAGES STATE:",
      messages.length
    );

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

              console.log(
                "RENDERING:",
                msg.id,
                msg.content
              );
            const isMine =
                msg.sender_id === Number(currentUser?.sub);

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
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />

      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
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