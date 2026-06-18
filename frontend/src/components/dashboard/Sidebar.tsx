"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/user";

import {
  Home,
  MessageSquare,
  Users,
  Settings,
  MoreVertical,
  Sparkles,
} from "lucide-react";

export default function Sidebar() {
  const [user, setUser] = useState({
  username: "",
  email: "",
});
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const data =
        await getCurrentUser();

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

      {/* Navigation */}
      <nav className="flex flex-col gap-3 mt-12">

        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl text-purple-300 font-semibold"
        >
          <Home size={20} />
          Home
        </a>

        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl text-zinc-400 hover:text-purple-300"
        >
          <MessageSquare size={20} />
          Messages
        </a>

        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl text-zinc-400 hover:text-purple-300"
        >
          <Users size={20} />
          Groups
        </a>

        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl text-zinc-400 hover:text-purple-300"
        >
          <Settings size={20} />
          Settings
        </a>

      </nav>

      {/* User Card */}
      <div className="mt-auto border border-zinc-800 bg-zinc-900 rounded-xl p-4 flex items-center gap-3">

        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
          A
        </div>

        <div className="flex-1">
          <p className="font-semibold">
            {user.username}
          </p>

          <p className="text-zinc-400 text-sm">
            {user.email}
          </p>
        </div>

        <MoreVertical
          size={18}
          className="text-zinc-400"
        />

      </div>

    </aside>
  );
}