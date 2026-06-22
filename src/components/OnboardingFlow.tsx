"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import ConnectCanvas from "@/components/ConnectCanvas";
import ConnectGoogle from "@/components/ConnectGoogle";

interface OnboardingFlowProps {
  isGoogleConnected: boolean;
  isCanvasConnected: boolean;
  googleError?: boolean;
}

const STEPS = ["Google", "Canvas", "Details", "Done"];

const BRIEFING_TIMES = [
  { label: "6am", value: "06:00" },
  { label: "7am", value: "07:00" },
  { label: "8am", value: "08:00" },
  { label: "9am", value: "09:00" },
  { label: "10am", value: "10:00" },
];

export default function OnboardingFlow({
  isGoogleConnected,
  isCanvasConnected,
  googleError = false,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [canvasConnected, setCanvasConnected] = useState(isCanvasConnected);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [briefingTime, setBriefingTime] = useState("08:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSaveDetails(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/save-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, briefingTime }),
      });

      const data = await res.json();

      if (data.success) {
        setCurrentStep(4);
      } else {
        setError(data.error ?? "Failed to save details");
      }
    } catch {
      setError("Failed to save details");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;

          return (
            <div key={label} className="flex flex-1 flex-col gap-1">
              <div
                className={`h-2 rounded ${isActive ? "bg-blue-600" : "bg-gray-200"}`}
              />
              <span className="text-center text-xs text-gray-600">{label}</span>
            </div>
          );
        })}
      </div>

      {currentStep === 1 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Connect Google</h1>
          <ConnectGoogle isConnected={isGoogleConnected} />
          {googleError && (
            <p className="text-sm text-red-600">
              Google connection failed. Please try again.
            </p>
          )}
          <button
            type="button"
            disabled={!isGoogleConnected}
            onClick={() => setCurrentStep(2)}
            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Connect Canvas</h1>
          <ConnectCanvas
            isConnected={isCanvasConnected || canvasConnected}
            onSuccess={() => setCanvasConnected(true)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <form onSubmit={handleSaveDetails} className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Phone &amp; Briefing Time</h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm text-gray-600">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="briefing-time" className="text-sm text-gray-600">
              Briefing time
            </label>
            <select
              id="briefing-time"
              value={briefingTime}
              onChange={(e) => setBriefingTime(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {BRIEFING_TIMES.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Next"}
            </button>
          </div>
        </form>
      )}

      {currentStep === 4 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">You&apos;re all set</h1>
          <p className="text-gray-600">
            Iris is set up. Your first briefing arrives tomorrow morning.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded border border-gray-300 px-4 py-2 text-center text-sm hover:bg-gray-50"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
