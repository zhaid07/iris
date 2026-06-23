import type { ReactNode } from "react";

import "./onboarding-shell.css";

interface OnboardingShellProps {
  currentStep: 1 | 2 | 3 | 4;
  children: ReactNode;
}

const TOTAL_STEPS = 4;

export default function OnboardingShell({
  currentStep,
  children,
}: OnboardingShellProps) {
  return (
    <div className="onboarding-shell">
      <div className="onboarding-shell-blob" aria-hidden="true" />
      <div className="onboarding-shell-grid" aria-hidden="true" />

      <div className="onboarding-shell-inner">
        <div className="onboarding-shell-brand">
          <span className="onboarding-shell-logo-mark" aria-hidden="true">
            I
          </span>
          <span className="onboarding-shell-wordmark">Iris</span>
        </div>

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

        <div className="onboarding-shell-card">{children}</div>
      </div>
    </div>
  );
}
