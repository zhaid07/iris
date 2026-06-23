"use client";

import { useEffect, useState } from "react";

interface ExtensionWalkthroughProps {
  userId: string;
  copied: boolean;
  onCopy: () => void;
}

const STEPS = (userId: string) =>
  [
    {
      title: "click extensions",
      render: () => (
        <svg viewBox="0 0 280 56" className="ext-walk-svg" aria-hidden="true">
          <rect x="0" y="8" width="280" height="40" rx="8" fill="#f5f5f7" stroke="rgba(0,0,0,.08)" />
          <rect x="12" y="18" width="120" height="20" rx="4" fill="#e8e8ed" />
          <g className="ext-walk-pulse">
            <rect x="200" y="16" width="24" height="24" rx="6" fill="var(--iris-accent-soft)" stroke="var(--iris-accent)" strokeWidth="1.5" />
            <path d="M208 22h8M212 18v8" stroke="var(--iris-accent)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      ),
    },
    {
      title: "find Iris, click add",
      render: () => (
        <svg viewBox="0 0 280 120" className="ext-walk-svg" aria-hidden="true">
          <rect x="160" y="0" width="120" height="120" rx="10" fill="#fff" stroke="rgba(0,0,0,.08)" />
          <rect x="172" y="12" width="96" height="28" rx="6" fill="var(--iris-accent-soft)" stroke="var(--iris-accent)" strokeWidth="1.5" />
          <circle cx="186" cy="26" r="8" fill="#fff" />
          <text x="200" y="30" fontSize="10" fill="var(--iris-ink)" fontFamily="Inter,sans-serif">Iris</text>
          <rect x="172" y="48" width="96" height="22" rx="6" fill="#f5f5f7" />
          <rect x="172" y="78" width="96" height="22" rx="6" fill="#f5f5f7" />
        </svg>
      ),
    },
    {
      title: "paste ur ID",
      render: () => (
        <div className="ext-walk-paste">
          <div className="ext-walk-paste-card">
            <span className="ext-walk-paste-label">Your User ID</span>
            <code>{userId.slice(0, 8)}…</code>
          </div>
          <span className="ext-walk-arrow" aria-hidden="true">
            ↓
          </span>
        </div>
      ),
    },
  ] as const;

export default function ExtensionWalkthrough({
  userId,
  copied,
  onCopy,
}: ExtensionWalkthroughProps) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = STEPS(userId);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="ext-walk">
      <div className="ext-walk-visual">
        {steps[activeStep].render()}
        <p className="ext-walk-caption">{steps[activeStep].title}</p>
      </div>

      <div className="ext-walk-dots">
        {steps.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`ext-walk-dot${index === activeStep ? " is-active" : ""}`}
            onClick={() => setActiveStep(index)}
            aria-label={`Show step ${index + 1}`}
          />
        ))}
      </div>

      <div className={`ext-walk-copy-card${copied ? " is-copied" : ""}`}>
        <span className="ext-walk-copy-label">Your User ID</span>
        <div className="ext-walk-copy-row">
          <code className="ext-walk-copy-value">{userId}</code>
          <button
            type="button"
            className={`ext-walk-copy-btn${copied ? " is-copied" : ""}`}
            onClick={onCopy}
          >
            {copied ? "copied ✓" : "copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
