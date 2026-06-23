export const SUGGESTIONS = [
  {
    icon: "◎",
    question: "What do I need to focus on today?",
    tag: "priority",
  },
  {
    icon: "◷",
    question: "Should I skip my 11am lecture?",
    tag: "schedule",
  },
  {
    icon: "◌",
    question: "What's eating my time this week?",
    tag: "audit",
  },
  {
    icon: "◆",
    question: "Am I on track this semester?",
    tag: "track",
  },
  {
    icon: "▣",
    question: "What should I do with my free hour at 2pm?",
    tag: "block",
  },
] as const;

export const BRIEFING_TIME_OPTIONS = [
  { label: "7:00 AM", value: "07:00" },
  { label: "8:00 AM", value: "08:00" },
  { label: "9:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
] as const;

export function formatBriefingTime(time: string): string {
  const match = BRIEFING_TIME_OPTIONS.find((option) => option.value === time);
  return match?.label ?? "9:00 AM";
}

export function briefingLabelToValue(label: string): string {
  const match = BRIEFING_TIME_OPTIONS.find((option) => option.label === label);
  return match?.value ?? "09:00";
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "IR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export interface DebriefItem {
  label: string;
  text: string;
}

export function getDebriefItems(
  rawData: unknown,
  fallbackContent: string,
): DebriefItem[] {
  const raw = rawData as { assignments?: { name?: string; due_at?: string }[] } | null;
  const assignments = raw?.assignments?.filter((item) => item?.name) ?? [];

  if (assignments.length >= 3) {
    return [
      {
        label: "do now",
        text: `${assignments[0].name} due ${assignments[0].due_at ? new Date(assignments[0].due_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "soon"}.`,
      },
      {
        label: "new",
        text: `${assignments[1].name} needs attention next.`,
      },
      {
        label: "later",
        text: `${assignments[2].name} can wait if the urgent stuff is handled.`,
      },
    ];
  }

  if (fallbackContent) {
    const sentences = fallbackContent
      .split(/(?<=[.!?])\s+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (sentences.length >= 3) {
      return [
        { label: "do now", text: sentences[0] },
        { label: "new", text: sentences[1] },
        { label: "later", text: sentences[2] },
      ];
    }
  }

  return [
    {
      label: "do now",
      text: "HW5 due at 9:30. Two questions left.",
    },
    {
      label: "new",
      text: "Your advisor replied. Meeting at 2:30.",
    },
    {
      label: "later",
      text: "6pm is free if quiz review is finished.",
    },
  ];
}
