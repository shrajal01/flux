"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { API_BASE_URL } from "@/lib/api";

type Props = {
  selectedConversationId:
    number | null;

  setSelectedConversationId:
    React.Dispatch<
      React.SetStateAction<
        number | null
      >
    >;

  setSelectedConversationName:
    React.Dispatch<
      React.SetStateAction<string>
    >;
};

export default function ConversationPanel({
  selectedConversationId,
  setSelectedConversationId,
  setSelectedConversationName,
}: Props) {
  const [conversations, setConversations] =
    useState<any[]>([]);

  const fetchConversations =
    async () => {
      try {
        const response =
          await fetch(
            `${API_BASE_URL}/conversations`
          );

        const data =
          await response.json();

        setConversations(data);

      } catch (error) {
        console.error(error);
      }
    };

  const handleCreateConversation =
    async () => {

      const name =
        prompt(
          "Enter conversation name"
        );

      if (!name) return;

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/conversations`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name,
                is_group: true,
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to create conversation"
          );
        }

        await fetchConversations();

      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <section className="w-80 h-screen border-r border-zinc-800 bg-zinc-950/30 overflow-y-auto p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="uppercase tracking-widest text-zinc-500 text-sm">
          Direct Messages
        </h3>

        <Plus
          size={20}
          onClick={
            handleCreateConversation
          }
          className="text-purple-400 cursor-pointer"
        />
      </div>

      {/* Conversations */}
      <div className="space-y-3">
        {conversations.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            No conversations found
          </p>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => {
                setSelectedConversationId(
                  conversation.id
                );

                setSelectedConversationName(
                  conversation.name
                );
              }}
              className={`
                p-4
                rounded-xl
                cursor-pointer
                transition-colors
                ${
                  selectedConversationId ===
                  conversation.id
                    ? "bg-purple-900 border border-purple-500"
                    : "bg-zinc-900 hover:bg-zinc-800"
                }
              `}
            >
              <h3 className="font-semibold text-white">
                {conversation.name}
              </h3>

              <p className="text-zinc-400 text-sm mt-1">
                {conversation.is_group
                  ? "Group Chat"
                  : "Direct Message"}
              </p>

              <p className="text-zinc-500 text-xs mt-2">
                ID: {conversation.id}
              </p>
            </div>
          ))
        )}
      </div>

    </section>
  );
}