export const MAJORS = [
  "Engineering",
  "Business",
  "Sciences",
  "Arts",
  "Other",
] as const;

export type Major = (typeof MAJORS)[number];

export const STRESSORS = [
  { id: "keeping_up_with_deadlines", label: "keeping up with deadlines" },
  { id: "my_gpa", label: "my GPA" },
  { id: "balancing_everything", label: "balancing everything" },
  { id: "the_future_honestly", label: "the future honestly" },
  { id: "all_of_the_above", label: "all of the above" },
] as const;

export type StressorId = (typeof STRESSORS)[number]["id"];

export const FEAR_TRIGGER_IDS: StressorId[] = [
  "balancing_everything",
  "the_future_honestly",
  "all_of_the_above",
];

export type IrisTone = "nice" | "friend" | "unhinged";

export const TONE_OPTIONS: {
  id: IrisTone;
  label: string;
  title: string;
  description: string;
  sample: string;
}[] = [
  {
    id: "nice",
    label: "nice",
    title: "Helpful. Calm. Zero emotional damage.",
    description:
      "Clear and supportive, like an advisor who actually reads your email.",
    sample:
      "hey! hw5 is due in 20 min. missing it drops ur homework average from 90 → 77. want me to open Canvas?",
  },
  {
    id: "friend",
    label: "friend",
    title: "Cares about you. Will call you out.",
    description:
      "Direct enough to work, funny enough that you won't mute her.",
    sample:
      "dumbass hw5 is due in 20 min and u haven't submitted. ur grade goes 90 → 77. open canvas.",
  },
  {
    id: "unhinged",
    label: "unhinged",
    title: "Maximum panic. Still academically correct.",
    description:
      "For students who require a small theatrical emergency to begin moving.",
    sample:
      "HELLO??? hw5 dies in 20 min. miss it and i personally watch ur grade get launched 90 → 77. OPEN CANVAS.",
  },
];

export const BRIEFING_PRESETS = [
  { label: "7am", value: "07:00" },
  { label: "8am", value: "08:00" },
  { label: "9am", value: "09:00" },
  { label: "10am", value: "10:00" },
] as const;

export function shouldShowFearStep(stressors: StressorId[]): boolean {
  return stressors.some((id) => FEAR_TRIGGER_IDS.includes(id));
}

export function getFearStressorLabel(stressors: StressorId[]): string {
  const match = STRESSORS.find(
    (s) => FEAR_TRIGGER_IDS.includes(s.id) && stressors.includes(s.id),
  );
  return match?.label ?? "that";
}

export function getDogMessage(
  step: number,
  data: {
    displayName: string;
    stressors: StressorId[];
  },
): { text: string; delayMs?: number } {
  const name = data.displayName.trim() || "there";

  switch (step) {
    case 1:
      return { text: "hey. i'm iris. what do i call you?" };
    case 2:
      return { text: `nice to meet u, ${name}. what are u studying?` };
    case 3:
      return { text: "real talk. what's actually stressing u out rn?" };
    case 4:
      return {
        text: "one thing before we go further — how do u want me to talk to u?",
      };
    case 5:
      return {
        text: `ok ${name}. tell me who u actually are. the more u say the more targeted i get — this isn't a bio, this is context i actually use.`,
      };
    case 6:
      return {
        text: `hey — u mentioned ${getFearStressorLabel(data.stressors)}. most apps just skip past that. what's the thing that actually scares u that we didn't ask about?`,
        delayMs: 1200,
      };
    case 7:
      return { text: "when should i text u every morning?" };
    case 8:
      return {
        text: "almost there. install the extension so i can see ur canvas.",
      };
    case 9:
      return { text: `ok ${name}. we're locked in. let's go.` };
    default:
      return { text: "" };
  }
}
