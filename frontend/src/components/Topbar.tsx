import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-4xl font-bold">
          Good Evening, Alex
        </h1>

        <p className="text-zinc-400 mt-2">
          8 Conversations Waiting · 3 People Online
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
          <Search size={18} />
        </button>

        <button className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 relative">
          <Bell size={18} />

          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-500"></div>
        </button>
      </div>
    </div>
  );
}