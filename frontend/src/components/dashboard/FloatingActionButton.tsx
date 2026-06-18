import { Send } from "lucide-react";

export default function FloatingActionButton() {
  return (
    <button
      className="
        fixed
        bottom-8
        right-8
        w-16
        h-16
        rounded-full
        bg-gradient-to-r
        from-purple-500
        to-purple-700
        flex
        items-center
        justify-center
        shadow-lg
        shadow-purple-500/30
        hover:scale-105
        transition-all
      "
    >
      <Send size={22} />
    </button>
  );
}