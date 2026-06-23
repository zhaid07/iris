"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface IrisBubbleProps {
  message: string;
  messageKey: string | number;
  delayMs?: number;
  initialDelayMs?: number;
}

export default function IrisBubble({
  message,
  messageKey,
  delayMs = 0,
  initialDelayMs = 0,
}: IrisBubbleProps) {
  const [visibleText, setVisibleText] = useState("");
  const [irisState, setIrisState] = useState("iris · typing");
  const [isThinking, setIsThinking] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const fullMessageRef = useRef(message);
  const isFirstMountRef = useRef(true);

  const skipToEnd = useCallback(() => {
    if (!fullMessageRef.current) return;
    setIsThinking(false);
    setHasAppeared(true);
    setVisibleText(fullMessageRef.current);
    setShowCursor(false);
    setIrisState("iris · listening");
  }, []);

  useEffect(() => {
    fullMessageRef.current = message;
    setVisibleText("");
    setShowCursor(false);

    let thinkingTimer: ReturnType<typeof setTimeout> | undefined;
    let typeTimer: ReturnType<typeof setInterval> | undefined;

    const startTyping = () => {
      setIsThinking(false);
      setHasAppeared(true);
      setIrisState("iris · typing");
      setShowCursor(true);

      let index = 0;
      typeTimer = setInterval(() => {
        index += 1;
        setVisibleText(message.slice(0, index));
        if (index >= message.length && typeTimer) {
          clearInterval(typeTimer);
          setShowCursor(false);
          setIrisState("iris · listening");
        }
      }, 28);
    };

    const beginThinking = () => {
      setIrisState("iris · thinking");
      setIsThinking(true);
      thinkingTimer = setTimeout(startTyping, 300);
    };

    const leadIn = isFirstMountRef.current ? initialDelayMs + delayMs : delayMs;
    isFirstMountRef.current = false;

    const startTimer = setTimeout(beginThinking, leadIn);

    return () => {
      clearTimeout(startTimer);
      if (thinkingTimer) clearTimeout(thinkingTimer);
      if (typeTimer) clearInterval(typeTimer);
    };
  }, [message, messageKey, delayMs, initialDelayMs]);

  return (
    <div
      className={[
        "bubble",
        isThinking ? "is-thinking" : "",
        hasAppeared ? "is-visible" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-live="polite"
      onClick={skipToEnd}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          skipToEnd();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="bubble-label">
        <i aria-hidden="true" />
        <span>{irisState}</span>
      </div>
      <div className="thinking" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <p>
        <span>{visibleText}</span>
        {showCursor ? <span className="cursor" id="cursor" aria-hidden="true" /> : null}
      </p>
    </div>
  );
}
