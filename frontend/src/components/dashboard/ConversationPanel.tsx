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
  
  const [users, setUsers] =
    useState<any[]>([]);

  const fetchConversations = async () => {
  try {

    const token =
      localStorage.getItem("access_token");

    const response =
      await fetch(
        `${API_BASE_URL}/conversations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    console.log(
      "CONVERSATIONS:",
      data
    );

    console.log("STATE BEFORE:", conversations.length);

    console.log(
      Array.isArray(data)
    );

    setConversations(data);

  } catch (error) {
    console.error(error);
  }
};

const fetchUsers = async () => {

  const token =
    localStorage.getItem(
      "access_token"
    );

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/auth/users`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    console.log(
      "USERS:",
      data
    );

    setUsers(data);

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

    const token =
      localStorage.getItem(
        "access_token"
      );

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/conversations`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name,
              is_group: true,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "CREATE RESPONSE:",
        data
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

  const createDM = async () => {

    console.log("Receiver ID:", 6);

    if(users.length===0){
      return;
    }

  const token =
    localStorage.getItem(
      "access_token"
    );

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/conversations/direct`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            receiver_id: users[0]?.id,
          }),
        }
      );

    console.log("STATUS:", response.status);

    const data =
      await response.json();

    console.log(
      "DM RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        "Failed to create DM"
      );
    }

    await fetchConversations();

  } catch (error) {

    console.error(error);

  }

};

  useEffect(() => {

    fetchConversations();

    fetchUsers();

  }, []);

  useEffect(() => {
    console.log(
        "STATE UPDATED:",
        conversations
    );
}, [conversations]);
  
return (
  <section className="w-80 h-screen border-r border-zinc-800 bg-zinc-950/30 overflow-y-auto p-4">

    {/* Header */}
    <div className="flex items-center justify-between mb-6 px-2">
      <h3 className="uppercase tracking-widest text-zinc-500 text-sm">
        Direct Messages
      </h3>

      <Plus
        size={20}
        onClick={createDM}
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
        conversations.map((conversation) => {

          console.log(
            "Rendering:",
            conversation.id,
            conversation.name
          );

          return (
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
                  selectedConversationId === conversation.id
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
          );

        })
      )}
    </div>

  </section>
);
}