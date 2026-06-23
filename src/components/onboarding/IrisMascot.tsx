"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface IrisMascotProps {
  message: string;
  messageKey: string | number;
  delayMs?: number;
  celebrate?: boolean;
}

export default function IrisMascot({
  message,
  messageKey,
  delayMs = 0,
  celebrate = false,
}: IrisMascotProps) {
  const [visibleText, setVisibleText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(delayMs === 0);
  const [isPending, setIsPending] = useState(delayMs > 0);
  const [shouldJump, setShouldJump] = useState(false);

  useEffect(() => {
    setVisibleText("");
    setBubbleVisible(delayMs === 0);
    setIsPending(delayMs > 0);
    setShouldJump(false);

    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    let typeTimer: ReturnType<typeof setInterval> | undefined;

    const startTyping = () => {
      setIsPending(false);
      setBubbleVisible(true);
      let index = 0;
      typeTimer = setInterval(() => {
        index += 1;
        setVisibleText(message.slice(0, index));
        if (index >= message.length && typeTimer) {
          clearInterval(typeTimer);
        }
      }, 20);
    };

    if (delayMs > 0) {
      delayTimer = setTimeout(startTyping, delayMs);
    } else {
      startTyping();
    }

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      if (typeTimer) clearInterval(typeTimer);
    };
  }, [message, messageKey, delayMs]);

  useEffect(() => {
    if (!celebrate) return;
    const jumpTimer = setTimeout(() => setShouldJump(true), 100);
    return () => clearTimeout(jumpTimer);
  }, [celebrate, messageKey]);

  return (
    <div className={`iris-mascot${celebrate ? " iris-mascot--celebrate" : ""}`}>
      <div
        className={[
          "iris-mascot-bubble",
          bubbleVisible ? "is-visible" : "",
          isPending ? "is-pending" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-live="polite"
      >
        {isPending ? (
          <span className="iris-mascot-pause" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <p>
            {visibleText}
            {bubbleVisible && visibleText.length < message.length ? (
              <span className="iris-mascot-cursor" aria-hidden="true" />
            ) : null}
          </p>
        )}
      </div>
      <div
        className={`iris-mascot-dog-wrap${shouldJump ? " is-jumping" : ""}`}
      >
        <Image
          src="/iris-mascot.png"
          alt="Iris"
          width={200}
          height={200}
          className="iris-mascot-dog"
          priority
        />
      </div>
    </div>
  );
}
