"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/user";
import { MoreVertical, Sparkles } from "lucide-react";

export default function Sidebar() {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <aside className="w-72 border-r border-zinc-800 bg-black/70 backdrop-blur-xl flex flex-col p-6">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
          <Sparkles size={18} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-purple-300">
            Flux
          </h1>
          <p className="text-green-400 text-sm">
            Active Now
          </p>
        </div>
      </div>

      {/* User Card */}
      <div className="mt-auto border border-zinc-800 bg-zinc-900 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-semibold">
          {user.username?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{user.username}</p>
          <p className="text-zinc-400 text-sm truncate">{user.email}</p>
        </div>
        <MoreVertical size={18} className="text-zinc-400 flex-shrink-0" />
      </div>

    </aside>
  );
}