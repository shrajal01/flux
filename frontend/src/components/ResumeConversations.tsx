export default function ResumeConversations() {
  const conversations = [
    {
      title: "Mike Ross",
      subtitle: "Active now",
      message: "Did you check the new motion guidelines?",
      action: "Reply →",
    },
    {
      title: "Design Team",
      subtitle: "Team discussion continues...",
      message: "Team discussion continues...",
      action: "Open Thread →",
    },
  ];

  return (
    <div>
      <h2 className="text-5xl font-bold mb-8">
        Resume Conversation
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {conversations.map((conversation) => (
          <div
            key={conversation.title}
            className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 hover:border-purple-500/30 transition-all"
          >
            <h3 className="font-bold text-2xl mb-4">
              {conversation.title}
            </h3>

            <p className="text-zinc-400 mb-6">
              {conversation.subtitle}
            </p>

            <p className="text-zinc-300 mb-8">
              {conversation.message}
            </p>

            <button className="text-purple-400 font-semibold">
              {conversation.action}
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}