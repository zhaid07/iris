"use client";

import { FormEvent, useState } from "react";

interface ConnectCanvasProps {
  isConnected?: boolean;
}

export default function ConnectCanvas({
  isConnected = false,
}: ConnectCanvasProps) {
  const [canvasDomain, setCanvasDomain] = useState("");
  const [canvasToken, setCanvasToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(isConnected);

  if (connected) {
    return (
      <p className="font-medium text-green-600">Canvas Connected ✓</p>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/canvas/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canvasToken, canvasDomain }),
      });

      const data = await res.json();

      if (data.success) {
        setConnected(true);
      } else {
        setError(data.error ?? "Failed to connect Canvas");
      }
    } catch {
      setError("Failed to connect Canvas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-sm text-gray-600">
        Get your token from Canvas → Account → Settings → New Access Token
      </p>

      <input
        type="text"
        value={canvasDomain}
        onChange={(e) => setCanvasDomain(e.target.value)}
        placeholder="canvas.university.edu"
        className="rounded border border-gray-300 px-3 py-2 text-sm"
        required
      />

      <input
        type="password"
        value={canvasToken}
        onChange={(e) => setCanvasToken(e.target.value)}
        placeholder="Your Canvas API token"
        className="rounded border border-gray-300 px-3 py-2 text-sm"
        required
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Connecting..." : "Connect Canvas"}
      </button>
    </form>
  );
}
