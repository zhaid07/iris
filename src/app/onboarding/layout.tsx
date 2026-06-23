import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <div className={`onboarding-root ${inter.className}`}>{children}</div>;
}
