"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAccessToken } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import ConversationPanel from "@/components/dashboard/ConversationPanel";
import MainContent from "@/components/dashboard/MainContent";
import FloatingActionButton from "@/components/dashboard/FloatingActionButton";

export default function DashboardPage() {
  const router = useRouter();

  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [selectedConversationName, setSelectedConversationName] = useState<string>("");

  // Redirect to login if no token found
  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <main className="flex min-h-screen bg-black text-white">
        <Sidebar />
        <ConversationPanel
          selectedConversationId={selectedConversationId}
          setSelectedConversationId={setSelectedConversationId}
          setSelectedConversationName={setSelectedConversationName}
        />
        <MainContent
          selectedConversationId={selectedConversationId}
          selectedConversationName={selectedConversationName}
        />
      </main>
      <FloatingActionButton />
    </>
  );
}