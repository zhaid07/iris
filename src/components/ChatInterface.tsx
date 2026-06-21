"use client";

import { FormEvent, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  initialMessages: ChatMessage[];
}

const SUGGESTED_PROMPTS = [
  "Why is this important?",
  "What did I miss?",
  "What should I focus on today?",
];

export default function ChatInterface({
  initialMessages,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: trimmed },
          { role: "assistant", content: data.response },
        ]);
      } else {
        setError(data.error ?? "Failed to send message");
        setInput(trimmed);
      }
    } catch {
      setError("Failed to send message");
      setInput(trimmed);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex flex-col gap-4 rounded border border-gray-300 p-4">
      <h2 className="text-lg font-semibold">Chat with Iris</h2>

      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-600">
            Ask Iris about your briefing, assignments, or schedule.
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`rounded px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "ml-8 bg-blue-50 text-blue-900"
                  : "mr-8 bg-gray-50 text-gray-800"
              }`}
            >
              <span className="font-medium">
                {msg.role === "user" ? "You" : "Iris"}:
              </span>{" "}
              {msg.content}
            </div>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            disabled={loading}
            className="rounded border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
