export const MAJORS = [
  "Engineering",
  "Business",
  "Sciences",
  "Arts",
  "Other",
] as const;

export type Major = (typeof MAJORS)[number];

export const STRESSOR_GROUPS = [
  {
    label: "academics",
    options: [
      { id: "deadlines", label: "deadlines" },
      { id: "my_gpa", label: "my GPA" },
      { id: "lsat_mcat_gre", label: "LSAT / MCAT / GRE" },
    ],
  },
  {
    label: "career",
    options: [
      { id: "internship", label: "internship" },
      { id: "job_after_graduation", label: "job after graduation" },
      { id: "career_choice", label: "career choice" },
    ],
  },
  {
    label: "applications",
    options: [
      { id: "grad_school", label: "grad school" },
      { id: "research_experience", label: "research experience" },
      { id: "financial_aid", label: "financial aid" },
    ],
  },
  {
    label: "life",
    options: [
      { id: "work_and_school", label: "work + school" },
      { id: "burnout", label: "burnout" },
      { id: "the_future", label: "the future" },
    ],
  },
] as const;

export type StressorId =
  (typeof STRESSOR_GROUPS)[number]["options"][number]["id"];

export const ALL_STRESSOR_IDS: StressorId[] = STRESSOR_GROUPS.flatMap((g) =>
  g.options.map((o) => o.id),
);

export const FEAR_TRIGGER_IDS: StressorId[] = [
  "work_and_school",
  "the_future",
  "grad_school",
  "job_after_graduation",
];

export type EmailPriorityId =
  | "professors_tas"
  | "career_internships"
  | "financial_aid"
  | "advisor_registration"
  | "clubs_orgs"
  | "campus_deadlines";

export type ClassDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const EMAIL_PRIORITY_OPTIONS: {
  id: EmailPriorityId;
  label: string;
}[] = [
  { id: "professors_tas", label: "professors & TAs" },
  { id: "career_internships", label: "career & internships" },
  { id: "financial_aid", label: "financial aid" },
  { id: "advisor_registration", label: "advisor & registration" },
  { id: "clubs_orgs", label: "clubs & orgs" },
  { id: "campus_deadlines", label: "campus deadlines" },
];

export const CLASS_DAYS: { id: ClassDay; label: string }[] = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
];

export type IrisTone = "nice" | "unhinged";

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
    title: "Straight up. Funny. No cussing.",
    description:
      "Sounds human and keeps you honest without swearing at you.",
    sample:
      "hey, hw5 is due in 20 min and u haven't submitted. missing it takes ur homework average from 90 to 77. open canvas.",
  },
  {
    id: "unhinged",
    label: "unhinged",
    title: "Chosen by most students. Mean because it works.",
    description:
      "Iris cusses, makes fun of your excuses, and tells you the honest consequence before the situation gets worse.",
    sample:
      "dumbass, hw5 is due in 20 min and u still haven't submitted. miss this and ur homework average drops from 90 to 77. u keep missing shit like this and ur fucked. open canvas and lock in, because if u ignore me too then i'm no fuckin help.",
  },
];

export const BRIEFING_OPTIONS = [
  { id: "7am", label: "7am", subtitle: "early", value: "07:00" },
  { id: "8am", label: "8am", subtitle: "normal", value: "08:00" },
  { id: "9am", label: "9am", subtitle: "civilized", value: "09:00" },
  { id: "10am", label: "10am", subtitle: "optimist", value: "10:00" },
  { id: "custom", label: "custom", subtitle: "you decide", value: "" },
] as const;

export type BriefingChoice = (typeof BRIEFING_OPTIONS)[number]["id"];

export const WALKTHROUGH_STEPS = [
  {
    icon: "⌘",
    title: "click extensions",
    description: "Open the puzzle-piece menu in Chrome.",
  },
  {
    icon: "I",
    title: "find Iris, click add",
    description: "Pin Iris so she stays one click away.",
  },
  {
    icon: "↓",
    title: "paste ur ID",
    description: "This connects the extension to your account.",
  },
] as const;

export function shouldShowFearStep(stressors: StressorId[]): boolean {
  return stressors.some((id) => FEAR_TRIGGER_IDS.includes(id));
}

export function getFearStressorLabel(stressors: StressorId[]): string {
  const labels: Record<string, string> = {
    the_future: "the future",
    work_and_school: "work and school",
    grad_school: "grad school",
    job_after_graduation: "job after graduation",
  };

  for (const id of FEAR_TRIGGER_IDS) {
    if (stressors.includes(id)) {
      return labels[id] ?? id.replace(/_/g, " ");
    }
  }

  return "what's stressing u out";
}

export function getDogMessage(
  step: number,
  data: {
    displayName: string;
    stressors: StressorId[];
  },
): { text: string; delayMs?: number; initialDelayMs?: number } {
  const name = data.displayName.trim() || "there";

  switch (step) {
    case 1:
      return {
        text: "hey. i'm iris. what do i call you?",
        initialDelayMs: 650,
      };
    case 2:
      return { text: `nice to meet u, ${name}. what are u studying?` };
    case 3:
      return {
        text: "real talk. what's actually stressing u out rn? pick only what matters most. my algorithm uses this to decide what to watch, what to text u about, and what gets priority.",
      };
    case 4:
      return {
        text: "ok so what actually lands in ur inbox that matters",
      };
    case 5:
      return {
        text: "iris is a funny, unhinged dog. i can cuss and call u out like a real friend, but if u tell me not to, i won't. how should i talk to u?",
      };
    case 6:
      return {
        text: `ok ${name}. tell me who u actually are. the more u say the more targeted i get. this isn't a bio. it is context my algorithm uses to prioritize for u.`,
      };
    case 7:
      return {
        text: `hey. u mentioned ${getFearStressorLabel(data.stressors)}. most apps just skip past that. what's the thing that actually scares u that we didn't ask about?`,
        delayMs: 900,
      };
    case 8:
      return {
        text: "let me see ur week so i know when u actually have time",
      };
    case 9:
      return {
        text: "ok drop the syllabi, i'll do the reading so u don't have to",
      };
    case 10:
      return { text: "when should i text u every morning?" };
    case 11:
      return {
        text: "almost there. install the extension so i can see ur canvas. it securely connects school context to ur iris account and only reads what i need to catch deadlines and conflicts.",
      };
    case 12:
      return { text: `ok ${name}. we're locked in. let's go.` };
    default:
      return { text: "" };
  }
}

export function briefingChoiceToTime(
  choice: BriefingChoice,
  customTime: string,
): string {
  if (choice === "custom") {
    return customTime || "08:00";
  }

  const match = BRIEFING_OPTIONS.find((option) => option.id === choice);
  return match?.value || "08:00";
}

export function stressorSelectionHint(count: number): string {
  if (count === 0) return "select one or two";
  if (count === 1) return "great. one clear priority.";
  if (count === 2) return "two signals. still focused.";
  return "fewer choices will make iris sharper.";
}
