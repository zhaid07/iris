import Image from "next/image";
import type { ReactNode } from "react";

import "./onboarding-shell.css";

type StepDirection = "forward" | "back";

interface OnboardingShellProps {
  currentStep: 1 | 2 | 3 | 4;
  direction?: StepDirection;
  onBack?: () => void;
  children: ReactNode;
}

const TOTAL_STEPS = 4;

export default function OnboardingShell({
  currentStep,
  direction = "forward",
  onBack,
  children,
}: OnboardingShellProps) {
  return (
    <div className="onboarding-shell">
      <div className="onboarding-shell-blob onboarding-shell-blob-1" aria-hidden="true" />
      <div className="onboarding-shell-blob onboarding-shell-blob-2" aria-hidden="true" />
      <div className="onboarding-shell-grid" aria-hidden="true" />

      <div className="onboarding-shell-inner">
        <div className="onboarding-shell-brand">
          <span className="onboarding-shell-logo-mark">
            <Image
              src="/iris-logo-tile.png"
              alt=""
              width={44}
              height={44}
              priority
            />
          </span>
          <span className="onboarding-shell-wordmark">Iris</span>
        </div>

        <div className="onboarding-shell-progress-wrap">
          <div
            className="onboarding-shell-progress"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-valuenow={currentStep}
            aria-label={`Step ${currentStep} of ${TOTAL_STEPS}`}
          >
            {Array.from({ length: TOTAL_STEPS }, (_, index) => {
              const step = index + 1;
              const isActive = step === currentStep;
              const isComplete = step < currentStep;

              return (
                <span
                  key={step}
                  className={[
                    "onboarding-shell-dot",
                    isActive ? "is-active" : "",
                    isComplete ? "is-complete" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              );
            })}
          </div>
          <span className="onboarding-shell-step-count">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>

        <div className="onboarding-shell-card">
          {onBack ? (
            <button
              type="button"
              className="onboarding-shell-back"
              onClick={onBack}
              aria-label="Go back"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : null}

          <div
            key={currentStep}
            className={`onboarding-shell-stage onboarding-shell-stage--${direction}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
