"use client";

import type { ReactNode } from "react";

import IrisBubble from "@/components/onboarding/IrisBubble";
import "./onboarding-shell.css";

interface OnboardingShellProps {
  step: number;
  message: string;
  messageKey: string | number;
  messageDelayMs?: number;
  messageInitialDelayMs?: number;
  dogJump?: boolean;
  leaving?: boolean;
  children: ReactNode;
}

export default function OnboardingShell({
  step,
  message,
  messageKey,
  messageDelayMs = 0,
  messageInitialDelayMs = 0,
  dogJump = false,
  leaving = false,
  children,
}: OnboardingShellProps) {
  return (
    <main className="shell" data-step={step}>
      <div className="scene">
        <aside className="iris-zone" aria-label="Iris">
          <div className={`dog-stage${dogJump ? " jump" : ""}`} id="dog-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="dog"
              src="/iris-dog-cutout.png"
              alt="Iris, a dog wearing sunglasses"
            />
            <span className="status-dot" aria-hidden="true" />
          </div>
        </aside>

        <section className="response-zone">
          <div className="lime-orbit" aria-hidden="true" />
          <div className="response-inner">
            <IrisBubble
              message={message}
              messageKey={messageKey}
              delayMs={messageDelayMs}
              initialDelayMs={messageInitialDelayMs}
            />
            <div className="turn">reply to iris</div>
            <div className={`mount${leaving ? " leaving" : ""}`} id="mount">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
