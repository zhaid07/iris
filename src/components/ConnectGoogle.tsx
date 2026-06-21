"use client";

interface ConnectGoogleProps {
  isConnected?: boolean;
}

export default function ConnectGoogle({
  isConnected = false,
}: ConnectGoogleProps) {
  if (isConnected) {
    return (
      <p className="font-medium text-green-600">Google Connected ✓</p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = "/api/auth/google";
      }}
      className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
    >
      Connect Google
    </button>
  );
}
