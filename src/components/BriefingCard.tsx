"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface BriefingCardProps {
  briefing: { content: string; created_at: string } | null;
}

export default function BriefingCard({ briefing }: BriefingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/briefing/generate", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        router.refresh();
      } else {
        setError(data.error ?? "Failed to generate briefing");
      }
    } catch {
      setError("Failed to generate briefing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded border border-gray-300 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Today&apos;s Briefing</h2>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Briefing"}
        </button>
      </div>

      {briefing ? (
        <p className="text-gray-800">{briefing.content}</p>
      ) : (
        <p className="text-gray-600">
          No briefing yet. Click Generate to create your first one.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
