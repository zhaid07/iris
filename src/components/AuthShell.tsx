import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import "./auth-shell.css";

interface AuthShellProps {
  headline: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthShell({
  headline,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="auth-shell">
      <div className="auth-shell-mesh" aria-hidden="true">
        <div className="auth-shell-mesh-blob auth-shell-mesh-blob-1" />
        <div className="auth-shell-mesh-blob auth-shell-mesh-blob-2" />
        <div className="auth-shell-mesh-blob auth-shell-mesh-blob-3" />
      </div>
      <div className="auth-shell-grid" aria-hidden="true" />

      <nav className="auth-shell-nav">
        <Link href="/" className="auth-shell-logo">
          <span className="auth-shell-logo-mark">
            <Image
              src="/iris-logo-tile.svg"
              alt=""
              width={28}
              height={28}
              priority
            />
          </span>
          Iris
        </Link>
      </nav>

      <div className="auth-shell-body">
        <div className="auth-shell-inner">
          <div className="auth-shell-left">
            <div>
              <span className="auth-shell-eyebrow">Your academic assistant</span>
              <h1 className="auth-shell-headline">{headline}</h1>
              <p className="auth-shell-subtitle">{subtitle}</p>
            </div>

            <div className="auth-shell-preview" aria-hidden="true">
              <div className="auth-shell-thread-wrap">
                <div className="auth-shell-thread">
                  <header className="auth-shell-thread-header">
                    <div className="auth-shell-thread-avatar">
                      <Image
                        src="/iris-logo-tile.svg"
                        alt=""
                        width={44}
                        height={44}
                      />
                    </div>
                    <div className="auth-shell-thread-meta">
                      <span className="auth-shell-thread-name">Iris</span>
                      <span className="auth-shell-thread-status">
                        <span className="auth-shell-thread-status-dot" />
                        typing
                      </span>
                    </div>
                  </header>
                  <div className="auth-shell-thread-body">
                    <div className="auth-shell-bubble auth-shell-bubble-sent">
                      Hey Iris, Im ready.
                    </div>
                    <div className="auth-shell-bubble auth-shell-bubble-received">
                      <div
                        className="auth-shell-typing"
                        aria-label="Iris is typing"
                      >
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-shell-right">{children}</div>
        </div>
      </div>
    </div>
  );
}
