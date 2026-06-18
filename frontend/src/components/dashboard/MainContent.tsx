import Topbar from "../Topbar";
import OnlineUsers from "../OnlineUsers";
import ResumeConversations from "../ResumeConversations";
import RecentActivity from "../RecentActivity";

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
          <div className="space-y-10">

            <Topbar />

            <OnlineUsers />

            <ResumeConversations />

            <RecentActivity />

          </div>
        )}

      </div>
    </main>
  );
}