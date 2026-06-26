"use client";

import { Plus, MessageCircle, Users, X, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { API_BASE_URL } from "@/lib/api";

type Props = {
  selectedConversationId: number | null;
  setSelectedConversationId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedConversationName: React.Dispatch<React.SetStateAction<string>>;
};

type Conversation = {
  id: number;
  name: string | null;
  is_group: boolean;
  other_user_id?: number | null;
  other_username?: string | null;
  created_at: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};

export default function ConversationPanel({
  selectedConversationId,
  setSelectedConversationId,
  setSelectedConversationName,
}: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // New Chat modal
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");

  // New Group modal
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [creatingGroup, setCreatingGroup] = useState(false);

  // ── helpers ──────────────────────────────────────────────

  const token = () => localStorage.getItem("access_token");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token()}`,
  });

  // ── data fetching ─────────────────────────────────────────

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setConversations(data);
    } catch (err) {
      console.error("fetchConversations:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error("fetchUsers:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── open conversation helper ──────────────────────────────

  const openConversation = (conv: Conversation) => {
    setSelectedConversationId(conv.id);
    setSelectedConversationName(conv.name ?? conv.other_username ?? "Chat");
  };

  // ── New Chat (DM) flow ────────────────────────────────────

  const handleSelectUser = async (user: User) => {
    setNewChatOpen(false);
    setNewChatSearch("");

    try {
      const res = await fetch(`${API_BASE_URL}/conversations/direct`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ receiver_id: user.id }),
      });

      const data: Conversation = await res.json();

      if (!res.ok) {
        console.error("DM creation failed:", data);
        return;
      }

      // Merge into sidebar without a full refetch, then select
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === data.id);
        if (exists) return prev;
        return [data, ...prev];
      });

      openConversation(data);
    } catch (err) {
      console.error("handleSelectUser:", err);
    }
  };

  // ── New Group flow ────────────────────────────────────────

  const toggleGroupUser = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    if (selectedUserIds.length === 0) return;

    setCreatingGroup(true);

    try {
      // 1. Create the group conversation
      const res = await fetch(`${API_BASE_URL}/conversations`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: groupName.trim(), is_group: true }),
      });

      const conv: Conversation = await res.json();

      if (!res.ok) {
        console.error("Group creation failed:", conv);
        setCreatingGroup(false);
        return;
      }

      // 2. Add each selected member
      await Promise.all(
        selectedUserIds.map((uid) =>
          fetch(`${API_BASE_URL}/conversations/${conv.id}/members`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ user_id: uid }),
          })
        )
      );

      // 3. Reset modal state
      setNewGroupOpen(false);
      setGroupName("");
      setGroupSearch("");
      setSelectedUserIds([]);

      // 4. Add to sidebar and open
      setConversations((prev) => [conv, ...prev]);
      openConversation(conv);
    } catch (err) {
      console.error("handleCreateGroup:", err);
    } finally {
      setCreatingGroup(false);
    }
  };

  // ── filtered user lists ───────────────────────────────────

  const filteredForChat = users.filter((u) =>
    u.username.toLowerCase().includes(newChatSearch.toLowerCase())
  );

  const filteredForGroup = users.filter((u) =>
    u.username.toLowerCase().includes(groupSearch.toLowerCase())
  );

  // ── render ────────────────────────────────────────────────

  return (
    <>
      {/* ── Panel ── */}
      <section className="w-80 h-screen border-r border-zinc-800 bg-zinc-950/30 overflow-y-auto p-4 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="uppercase tracking-widest text-zinc-500 text-sm">
            Messages
          </h3>

          {/* + Button with dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="text-purple-400 hover:text-purple-300 transition-colors p-1 rounded-lg hover:bg-zinc-800"
              title="New conversation"
            >
              <Plus size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-50 w-44 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setNewChatOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <MessageCircle size={16} className="text-purple-400" />
                  New Chat
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setNewGroupOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors border-t border-zinc-800"
                >
                  <Users size={16} className="text-purple-400" />
                  New Group
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conversation list */}
        <div className="space-y-2 flex-1">
          {conversations.length === 0 ? (
            <p className="text-zinc-500 text-sm px-2">
              No conversations yet. Hit + to start one.
            </p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => openConversation(conv)}
                className={`
                  p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3
                  ${
                    selectedConversationId === conv.id
                      ? "bg-purple-900/60 border border-purple-500/50"
                      : "bg-zinc-900 hover:bg-zinc-800"
                  }
                `}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-purple-600/40 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-purple-200">
                  {conv.is_group
                    ? (conv.name?.[0] ?? "G").toUpperCase()
                    : (conv.name?.[0] ?? "?").toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm truncate">
                    {conv.name ?? conv.other_username ?? "Unknown"}
                  </p>
                  <p className="text-zinc-500 text-xs">
                    {conv.is_group ? "Group" : "Direct Message"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── New Chat Modal ── */}
      {newChatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setNewChatOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="font-semibold text-white">New Chat</h2>
              <button
                onClick={() => { setNewChatOpen(false); setNewChatSearch(""); }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <input
                autoFocus
                type="text"
                value={newChatSearch}
                onChange={(e) => setNewChatSearch(e.target.value)}
                placeholder="Search people…"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* User list */}
            <div className="max-h-72 overflow-y-auto pb-3">
              {filteredForChat.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-6">
                  No users found
                </p>
              ) : (
                filteredForChat.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-600/40 flex items-center justify-center text-sm font-semibold text-purple-200 flex-shrink-0">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── New Group Modal ── */}
      {newGroupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setNewGroupOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800 flex-shrink-0">
              <h2 className="font-semibold text-white">New Group</h2>
              <button
                onClick={() => {
                  setNewGroupOpen(false);
                  setGroupName("");
                  setGroupSearch("");
                  setSelectedUserIds([]);
                }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 flex-shrink-0">
              {/* Group name */}
              <input
                autoFocus
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name…"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors mb-3"
              />

              {/* Member search */}
              <input
                type="text"
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                placeholder="Add people…"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors"
              />

              {/* Selected chips */}
              {selectedUserIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedUserIds.map((uid) => {
                    const u = users.find((u) => u.id === uid);
                    return (
                      <span
                        key={uid}
                        onClick={() => toggleGroupUser(uid)}
                        className="inline-flex items-center gap-1 bg-purple-700/50 border border-purple-500/30 text-purple-200 text-xs px-2.5 py-1 rounded-full cursor-pointer hover:bg-purple-700/80 transition-colors"
                      >
                        {u?.username}
                        <X size={10} />
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto">
              {filteredForGroup.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-6">
                  No users found
                </p>
              ) : (
                filteredForGroup.map((user) => {
                  const selected = selectedUserIds.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      onClick={() => toggleGroupUser(user.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3 transition-colors text-left ${
                        selected ? "bg-purple-900/40" : "hover:bg-zinc-800"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-600/40 flex items-center justify-center text-sm font-semibold text-purple-200 flex-shrink-0">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{user.username}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>
                      {selected && (
                        <Check size={16} className="text-purple-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Create button */}
            <div className="p-4 border-t border-zinc-800 flex-shrink-0">
              <button
                onClick={handleCreateGroup}
                disabled={
                  !groupName.trim() ||
                  selectedUserIds.length === 0 ||
                  creatingGroup
                }
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
              >
                {creatingGroup
                  ? "Creating…"
                  : `Create Group${selectedUserIds.length > 0 ? ` (${selectedUserIds.length})` : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}