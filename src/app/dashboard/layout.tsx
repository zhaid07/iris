import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className={`dashboard-root ${inter.className}`}>{children}</div>;
}
