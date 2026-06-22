import Image from "next/image";
import type { ReactNode } from "react";

import "./auth-form.css";

interface AuthFormCardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthFormCard({
  title,
  children,
  footer,
}: AuthFormCardProps) {
  return (
    <div className="auth-form-card">
      <div className="auth-form-card-topbar">
        <div className="auth-form-card-orb">
          <Image
            src="/iris-logo-tile.png"
            alt=""
            width={32}
            height={32}
          />
        </div>
        <div className="auth-form-card-title">{title}</div>
        <div className="auth-form-card-kbd" aria-hidden="true">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </div>
      </div>
      <div className="auth-form-body">{children}</div>
      {footer ? <div className="auth-form-footer">{footer}</div> : null}
    </div>
  );
}
