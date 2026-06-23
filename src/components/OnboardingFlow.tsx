"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import OnboardingShell from "@/components/onboarding/OnboardingShell";

interface OnboardingFlowProps {
  irisUserId: string;
}

export default function OnboardingFlow({ irisUserId }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCopyUserId() {
    try {
      await navigator.clipboard.writeText(irisUserId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy User ID");
    }
  }

  async function handleSaveDetails(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/save-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, briefingTime: "08:00" }),
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

  async function handleComplete() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error ?? "Failed to complete onboarding");
      }
    } catch {
      setError("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell currentStep={currentStep}>
      {currentStep === 1 && (
        <div className="onboarding-step">
          <h1 className="onboarding-step-title">Welcome to Iris</h1>
          <p className="onboarding-step-body">
            You&apos;re 3 steps away from your first daily briefing.
          </p>
          <button
            type="button"
            className="onboarding-btn"
            onClick={() => setCurrentStep(2)}
          >
            Get started
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="onboarding-step">
          <h1 className="onboarding-step-title">Connect your Canvas</h1>
          <p className="onboarding-step-body">
            Install the Chrome extension and enter the User ID below when
            prompted.
          </p>

          <div className="onboarding-user-id-card">
            <span className="onboarding-user-id-label">Your User ID</span>
            <div className="onboarding-user-id-row">
              <span className="onboarding-user-id-value">{irisUserId}</span>
              <button
                type="button"
                className="onboarding-copy-btn"
                onClick={handleCopyUserId}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <a href="#" className="onboarding-link">
            Install extension →
          </a>

          <button
            type="button"
            className="onboarding-btn"
            onClick={() => setCurrentStep(3)}
          >
            Continue
          </button>
        </div>
      )}

      {currentStep === 3 && (
        <form onSubmit={handleSaveDetails} className="onboarding-step">
          <h1 className="onboarding-step-title">Where should we text you?</h1>
          <p className="onboarding-step-body">
            Your daily briefing arrives each morning as a text.
          </p>

          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="onboarding-input"
            placeholder="(555) 555-5555"
            required
          />

          {error && <p className="onboarding-error">{error}</p>}

          <button type="submit" className="onboarding-btn" disabled={loading}>
            {loading ? "Saving..." : "Save & continue"}
          </button>

          <button
            type="button"
            className="onboarding-skip"
            onClick={() => {
              setError(null);
              setCurrentStep(4);
            }}
          >
            Skip for now
          </button>
        </form>
      )}

      {currentStep === 4 && (
        <div className="onboarding-step">
          <h1 className="onboarding-step-title">You&apos;re all set</h1>
          <p className="onboarding-step-body">
            Iris will text you every morning with what&apos;s due and
            what&apos;s coming up.
          </p>

          <div className="onboarding-sample-bubble">
            Good morning! Math 23B homework is due tonight. Your CS midterm is
            in 3 days.
          </div>

          {error && <p className="onboarding-error">{error}</p>}

          <button
            type="button"
            className="onboarding-btn"
            onClick={handleComplete}
            disabled={loading}
          >
            {loading ? "Finishing..." : "Go to dashboard"}
          </button>
        </div>
      )}
    </OnboardingShell>
  );
}
