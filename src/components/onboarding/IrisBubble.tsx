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
  const [irisState, setIrisState] = useState("iris · thinking");
  const [isThinking, setIsThinking] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const fullMessageRef = useRef(message);

  const skipToEnd = useCallback(() => {
    setIsThinking(false);
    setIsReady(true);
    setVisibleText(fullMessageRef.current);
    setShowCursor(false);
    setIrisState("iris · listening");
  }, []);

  useEffect(() => {
    fullMessageRef.current = message;
    setVisibleText("");
    setIsThinking(true);
    setIsReady(false);
    setShowCursor(false);
    setIrisState("iris · thinking");

    let thinkingTimer: ReturnType<typeof setTimeout> | undefined;
    let typeTimer: ReturnType<typeof setInterval> | undefined;

    const startTyping = () => {
      setIsThinking(false);
      setIsReady(true);
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

    const leadIn = initialDelayMs + delayMs;
    const startTimer = setTimeout(() => {
      thinkingTimer = setTimeout(startTyping, 300);
    }, leadIn);

    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (thinkingTimer) clearTimeout(thinkingTimer);
      if (typeTimer) clearInterval(typeTimer);
    };
  }, [message, messageKey, delayMs, initialDelayMs]);

  return (
    <div
      className={`bubble${isThinking ? " is-thinking" : ""}${isReady ? " is-ready" : ""}`}
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
        {showCursor ? <span className="cursor" aria-hidden="true" /> : null}
      </p>
    </div>
  );
}
