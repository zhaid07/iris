"use client";

import Image from "next/image";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import ExtensionWalkthrough from "@/components/onboarding/ExtensionWalkthrough";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import {
  BRIEFING_PRESETS,
  getDogMessage,
  MAJORS,
  shouldShowFearStep,
  STRESSORS,
  TONE_OPTIONS,
  type IrisTone,
  type Major,
  type StressorId,
} from "@/components/onboarding/constants";

interface OnboardingFlowProps {
  irisUserId: string;
  defaultName?: string;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface OnboardingData {
  displayName: string;
  major: Major | "";
  stressors: StressorId[];
  irisTone: IrisTone | "";
  contextBio: string;
  fearContext: string;
  briefingTime: string;
  briefingCustom: boolean;
}

export default function OnboardingFlow({
  irisUserId,
  defaultName = "",
}: OnboardingFlowProps) {
  const router = useRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<OnboardingData>({
    displayName: defaultName,
    major: "",
    stressors: [],
    irisTone: "",
    contextBio: "",
    fearContext: "",
    briefingTime: "08:00",
    briefingCustom: false,
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dogMessage = getDogMessage(step, {
    displayName: data.displayName,
    stressors: data.stressors,
  });

  const saveProgress = useCallback(async (patch: Record<string, unknown>) => {
    const res = await fetch("/api/onboarding/save-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error ?? "Failed to save");
    }
  }, []);

  const goNext = useCallback(
    async (patch: Record<string, unknown>, nextStep: Step) => {
      setLoading(true);
      setError(null);
      try {
        await saveProgress(patch);
        setStep(nextStep);
      } catch {
        setError("Something went wrong saving your answers. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [saveProgress],
  );

  function nextAfterPersonalization() {
    const patch = { contextBio: data.contextBio.trim() };
    if (shouldShowFearStep(data.stressors)) {
      goNext(patch, 6);
    } else {
      goNext(patch, 7);
    }
  }

  useEffect(() => {
    if (step === 1) {
      nameInputRef.current?.focus();
    }
  }, [step]);

  async function handleCopyUserId() {
    try {
      await navigator.clipboard.writeText(irisUserId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy User ID");
    }
  }

  async function handleComplete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/complete", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error ?? "Failed to complete onboarding");
      }
    } catch {
      setError("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  }

  function toggleStressor(id: StressorId) {
    setData((prev) => {
      const has = prev.stressors.includes(id);
      const next = has
        ? prev.stressors.filter((s) => s !== id)
        : [...prev.stressors, id];
      return { ...prev, stressors: next };
    });
  }

  function handleNameSubmit(e: FormEvent) {
    e.preventDefault();
    const name = data.displayName.trim();
    if (!name) return;
    goNext({ displayName: name }, 2);
  }

  return (
    <OnboardingShell
      message={dogMessage.text}
      messageKey={`${step}-${dogMessage.text}`}
      messageDelayMs={dogMessage.delayMs}
      celebrate={step === 9}
    >
      {step === 1 && (
        <form onSubmit={handleNameSubmit} className="ob-step">
          <input
            ref={nameInputRef}
            type="text"
            value={data.displayName}
            onChange={(e) =>
              setData((prev) => ({ ...prev, displayName: e.target.value }))
            }
            className="ob-input"
            placeholder="your name"
            autoComplete="given-name"
            required
          />
          {error && <p className="ob-error">{error}</p>}
          <button type="submit" className="ob-btn" disabled={loading}>
            continue
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="ob-step">
          <div className="ob-pills">
            {MAJORS.map((major) => (
              <button
                key={major}
                type="button"
                className={`ob-pill${data.major === major ? " is-selected" : ""}`}
                disabled={loading}
                onClick={() => {
                  setData((prev) => ({ ...prev, major }));
                  goNext({ major }, 3);
                }}
              >
                {major}
              </button>
            ))}
          </div>
          {error && <p className="ob-error">{error}</p>}
        </div>
      )}

      {step === 3 && (
        <div className="ob-step">
          <div className="ob-pills">
            {STRESSORS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`ob-pill${data.stressors.includes(s.id) ? " is-selected" : ""}`}
                onClick={() => toggleStressor(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          {error && <p className="ob-error">{error}</p>}
          <button
            type="button"
            className="ob-btn"
            disabled={loading || data.stressors.length === 0}
            onClick={() =>
              goNext({ onboardingStressors: data.stressors }, 4)
            }
          >
            continue
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="ob-step">
          <div className="ob-tone-cards">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone.id}
                type="button"
                className={`ob-tone-card${data.irisTone === tone.id ? " is-selected" : ""}`}
                disabled={loading}
                onClick={() => {
                  setData((prev) => ({ ...prev, irisTone: tone.id }));
                  goNext({ irisTone: tone.id }, 5);
                }}
              >
                <span className="ob-tone-card-label">{tone.label}</span>
                <div className="ob-tone-card-title">{tone.title}</div>
                <div className="ob-tone-card-desc">{tone.description}</div>
                <div className="ob-tone-card-sample">{tone.sample}</div>
              </button>
            ))}
          </div>
          {error && <p className="ob-error">{error}</p>}
        </div>
      )}

      {step === 5 && (
        <div className="ob-step">
          <textarea
            value={data.contextBio}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                contextBio: e.target.value.slice(0, 250),
              }))
            }
            className="ob-textarea"
            placeholder="e.g. junior, two part-time jobs, trying to raise GPA before grad school apps..."
            maxLength={250}
          />
          <span className="ob-char-count">{data.contextBio.length}/250</span>
          <p className="ob-note">
            goes directly into how iris thinks. not a profile. actual context.
          </p>
          {error && <p className="ob-error">{error}</p>}
          <button
            type="button"
            className="ob-btn"
            disabled={loading || !data.contextBio.trim()}
            onClick={nextAfterPersonalization}
          >
            continue
          </button>
        </div>
      )}

      {step === 6 && (
        <div className="ob-step">
          <textarea
            value={data.fearContext}
            onChange={(e) =>
              setData((prev) => ({ ...prev, fearContext: e.target.value }))
            }
            className="ob-textarea"
            placeholder="e.g. graduating without a job. nobody talks about how real that is..."
          />
          <p className="ob-note">
            anything u write here directly shapes how iris thinks and what it
            watches out for — for u specifically.
          </p>
          {error && <p className="ob-error">{error}</p>}
          <button
            type="button"
            className="ob-btn"
            disabled={loading}
            onClick={() =>
              goNext(
                { fearContext: data.fearContext.trim() || null },
                7,
              )
            }
          >
            continue
          </button>
          <button
            type="button"
            className="ob-link"
            disabled={loading}
            onClick={() => goNext({ fearContext: null }, 7)}
          >
            skip
          </button>
        </div>
      )}

      {step === 7 && (
        <div className="ob-step">
          <div className="ob-pills">
            {BRIEFING_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={`ob-pill${
                  !data.briefingCustom && data.briefingTime === preset.value
                    ? " is-selected"
                    : ""
                }`}
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    briefingTime: preset.value,
                    briefingCustom: false,
                  }))
                }
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              className={`ob-pill${data.briefingCustom ? " is-selected" : ""}`}
              onClick={() =>
                setData((prev) => ({ ...prev, briefingCustom: true }))
              }
            >
              custom
            </button>
          </div>
          {data.briefingCustom && (
            <div className="ob-custom-time">
              <input
                type="time"
                value={data.briefingTime}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    briefingTime: e.target.value,
                  }))
                }
              />
            </div>
          )}
          {error && <p className="ob-error">{error}</p>}
          <button
            type="button"
            className="ob-btn"
            disabled={loading}
            onClick={() => goNext({ briefingTime: data.briefingTime }, 8)}
          >
            continue
          </button>
        </div>
      )}

      {step === 8 && (
        <div className="ob-step">
          <ExtensionWalkthrough
            userId={irisUserId}
            copied={copied}
            onCopy={handleCopyUserId}
          />
          <a href="#" className="ob-text-link">
            Open Chrome Web Store →
          </a>
          {error && <p className="ob-error">{error}</p>}
          <button
            type="button"
            className="ob-btn"
            disabled={loading}
            onClick={() => setStep(9)}
          >
            done, it&apos;s installed →
          </button>
        </div>
      )}

      {step === 9 && (
        <div className="ob-step">
          <div className="ob-imessage">
            <div className="ob-imessage-meta">
              <span className="ob-imessage-avatar">
                <Image
                  src="/iris-logo-tile.png"
                  alt=""
                  width={28}
                  height={28}
                />
              </span>
              Iris
            </div>
            <div className="ob-imessage-bubble">
              good morning. u have math hw due at 11pm, a quiz friday, and ur
              advisor finally replied. u have time. let&apos;s not waste it.
            </div>
          </div>
          {error && <p className="ob-error">{error}</p>}
          <button
            type="button"
            className="ob-btn"
            disabled={loading}
            onClick={handleComplete}
          >
            {loading ? "..." : "let's go →"}
          </button>
        </div>
      )}
    </OnboardingShell>
  );
}
