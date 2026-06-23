"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import OnboardingShell from "@/components/onboarding/OnboardingShell";
import {
  BRIEFING_OPTIONS,
  briefingChoiceToTime,
  getDogMessage,
  MAJORS,
  shouldShowFearStep,
  STRESSOR_GROUPS,
  stressorSelectionHint,
  TONE_OPTIONS,
  WALKTHROUGH_STEPS,
  type BriefingChoice,
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
  briefingChoice: BriefingChoice | "";
  customBriefingTime: string;
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
    briefingChoice: "",
    customBriefingTime: "08:00",
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dogJump, setDogJump] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [finishLabel, setFinishLabel] = useState("let's go →");

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
      setLeaving(true);

      try {
        await saveProgress(patch);
        window.setTimeout(() => {
          setStep(nextStep);
          setLeaving(false);
          setLoading(false);
        }, 230);
      } catch {
        setLeaving(false);
        setLoading(false);
        setError("Something went wrong saving your answers. Try again.");
      }
    },
    [saveProgress],
  );

  const advanceLocal = useCallback((nextStep: Step) => {
    setLeaving(true);
    window.setTimeout(() => {
      setStep(nextStep);
      setLeaving(false);
    }, 230);
  }, []);

  useEffect(() => {
    if (step === 1) {
      window.setTimeout(() => nameInputRef.current?.focus(), 500);
    }
  }, [step]);

  useEffect(() => {
    if (step !== 9) return;

    setDogJump(true);
    const timer = window.setTimeout(() => setDogJump(false), 800);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step !== 8) return;

    const timer = window.setInterval(() => {
      setWalkthroughStep((prev) => (prev + 1) % WALKTHROUGH_STEPS.length);
    }, 2500);

    return () => window.clearInterval(timer);
  }, [step]);

  async function handleCopyUserId() {
    try {
      await navigator.clipboard.writeText(irisUserId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy User ID");
    }
  }

  async function handleComplete() {
    setLoading(true);
    setError(null);
    setFinishLabel("locked in ✓");
    setDogJump(false);
    window.requestAnimationFrame(() => {
      setDogJump(true);
      window.setTimeout(() => setDogJump(false), 800);
    });

    try {
      const res = await fetch("/api/onboarding/complete", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        router.push("/dashboard");
      } else {
        setFinishLabel("let's go →");
        setError(result.error ?? "Failed to complete onboarding");
      }
    } catch {
      setFinishLabel("let's go →");
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

  function nextAfterPersonalization() {
    const patch = { contextBio: data.contextBio.trim() };
    if (shouldShowFearStep(data.stressors)) {
      goNext(patch, 6);
    } else {
      goNext(patch, 7);
    }
  }

  function handleNameSubmit(event: FormEvent) {
    event.preventDefault();
    const name = data.displayName.trim();
    if (!name) return;
    goNext({ displayName: name }, 2);
  }

  const walkthrough = WALKTHROUGH_STEPS[walkthroughStep];

  return (
    <OnboardingShell
      step={step}
      message={dogMessage.text}
      messageKey={`${step}-${dogMessage.text}`}
      messageDelayMs={dogMessage.delayMs}
      messageInitialDelayMs={dogMessage.initialDelayMs}
      dogJump={dogJump}
      leaving={leaving}
    >
      {step === 1 && (
        <>
          <h1 className="title">first, the important part.</h1>
          <p className="sub">
            What should Iris call you when she catches something before it
            becomes a tiny academic disaster?
          </p>
          <form className="field-row" onSubmit={handleNameSubmit}>
            <input
              ref={nameInputRef}
              className="line-input"
              maxLength={32}
              autoComplete="name"
              placeholder="your name"
              aria-label="Your name"
              value={data.displayName}
              onChange={(event) =>
                setData((prev) => ({
                  ...prev,
                  displayName: event.target.value,
                }))
              }
            />
            <button
              type="submit"
              className="go"
              disabled={loading || !data.displayName.trim()}
              aria-label="Continue"
            >
              →
            </button>
          </form>
          {error && <p className="ob-error">{error}</p>}
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="title">pick the closest thing.</h1>
          <p className="sub">
            This changes what Iris pays attention to. You can clean it up later.
          </p>
          <div className="pills">
            {MAJORS.map((major) => (
              <button
                key={major}
                type="button"
                className={`pill${data.major === major ? " selected" : ""}`}
                disabled={loading}
                onClick={() => {
                  setData((prev) => ({ ...prev, major }));
                  window.setTimeout(() => goNext({ major }, 3), 220);
                }}
              >
                {major}
              </button>
            ))}
          </div>
          {error && <p className="ob-error">{error}</p>}
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="title">give the algorithm a clean signal.</h1>
          <p className="sub">
            Choose the fewest options that feel true. One or two strong signals
            help Iris message you less, prioritize better, and focus on what
            actually matters.
          </p>
          <div className="stressor-groups">
            {STRESSOR_GROUPS.map((group) => (
              <section key={group.label} className="stressor-group">
                <div className="stressor-label">{group.label}</div>
                <div className="pills">
                  {group.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`pill${
                        data.stressors.includes(option.id) ? " selected" : ""
                      }`}
                      onClick={() => toggleStressor(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="actions">
            <span className="selection-count">
              {stressorSelectionHint(data.stressors.length)}
            </span>
            <button
              type="button"
              className="primary"
              disabled={loading || data.stressors.length === 0}
              onClick={() =>
                goNext({ onboardingStressors: data.stressors }, 4)
              }
            >
              that&apos;s the real problem →
            </button>
          </div>
          {error && <p className="ob-error">{error}</p>}
        </>
      )}

      {step === 4 && (
        <>
          <h1 className="title">how human should iris sound?</h1>
          <p className="sub">
            The algorithm stays the same. This only changes how Iris delivers
            the message. You can switch it later.
          </p>
          <div className="tone-list">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone.id}
                type="button"
                className="tone"
                disabled={loading}
                style={
                  data.irisTone === tone.id
                    ? { background: "var(--iris-accent-soft)" }
                    : undefined
                }
                onClick={() => {
                  setData((prev) => ({ ...prev, irisTone: tone.id }));
                  window.setTimeout(
                    () => goNext({ irisTone: tone.id }, 5),
                    260,
                  );
                }}
              >
                <span className="tone-name">{tone.label}</span>
                <span>
                  <strong>{tone.title}</strong>
                  <small>{tone.description}</small>
                </span>
                <span className="sample">&ldquo;{tone.sample}&rdquo;</span>
              </button>
            ))}
          </div>
          {error && <p className="ob-error">{error}</p>}
        </>
      )}

      {step === 5 && (
        <>
          <h1 className="title">give Iris the context apps usually miss.</h1>
          <div className="textarea-wrap">
            <textarea
              id="bio"
              maxLength={250}
              placeholder="e.g. junior, two part-time jobs, trying to raise GPA before grad school apps..."
              value={data.contextBio}
              onChange={(event) =>
                setData((prev) => ({
                  ...prev,
                  contextBio: event.target.value.slice(0, 250),
                }))
              }
            />
            <span className="counter">{data.contextBio.length}/250</span>
          </div>
          <p className="note">
            goes directly into how iris thinks. not a profile. actual context.
          </p>
          <div className="actions">
            <span />
            <button
              type="button"
              className="primary"
              disabled={loading}
              onClick={nextAfterPersonalization}
            >
              continue →
            </button>
          </div>
          {error && <p className="ob-error">{error}</p>}
        </>
      )}

      {step === 6 && (
        <>
          <h1 className="title">the thing underneath the thing.</h1>
          <div className="textarea-wrap">
            <textarea
              id="fear"
              placeholder="e.g. graduating without a job. nobody talks about how real that is..."
              value={data.fearContext}
              onChange={(event) =>
                setData((prev) => ({
                  ...prev,
                  fearContext: event.target.value,
                }))
              }
            />
          </div>
          <p className="note">
            anything u write here directly shapes how iris thinks and what it
            watches out for. this context is used for u specifically.
          </p>
          <div className="actions">
            <button
              type="button"
              className="quiet"
              disabled={loading}
              onClick={() => goNext({ fearContext: null }, 7)}
            >
              skip this
            </button>
            <button
              type="button"
              className="primary"
              disabled={loading}
              onClick={() =>
                goNext(
                  {
                    fearContext: data.fearContext.trim() || null,
                  },
                  7,
                )
              }
            >
              continue →
            </button>
          </div>
          {error && <p className="ob-error">{error}</p>}
        </>
      )}

      {step === 7 && (
        <>
          <h1 className="title">how early can Iris bother you?</h1>
          <p className="sub">
            One useful briefing. No inspirational quote. No &ldquo;rise and
            grind.&rdquo;
          </p>
          <div className="time-grid">
            {BRIEFING_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`time${
                  data.briefingChoice === option.id ? " selected" : ""
                }`}
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    briefingChoice: option.id,
                  }))
                }
              >
                <span>{option.label}</span>
                <small>{option.subtitle}</small>
              </button>
            ))}
          </div>
          <div
            className={`custom-time${
              data.briefingChoice === "custom" ? " visible" : ""
            }`}
          >
            <input
              type="time"
              aria-label="Custom briefing time"
              value={data.customBriefingTime}
              onChange={(event) =>
                setData((prev) => ({
                  ...prev,
                  customBriefingTime: event.target.value,
                }))
              }
            />
          </div>
          <div className="actions">
            <span className="selection-count">pick a time</span>
            <button
              type="button"
              className="primary"
              disabled={loading || !data.briefingChoice}
              onClick={() =>
                goNext(
                  {
                    briefingTime: briefingChoiceToTime(
                      data.briefingChoice as BriefingChoice,
                      data.customBriefingTime,
                    ),
                  },
                  8,
                )
              }
            >
              set briefing →
            </button>
          </div>
          {error && <p className="ob-error">{error}</p>}
        </>
      )}

      {step === 8 && (
        <>
          <h1 className="title">give the dog eyes. securely.</h1>
          <p className="sub">
            Your private ID links the extension to your Iris account. Iris only
            reads the Canvas context needed to find deadlines, changes, and
            conflicts. It cannot post, submit, or change your coursework.
          </p>
          <div className="walkthrough">
            <div className="browser">
              <div className="browser-top">
                <i aria-hidden="true" />
                <i aria-hidden="true" />
                <i aria-hidden="true" />
                <div className="address" />
                <span className="puzzle">⌘</span>
              </div>
              <div className="browser-body">
                <div className="visual">
                  <div className="visual-icon">{walkthrough.icon}</div>
                  <strong>{walkthrough.title}</strong>
                  <p>{walkthrough.description}</p>
                </div>
              </div>
            </div>
            <div className="walk-tabs">
              {WALKTHROUGH_STEPS.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  className={`walk-tab${
                    walkthroughStep === index ? " active" : ""
                  }`}
                  onClick={() => setWalkthroughStep(index)}
                >
                  {index + 1} · {item.title}
                </button>
              ))}
            </div>
            <div className="uuid-row">
              <code>{irisUserId}</code>
              <button
                type="button"
                className={`copy${copied ? " copied" : ""}`}
                onClick={handleCopyUserId}
              >
                {copied ? "copied ✓" : "copy ID"}
              </button>
            </div>
            <div className="install-actions">
              <a
                className="primary"
                href="#"
                onClick={(event) => event.preventDefault()}
              >
                open Chrome Web Store ↗
              </a>
              <button
                type="button"
                className="quiet"
                disabled={loading}
                onClick={() => advanceLocal(9)}
              >
                done, it&apos;s installed →
              </button>
            </div>
          </div>
          {error && <p className="ob-error">{error}</p>}
        </>
      )}

      {step === 9 && (
        <>
          <h1 className="title">your life now has a watchdog.</h1>
          <p className="sub">Tomorrow morning looks a little more like this:</p>
          <div className="imessage">
            good morning. u have math hw due at 11pm, a quiz friday, and ur
            advisor finally replied. u have time. let&apos;s not waste it.
          </div>
          <div className="done-meta">iris · delivered</div>
          <div className="actions">
            <span className="locked">● setup complete</span>
            <button
              type="button"
              className="primary"
              id="finish"
              disabled={loading}
              onClick={handleComplete}
            >
              {loading ? "..." : finishLabel}
            </button>
          </div>
          {error && <p className="ob-error">{error}</p>}
        </>
      )}
    </OnboardingShell>
  );
}
