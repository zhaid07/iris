"use client";

import Link from "next/link";

interface IntegrationStatusProps {
  isGoogleConnected: boolean;
  isCanvasConnected: boolean;
}

function StatusRow({
  label,
  connected,
}: {
  label: string;
  connected: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-sm">
        {label}: {connected ? "Connected" : "Not connected"}
      </span>
    </div>
  );
}

export default function IntegrationStatus({
  isGoogleConnected,
  isCanvasConnected,
}: IntegrationStatusProps) {
  const allConnected = isGoogleConnected && isCanvasConnected;

  return (
    <div className="flex flex-col gap-3 rounded border border-gray-300 p-4">
      <h2 className="text-lg font-semibold">Integrations</h2>

      <StatusRow label="Google" connected={isGoogleConnected} />
      <StatusRow label="Canvas" connected={isCanvasConnected} />

      {!allConnected && (
        <Link
          href="/onboarding"
          className="text-sm text-blue-600 underline"
        >
          Connect missing integrations
        </Link>
      )}
    </div>
  );
}
