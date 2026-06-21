import type { Metadata } from "next";
import { readFileSync } from "fs";
import { join } from "path";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Iris",
  icons: {
    icon: "/iris-logo-tile.png",
    apple: "/iris-logo-tile.png",
  },
};

const landingDir = join(process.cwd(), "src/landing");

const LANDING_CSS = readFileSync(join(landingDir, "landing.css"), "utf8");
const LANDING_HTML = readFileSync(join(landingDir, "landing.html"), "utf8");
const LANDING_JS = readFileSync(join(landingDir, "landing.js"), "utf8");

export default function Home() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: LANDING_HTML }} />
      <Script
        id="iris-landing"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: LANDING_JS }}
      />
    </>
  );
}
