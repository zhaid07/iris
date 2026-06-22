"use client";

import { useState } from "react";

import BriefingCard from "@/components/BriefingCard";
import ChatInterface from "@/components/ChatInterface";
import IntegrationStatus from "@/components/IntegrationStatus";

interface DashboardContentProps {
  briefing: { content: string; created_at: string } | null;
  isGoogleConnected: boolean;
  isCanvasConnected: boolean;
  initialMessages: { role: "user" | "assistant"; content: string }[];
  irisUserId: string;
}

export default function DashboardContent({
  briefing,
  isGoogleConnected,
  isCanvasConnected,
  initialMessages,
  irisUserId,
}: DashboardContentProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyUserId() {
    try {
      await navigator.clipboard.writeText(irisUserId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

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

      <div className="flex flex-col gap-3 rounded border border-gray-300 p-4">
        <h2 className="text-lg font-semibold">Chrome Extension</h2>
        <p className="text-sm text-gray-600">
          Install the Iris for Canvas extension and paste this ID during setup.
        </p>
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 break-all rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-900">
            {irisUserId}
          </span>
          <button
            type="button"
            onClick={handleCopyUserId}
            className="shrink-0 rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <BriefingCard briefing={briefing} />

      <ChatInterface initialMessages={initialMessages} />
    </div>
  );
}
