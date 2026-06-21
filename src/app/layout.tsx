import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import localFont from "next/font/local";
import { AppHeader } from "@/components/app-header";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#5645d4",
    colorBackground: "#0a0a0a",
    colorInputBackground: "#111111",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.45)",
    colorNeutral: "#ffffff",
    borderRadius: "12px",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "15px",
  },
  elements: {
    card: {
      background: "#0a0a0a",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
      borderRadius: "20px",
    },
    headerTitle: {
      color: "#ffffff",
      fontSize: "22px",
      fontWeight: "600",
      letterSpacing: "-0.5px",
    },
    headerSubtitle: {
      color: "rgba(255,255,255,0.45)",
    },
    socialButtonsBlockButton: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "#ffffff",
      borderRadius: "9999px",
      fontSize: "14px",
      fontWeight: "500",
    },
    socialButtonsBlockButton__google: {
      background: "rgba(255,255,255,0.06)",
    },
    dividerLine: {
      background: "rgba(255,255,255,0.08)",
    },
    dividerText: {
      color: "rgba(255,255,255,0.25)",
    },
    formFieldInput: {
      background: "#111111",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#ffffff",
      borderRadius: "10px",
      fontSize: "15px",
    },
    formFieldLabel: {
      color: "rgba(255,255,255,0.6)",
      fontSize: "13px",
    },
    formButtonPrimary: {
      background: "linear-gradient(135deg, #5645d4, #2997ff)",
      borderRadius: "9999px",
      fontSize: "15px",
      fontWeight: "500",
      border: "none",
    },
    footerActionLink: {
      color: "#7b5ef8",
    },
    identityPreviewText: {
      color: "rgba(255,255,255,0.7)",
    },
    identityPreviewEditButton: {
      color: "#7b5ef8",
    },
  },
};

export const metadata: Metadata = {
  title: "Iris",
  description: "AI-powered student productivity assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider appearance={clerkAppearance}>
          <AppHeader />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
