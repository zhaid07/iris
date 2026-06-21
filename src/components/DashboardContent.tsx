"use client";

import BriefingCard from "@/components/BriefingCard";
import ChatInterface from "@/components/ChatInterface";
import IntegrationStatus from "@/components/IntegrationStatus";

interface DashboardContentProps {
  briefing: { content: string; created_at: string } | null;
  isGoogleConnected: boolean;
  isCanvasConnected: boolean;
  initialMessages: { role: "user" | "assistant"; content: string }[];
}

export default function DashboardContent({
  briefing,
  isGoogleConnected,
  isCanvasConnected,
  initialMessages,
}: DashboardContentProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Your daily briefing and assistant.</p>
      </div>

      <IntegrationStatus
        isGoogleConnected={isGoogleConnected}
        isCanvasConnected={isCanvasConnected}
      />

      <BriefingCard briefing={briefing} />

      <ChatInterface initialMessages={initialMessages} />
    </div>
  );
}
