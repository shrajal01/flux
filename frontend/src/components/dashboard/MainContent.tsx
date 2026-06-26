import ChatWindow from "./ChatWindow";

type Props = {
  selectedConversationId:
    number | null;

  selectedConversationName:
    string;
};

export default function MainContent({
  selectedConversationId,
  selectedConversationName,
}: Props) {
  return (
    <main className="flex-1 h-screen overflow-y-auto bg-black p-8">
      <div className="max-w-5xl mx-auto">

        {selectedConversationId ? (
          <ChatWindow
            conversationId={
              selectedConversationId
            }
            conversationName={
              selectedConversationName
            }
          />
        ) : (
          <div className="flex items-center justify-center h-screen text-zinc-500">
                Select a conversation to start chatting

          </div>
        )}

      </div>
    </main>
  );
}