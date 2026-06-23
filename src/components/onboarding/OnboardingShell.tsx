import type { ReactNode } from "react";

import IrisMascot from "@/components/onboarding/IrisMascot";
import "./onboarding-shell.css";

interface OnboardingShellProps {
  message: string;
  messageKey: string | number;
  messageDelayMs?: number;
  celebrate?: boolean;
  children: ReactNode;
}

export default function OnboardingShell({
  message,
  messageKey,
  messageDelayMs = 0,
  celebrate = false,
  children,
}: OnboardingShellProps) {
  return (
    <div className="onboarding-shell">
      <div className="onboarding-shell-blob" aria-hidden="true" />
      <div className="onboarding-shell-grid" aria-hidden="true" />

      <div className="onboarding-shell-stage">
        <div key={messageKey} className="onboarding-shell-response">
          {children}
        </div>
      </div>

      <IrisMascot
        message={message}
        messageKey={messageKey}
        delayMs={messageDelayMs}
        celebrate={celebrate}
      />
    </div>
  );
}
