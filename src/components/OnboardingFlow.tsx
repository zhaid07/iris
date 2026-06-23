"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import OnboardingShell from "@/components/onboarding/OnboardingShell";

interface OnboardingFlowProps {
  irisUserId: string;
}

type Step = 1 | 2 | 3 | 4;
type StepDirection = "forward" | "back";

export default function OnboardingFlow({ irisUserId }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [direction, setDirection] = useState<StepDirection>("forward");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goTo(step: Step) {
    setError(null);
    setDirection(step > currentStep ? "forward" : "back");
    setCurrentStep(step);
  }

  function handleBack() {
    if (currentStep > 1) {
      goTo((currentStep - 1) as Step);
    }
  }

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
        goTo(4);
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
    <OnboardingShell
      currentStep={currentStep}
      direction={direction}
      onBack={currentStep > 1 ? handleBack : undefined}
    >
      {currentStep === 1 && (
        <div className="onboarding-step">
          <span className="onboarding-step-icon" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 3v4" />
              <path d="M3 5h4" />
              <path d="M17 17v4" />
              <path d="M15 19h4" />
              <path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8L12 3z" />
            </svg>
          </span>
          <div className="onboarding-step-heading">
            <h1 className="onboarding-step-title">Welcome to Iris</h1>
            <p className="onboarding-step-body">
              You&apos;re 3 steps away from your first daily briefing.
            </p>
          </div>
          <div className="onboarding-actions">
            <button
              type="button"
              className="onboarding-btn"
              onClick={() => goTo(2)}
            >
              Get started
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="onboarding-step">
          <span className="onboarding-step-icon" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 7h6a1 1 0 0 1 1 1v6" />
              <path d="M21 14a3 3 0 1 1-3 3" />
              <path d="M10 7H4a1 1 0 0 0-1 1v6a3 3 0 1 0 3 3" />
              <path d="M10 4a2 2 0 1 1 4 0v6h-4V4z" />
            </svg>
          </span>
          <div className="onboarding-step-heading">
            <h1 className="onboarding-step-title">Connect your Canvas</h1>
            <p className="onboarding-step-body">
              Install the Chrome extension and enter the User ID below when
              prompted.
            </p>
          </div>

          <div className="onboarding-user-id-card">
            <span className="onboarding-user-id-label">Your User ID</span>
            <div className="onboarding-user-id-row">
              <span className="onboarding-user-id-value">{irisUserId}</span>
              <button
                type="button"
                className={`onboarding-copy-btn${copied ? " is-copied" : ""}`}
                onClick={handleCopyUserId}
              >
                {copied ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
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
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <a href="#" className="onboarding-link">
            Install extension
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </a>

          <div className="onboarding-actions">
            <button
              type="button"
              className="onboarding-btn"
              onClick={() => goTo(3)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <form onSubmit={handleSaveDetails} className="onboarding-step">
          <span className="onboarding-step-icon" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.5 3h9a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3z" />
              <path d="M11 18h2" />
            </svg>
          </span>
          <div className="onboarding-step-heading">
            <h1 className="onboarding-step-title">Where should we text you?</h1>
            <p className="onboarding-step-body">
              Your daily briefing arrives each morning as a text.
            </p>
          </div>

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

          <div className="onboarding-actions">
            <button type="submit" className="onboarding-btn" disabled={loading}>
              {loading ? "Saving..." : "Save & continue"}
            </button>
            <button
              type="button"
              className="onboarding-skip"
              onClick={() => goTo(4)}
            >
              Skip for now
            </button>
          </div>
        </form>
      )}

      {currentStep === 4 && (
        <div className="onboarding-step">
          <span className="onboarding-step-icon" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 12a9.5 9.5 0 1 1-4.3-7.95" />
              <path d="M9 11.5l3 3L22 5" />
            </svg>
          </span>
          <div className="onboarding-step-heading">
            <h1 className="onboarding-step-title">You&apos;re all set</h1>
            <p className="onboarding-step-body">
              Iris will text you every morning with what&apos;s due and
              what&apos;s coming up.
            </p>
          </div>

          <div className="onboarding-sample">
            <div className="onboarding-sample-meta">
              <span className="onboarding-sample-avatar">
                <Image
                  src="/iris-logo-tile.png"
                  alt=""
                  width={22}
                  height={22}
                />
              </span>
              Iris · 8:00 AM
            </div>
            <div className="onboarding-sample-bubble">
              Good morning! Math 23B homework is due tonight. Your CS midterm is
              in 3 days.
            </div>
          </div>

          {error && <p className="onboarding-error">{error}</p>}

          <div className="onboarding-actions">
            <button
              type="button"
              className="onboarding-btn"
              onClick={handleComplete}
              disabled={loading}
            >
              {loading ? "Finishing..." : "Go to dashboard"}
            </button>
          </div>
        </div>
      )}
    </OnboardingShell>
  );
}
