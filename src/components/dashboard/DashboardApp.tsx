"use client";

import { useClerk } from "@clerk/nextjs";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  BRIEFING_TIME_OPTIONS,
  briefingLabelToValue,
  formatBriefingTime,
  getDebriefItems,
  getInitials,
  SUGGESTIONS,
  type DebriefItem,
} from "@/components/dashboard/constants";
import {
  MAJORS,
  STRESSOR_GROUPS,
  type StressorId,
} from "@/components/onboarding/constants";
import "./dashboard-shell.css";

type View = "iris" | "integrations" | "settings";

interface DashboardAppProps {
  displayName: string;
  major: string;
  irisTone: string;
  contextBio: string;
  fearContext: string;
  briefingTime: string;
  stressors: StressorId[];
  briefing: {
    content: string;
    created_at: string;
    raw_data?: unknown;
  } | null;
  isGoogleConnected: boolean;
  isCanvasConnected: boolean;
  irisUserId: string;
}

const TOTAL_SOURCES = 6;

function stressorIdFromLabel(label: string): StressorId | null {
  for (const group of STRESSOR_GROUPS) {
    const match = group.options.find((option) => option.label === label);
    if (match) return match.id;
  }
  return null;
}

export default function DashboardApp({
  displayName: initialDisplayName,
  major: initialMajor,
  irisTone: initialTone,
  contextBio: initialContextBio,
  fearContext: initialFearContext,
  briefingTime: initialBriefingTime,
  stressors: initialStressors,
  briefing,
  isGoogleConnected,
  isCanvasConnected,
  irisUserId,
}: DashboardAppProps) {
  const { signOut } = useClerk();
  const [view, setView] = useState<View>("iris");
  const [question, setQuestion] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);
  const [irisState, setIrisState] = useState("Listening");
  const [answerText, setAnswerText] = useState(
    "ask me something. i'll check ur live deadlines, grades, schedule, and work history before i answer.",
  );
  const [traceItems, setTraceItems] = useState<string[]>([
    "waiting for a question",
  ]);
  const [isThinkingAnswer, setIsThinkingAnswer] = useState(false);
  const [debriefOpen, setDebriefOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [major, setMajor] = useState(initialMajor || "Engineering");
  const [irisTone, setIrisTone] = useState<"friend" | "unhinged">(
    initialTone === "friend" ? "friend" : "unhinged",
  );
  const [contextBio, setContextBio] = useState(initialContextBio);
  const [fearContext, setFearContext] = useState(initialFearContext);
  const [briefingTimeLabel, setBriefingTimeLabel] = useState(
    formatBriefingTime(initialBriefingTime || "09:00"),
  );
  const [stressors, setStressors] = useState<StressorId[]>(initialStressors);
  const [savedLabel, setSavedLabel] = useState("saved");

  const [gradescopeConnected, setGradescopeConnected] = useState(false);
  const [briefingEnabled, setBriefingEnabled] = useState(true);
  const [deadlineInterventions, setDeadlineInterventions] = useState(true);
  const [lowStakes, setLowStakes] = useState(false);

  const questionRef = useRef<HTMLInputElement>(null);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connectedCount =
    (isGoogleConnected ? 2 : 0) +
    (isCanvasConnected ? 2 : 0) +
    (gradescopeConnected ? 1 : 0);
  const missingCount = TOTAL_SOURCES - connectedCount;

  const debriefItems: DebriefItem[] = getDebriefItems(
    briefing?.raw_data,
    briefing?.content ?? "",
  );

  const debriefSummary =
    briefing?.content ??
    `good morning, ${displayName.toLowerCase() || "there"}. connect ur sources and generate a briefing to get ur morning text here.`;

  const showToast = useCallback((text: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(text);
    toastTimerRef.current = setTimeout(() => setToast(null), 1600);
  }, []);

  const saveSettings = useCallback(
    (patch: Record<string, unknown>) => {
      setSavedLabel("saving");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/onboarding/save-details", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
          });
          const result = await res.json();
          if (!result.success) throw new Error(result.error);
          setSavedLabel("saved");
          showToast("settings saved");
        } catch {
          setSavedLabel("save failed");
        }
      }, 320);
    },
    [showToast],
  );

  const typeAnswer = useCallback(
  async (prompt: string) => {
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    setChatError(null);
    setChatLoading(true);
    setIrisState("Thinking");
    setIsThinkingAnswer(true);
    setTraceItems([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error ?? "Failed to get response");
      }

      const text = data.response as string;

      window.setTimeout(() => {
        setIrisState("Typing");
        setIsThinkingAnswer(false);
        setAnswerText("");
        let index = 0;
        typeTimerRef.current = setInterval(() => {
          setAnswerText(text.slice(0, index + 1));
          index += 1;
          if (index >= text.length && typeTimerRef.current) {
            clearInterval(typeTimerRef.current);
            setIrisState("Listening");
            setTraceItems(["Canvas", "Gradebook", "Calendar", "Gmail"]);
          }
        }, 18);
      }, 550);
    } catch (error) {
      setIsThinkingAnswer(false);
      setIrisState("Listening");
      setAnswerText(
        error instanceof Error
          ? error.message
          : "couldn't reach iris right now. try again.",
      );
      setTraceItems(["error"]);
      setChatError(
        error instanceof Error ? error.message : "Failed to send message",
      );
    } finally {
      setChatLoading(false);
    }
  },
  [],
);

  function showView(name: View) {
    setView(name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSend() {
    const trimmed = question.trim();
    if (!trimmed || chatLoading) return;
    void typeAnswer(trimmed);
  }

  function handleQuestionKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  }

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(irisUserId);
      setCopied(true);
      showToast("extension ID copied");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast("copy failed");
    }
  }

  function toggleStressor(label: string) {
    const id = stressorIdFromLabel(label);
    if (!id) return;
    setStressors((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      saveSettings({ onboardingStressors: next });
      return next;
    });
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        showView("iris");
        questionRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const sendReady = question.trim().length > 0;

  return (
  <>
    <div className="app">
      <aside className="side">
        <div className="brand">
          <div className="brand-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/iris-dog-cutout.png" alt="Iris" />
          </div>
          <div>
            <b>iris</b>
            <small>student command</small>
          </div>
        </div>
        <nav className="nav">
          <button
            type="button"
            className={view === "iris" ? "active" : ""}
            onClick={() => showView("iris")}
          >
            <span className="nav-icon">✦</span>
            <span>Ask Iris</span>
          </button>
          <button
            type="button"
            className={view === "integrations" ? "active" : ""}
            onClick={() => showView("integrations")}
          >
            <span className="nav-icon">⌘</span>
            <span>Integrations</span>
            <span className="nav-count">{missingCount}</span>
          </button>
          <button
            type="button"
            className={view === "settings" ? "active" : ""}
            onClick={() => showView("settings")}
          >
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </button>
        </nav>
        <div className="side-foot">
          <div className="live">
            <i aria-hidden="true" />
            <span>{connectedCount} sources live</span>
          </div>
          <div className="user">
            <div className="avatar">{getInitials(displayName)}</div>
            <div>
              <b>{displayName || "Student"}</b>
              <small>{irisTone} mode</small>
            </div>
          </div>
          <button
            type="button"
            className="logout-btn"
            onClick={() => signOut({ redirectUrl: "/" })}
          >
            log out
          </button>
        </div>
      </aside>

      <main className="main">
        <section
          className={`view${view === "iris" ? " active" : ""}`}
          id="view-iris"
        >
          <div className="iris-shell">
            <header className="iris-head">
              <div className="iris-avatar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/iris-dog-cutout.png" alt="Iris" />
              </div>
              <div className="iris-id">
                <b>Iris</b>
                <div className="iris-status">
                  <i aria-hidden="true" />
                  <span>{irisState}</span>
                </div>
              </div>
              <div className="key">
                <span>⌘</span>
                <span>K</span>
              </div>
            </header>

            <section className={`debrief${debriefOpen ? " open" : ""}`}>
              <div className="debrief-main">
                <div className="debrief-badge">☀</div>
                <div className="debrief-copy">
                  <span>
                    iris · morning text ·{" "}
                    {formatBriefingTime(initialBriefingTime || "09:00")}
                  </span>
                  <b>{debriefSummary}</b>
                </div>
                <button
                  type="button"
                  className="debrief-toggle"
                  onClick={() => setDebriefOpen((open) => !open)}
                >
                  {debriefOpen ? "close ↑" : "open debrief →"}
                </button>
              </div>
              <div className="debrief-details">
                {debriefItems.map((item) => (
                  <div key={item.label} className="brief-item">
                    <span>{item.label}</span>
                    <b>{item.text}</b>
                  </div>
                ))}
              </div>
            </section>

            <div className="askbar">
              <span className="search-icon">⌕</span>
              <input
                ref={questionRef}
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={handleQuestionKeyDown}
                placeholder="Ask the messy question"
              />
              <button
                type="button"
                className={`send${sendReady ? " ready" : ""}`}
                id="send"
                disabled={!sendReady || chatLoading}
                onClick={handleSend}
              >
                ↗
              </button>
            </div>

            <div className="suggestions" id="suggestions">
              {SUGGESTIONS.map((item, index) => (
                <button
                  key={item.question}
                  type="button"
                  className={`suggestion${
                    activeSuggestion === index ? " active" : ""
                  }`}
                  onClick={() => {
                    setActiveSuggestion(index);
                    setQuestion(item.question);
                    questionRef.current?.focus();
                  }}
                >
                  <span className="s-icon">{item.icon}</span>
                  <b>{item.question}</b>
                  <span className="tag">{item.tag}</span>
                </button>
              ))}
            </div>

            <div className="answer">
              <div className="answer-label">Iris</div>
              <div className="answer-copy" id="answer-copy">
                {isThinkingAnswer ? (
                  <div className="thinking">
                    <i aria-hidden="true" />
                    <i aria-hidden="true" />
                    <i aria-hidden="true" />
                  </div>
                ) : (
                  <>
                    {answerText}
                    {irisState === "Typing" ? (
                      <span className="cursor" aria-hidden="true" />
                    ) : null}
                  </>
                )}
              </div>
              <div className="trace" id="trace">
                {traceItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              {chatError ? <p className="ob-error">{chatError}</p> : null}
            </div>
          </div>
        </section>

        <section
          className={`view${view === "integrations" ? " active" : ""}`}
          id="view-integrations"
        >
          <div className="intro">
            <div>
              <div className="eyebrow">your context layer</div>
              <h1>Integrations</h1>
              <p>
                Connect the places college hides important information. Iris
                turns them into one useful answer.
              </p>
            </div>
            <span className="status-pill" id="source-status">
              {connectedCount} of {TOTAL_SOURCES} connected
            </span>
          </div>
          <div className="integration-layout">
            <div className="integration-list">
              <div className="integration">
                <div className="app-icon" style={{ color: "#e45252" }}>
                  C
                </div>
                <div>
                  <b>Canvas</b>
                  <p>Assignments, announcements, and submissions.</p>
                </div>
                <button
                  type="button"
                  className={`connect${isCanvasConnected ? " connected" : ""}`}
                  onClick={() => {
                    if (!isCanvasConnected) showView("integrations");
                  }}
                >
                  {isCanvasConnected ? "connected" : "connect"}
                </button>
              </div>
              <div className="integration">
                <div className="app-icon" style={{ color: "#4285e8" }}>
                  G
                </div>
                <div>
                  <b>Gmail</b>
                  <p>Professor emails and advisor replies.</p>
                </div>
                <button
                  type="button"
                  className={`connect${isGoogleConnected ? " connected" : ""}`}
                  onClick={() => {
                    if (!isGoogleConnected) {
                      window.location.href = "/api/auth/google";
                    }
                  }}
                >
                  {isGoogleConnected ? "connected" : "connect"}
                </button>
              </div>
              <div className="integration">
                <div className="app-icon" style={{ color: "#4285e4" }}>
                  31
                </div>
                <div>
                  <b>Google Calendar</b>
                  <p>Classes, meetings, and real availability.</p>
                </div>
                <button
                  type="button"
                  className={`connect${isGoogleConnected ? " connected" : ""}`}
                  onClick={() => {
                    if (!isGoogleConnected) {
                      window.location.href = "/api/auth/google";
                    }
                  }}
                >
                  {isGoogleConnected ? "connected" : "connect"}
                </button>
              </div>
              <div className="integration">
                <div className="app-icon" style={{ color: "#36ad73" }}>
                  %
                </div>
                <div>
                  <b>Gradebook</b>
                  <p>Weights and actual grade consequences.</p>
                </div>
                <button
                  type="button"
                  className={`connect${isCanvasConnected ? " connected" : ""}`}
                  disabled
                >
                  {isCanvasConnected ? "connected" : "connect"}
                </button>
              </div>
              <div className="integration">
                <div className="app-icon">GS</div>
                <div>
                  <b>Gradescope</b>
                  <p>Deadlines and autograder results.</p>
                </div>
                <button
                  type="button"
                  className={`connect${gradescopeConnected ? " connected" : ""}`}
                  onClick={() => {
                    setGradescopeConnected((prev) => {
                      const next = !prev;
                      showToast(
                        next
                          ? "integration connected"
                          : "integration disconnected",
                      );
                      return next;
                    });
                  }}
                >
                  {gradescopeConnected ? "connected" : "connect"}
                </button>
              </div>
              <div className="integration">
                <div className="app-icon" style={{ color: "#ee9e38" }}>
                  N
                </div>
                <div>
                  <b>Notion</b>
                  <p>Notes and project context. Coming soon.</p>
                </div>
                <button type="button" className="connect" disabled>
                  soon
                </button>
              </div>
            </div>
            <aside className="extension">
              <div className="eyebrow">canvas access</div>
              <h3>Iris Chrome extension</h3>
              <p>
                Securely links Canvas to your account. Iris can read course
                context but cannot submit or change coursework.
              </p>
              <div className="id">
                <code>{irisUserId}</code>
                <button type="button" id="copy" onClick={handleCopyId}>
                  {copied ? "copied ✓" : "copy"}
                </button>
              </div>
              <button type="button" className="open-store">
                open Chrome Web Store ↗
              </button>
              <div className="secure">
                <b>Scoped access.</b>
                <br />
                Only the context Iris needs to prioritize your work is read.
              </div>
            </aside>
          </div>
        </section>

        <section
          className={`view${view === "settings" ? " active" : ""}`}
          id="view-settings"
        >
          <div className="intro">
            <div>
              <div className="eyebrow">everything iris learned in onboarding</div>
              <h1>Settings</h1>
              <p>
                Edit the context Iris uses to prioritize, message, and intervene
                for you.
              </p>
            </div>
            <span className="saved-state">
              <i aria-hidden="true" />
              <span id="saved-label">{savedLabel}</span>
            </span>
          </div>
          <div className="settings">
            <section className="settings-section">
              <div className="section-copy">
                <b>You</b>
                <p>
                  The basic context Iris uses when interpreting school and
                  career decisions.
                </p>
              </div>
              <div className="section-fields">
                <div className="field-grid">
                  <div className="field">
                    <label htmlFor="setting-name">name</label>
                    <input
                      className="text-field"
                      id="setting-name"
                      value={displayName}
                      onChange={(event) => {
                        setDisplayName(event.target.value);
                        saveSettings({ displayName: event.target.value });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="setting-major">major</label>
                    <select
                      className="select-field"
                      id="setting-major"
                      value={major}
                      onChange={(event) => {
                        setMajor(event.target.value);
                        saveSettings({ major: event.target.value });
                      }}
                    >
                      {MAJORS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="settings-section">
              <div className="section-copy">
                <b>Priority signals</b>
                <p>
                  Choose the fewest that matter. Iris uses these to decide what
                  deserves attention first.
                </p>
              </div>
              <div className="priority-groups">
                {STRESSOR_GROUPS.map((group) => (
                  <div key={group.label} className="priority-row">
                    <span className="priority-label">{group.label}</span>
                    <div className="priority-options">
                      {group.options.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          data-priority={option.label}
                          className={
                            stressors.includes(option.id) ? "selected" : ""
                          }
                          onClick={() => toggleStressor(option.label)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="settings-section">
              <div className="section-copy">
                <b>How Iris talks</b>
                <p>The algorithm stays the same. Only the delivery changes.</p>
              </div>
              <div className="tone-choice">
                <button
                  type="button"
                  data-tone="friend"
                  className={irisTone === "friend" ? "active" : ""}
                  onClick={() => {
                    setIrisTone("friend");
                    saveSettings({ irisTone: "friend" });
                  }}
                >
                  <b>friend</b>
                  <small>Direct and funny. No cussing.</small>
                </button>
                <button
                  type="button"
                  data-tone="unhinged"
                  className={irisTone === "unhinged" ? "active" : ""}
                  onClick={() => {
                    setIrisTone("unhinged");
                    saveSettings({ irisTone: "unhinged" });
                  }}
                >
                  <b>unhinged</b>
                  <small>Brutally honest. Cusses because it works.</small>
                </button>
              </div>
            </section>

            <section className="settings-section">
              <div className="section-copy">
                <b>Personal context</b>
                <p>
                  This is used directly when Iris decides what is realistic for
                  you.
                </p>
              </div>
              <div className="section-fields">
                <div className="field">
                  <label htmlFor="setting-context">who you actually are</label>
                  <textarea
                    className="context-field"
                    id="setting-context"
                    value={contextBio}
                    onChange={(event) => {
                      setContextBio(event.target.value);
                      saveSettings({ contextBio: event.target.value });
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="setting-fear">
                    what iris should quietly watch out for
                  </label>
                  <textarea
                    className="context-field"
                    id="setting-fear"
                    value={fearContext}
                    onChange={(event) => {
                      setFearContext(event.target.value);
                      saveSettings({ fearContext: event.target.value });
                    }}
                  />
                </div>
              </div>
            </section>

            <section className="settings-section">
              <div className="section-copy">
                <b>Briefing</b>
                <p>Choose when Iris sends your one prioritized morning message.</p>
              </div>
              <div className="section-fields">
                <div className="field-grid">
                  <div className="field">
                    <label htmlFor="setting-time">morning briefing time</label>
                    <select
                      className="select-field"
                      id="setting-time"
                      value={briefingTimeLabel}
                      onChange={(event) => {
                        setBriefingTimeLabel(event.target.value);
                        saveSettings({
                          briefingTime: briefingLabelToValue(event.target.value),
                        });
                      }}
                    >
                      {BRIEFING_TIME_OPTIONS.map((option) => (
                        <option key={option.value} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="setting">
                  <div>
                    <b>Morning briefing enabled</b>
                    <p>Send one useful message. No motivational sludge.</p>
                  </div>
                  <button
                    type="button"
                    className={`toggle${briefingEnabled ? " on" : ""}`}
                    onClick={() => setBriefingEnabled((prev) => !prev)}
                  >
                    <i aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>

            <section className="settings-section">
              <div className="section-copy">
                <b>Interventions</b>
                <p>
                  Control which situations are important enough for Iris to
                  interrupt you.
                </p>
              </div>
              <div className="section-fields">
                <div className="setting">
                  <div>
                    <b>Deadline interventions</b>
                    <p>
                      Interrupt when missing something would materially hurt
                      your grade.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`toggle${deadlineInterventions ? " on" : ""}`}
                    onClick={() => setDeadlineInterventions((prev) => !prev)}
                  >
                    <i aria-hidden="true" />
                  </button>
                </div>
                <div className="setting">
                  <div>
                    <b>Low stakes reminders</b>
                    <p>Include tasks with little or no grade impact.</p>
                  </div>
                  <button
                    type="button"
                    className={`toggle${lowStakes ? " on" : ""}`}
                    onClick={() => setLowStakes((prev) => !prev)}
                  >
                    <i aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>

            <section className="settings-section">
              <div className="section-copy">
                <b>Canvas access</b>
                <p>The extension and connected sources are managed separately.</p>
              </div>
              <div>
                <button
                  type="button"
                  className="connect"
                  onClick={() => showView("integrations")}
                >
                  manage integrations →
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
    <div className={`toast${toast ? " show" : ""}`} id="toast">
      {toast ?? "updated"}
    </div>
  </>
  );
}
