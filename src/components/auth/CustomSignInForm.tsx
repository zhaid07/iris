"use client";

import { useSignIn } from "@clerk/nextjs";
import type { SignInResource } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { AuthDivider } from "@/components/auth/AuthDivider";
import AuthFormCard from "@/components/auth/AuthFormCard";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

type Step = "credentials" | "verification" | "mfa";

function getErrorMessage(error: unknown, fallback: string): string {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.message ?? fallback;
  }
  return fallback;
}

interface SignInFormProps {
  signIn: SignInResource;
  setActive: (params: { session: string }) => Promise<void>;
}

function SignInForm({ signIn, setActive }: SignInFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("credentials");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function completeSignIn(sessionId: string | null) {
    if (!sessionId) {
      setError("Sign in could not be completed. Please try again.");
      return;
    }

    await setActive({ session: sessionId });
    router.push("/onboarding");
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/onboarding",
      });
    } catch (err) {
      setError(getErrorMessage(err, "Google sign in failed"));
      setLoading(false);
    }
  }

  async function handleCredentials(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === "complete") {
        await completeSignIn(result.createdSessionId);
        return;
      }

      if (result.status === "needs_first_factor") {
        const emailFactor = result.supportedFirstFactors?.find(
          (factor) => factor.strategy === "email_code",
        );

        if (
          emailFactor &&
          "emailAddressId" in emailFactor &&
          emailFactor.emailAddressId
        ) {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: emailFactor.emailAddressId,
          });
          setStep("verification");
          return;
        }
      }

      if (result.status === "needs_second_factor") {
        setStep("mfa");
        return;
      }

      setError("Additional verification is required.");
    } catch (err) {
      setError(getErrorMessage(err, "Sign in failed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerification(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await completeSignIn(result.createdSessionId);
        return;
      }

      if (result.status === "needs_second_factor") {
        setStep("mfa");
        return;
      }

      setError("Verification could not be completed.");
    } catch (err) {
      setError(getErrorMessage(err, "Verification failed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleMfa(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: "totp",
        code,
      });

      if (result.status === "complete") {
        await completeSignIn(result.createdSessionId);
        return;
      }

      setError("Verification could not be completed.");
    } catch (err) {
      setError(getErrorMessage(err, "Verification failed"));
    } finally {
      setLoading(false);
    }
  }

  if (step === "verification") {
    return (
      <AuthFormCard
        title="Verify your email"
        footer={
          <>
            Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
          </>
        }
      >
        <form onSubmit={handleVerification}>
          <p className="auth-form-hint">
            We sent a code to your email. Enter it below to continue.
          </p>
          <input
            className="auth-form-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {error ? <p className="auth-form-error">{error}</p> : null}
          <button
            type="submit"
            className="auth-form-btn auth-form-btn-primary"
            disabled={loading}
          >
            {loading ? "Continuing…" : "Continue →"}
          </button>
        </form>
      </AuthFormCard>
    );
  }

  if (step === "mfa") {
    return (
      <AuthFormCard
        title="Two-factor authentication"
        footer={
          <>
            Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
          </>
        }
      >
        <form onSubmit={handleMfa}>
          <p className="auth-form-hint">
            Enter the code from your authenticator app.
          </p>
          <input
            className="auth-form-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Authentication code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {error ? <p className="auth-form-error">{error}</p> : null}
          <button
            type="submit"
            className="auth-form-btn auth-form-btn-primary"
            disabled={loading}
          >
            {loading ? "Continuing…" : "Continue →"}
          </button>
        </form>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard
      title="Sign in"
      footer={
        <>
          Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
        </>
      }
    >
      <button
        type="button"
        className="auth-form-btn auth-form-btn-outline"
        onClick={handleGoogle}
        disabled={loading}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <AuthDivider />

      <form onSubmit={handleCredentials}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            className="auth-form-input"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-form-input"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error ? <p className="auth-form-error">{error}</p> : null}
        <button
          type="submit"
          className="auth-form-btn auth-form-btn-primary"
          disabled={loading}
        >
          {loading ? "Continuing…" : "Continue →"}
        </button>
      </form>
    </AuthFormCard>
  );
}

export default function CustomSignInForm() {
  const { signIn, isLoaded, setActive } = useSignIn();

  if (!isLoaded || !signIn || !setActive) {
    return (
      <AuthFormCard title="Sign in">
        <div className="auth-form-loading">Loading…</div>
      </AuthFormCard>
    );
  }

  return <SignInForm signIn={signIn} setActive={setActive} />;
}
