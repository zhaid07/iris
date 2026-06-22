import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "Inter, system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
      }} />
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: "600px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(86,69,212,.14) 0%, transparent 70%)",
        top: "10%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none",
      }} />
      {/* Logo */}
      <div style={{ marginBottom: "36px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "11px",
          background: "#fff", margin: "0 auto 14px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(15,23,42,.3)",
        }}>
          <span style={{ color: "#5645d4", fontSize: "20px", fontWeight: 800 }}>I</span>
        </div>
        <h1 style={{ color: "#fff", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.4px", margin: 0 }}>
          Iris
        </h1>
        <p style={{ color: "rgba(255,255,255,.4)", fontSize: "13px", marginTop: "5px" }}>
          Your academic assistant
        </p>
      </div>
      {/* Clerk card */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#5645d4",
              colorBackground: "rgba(255,255,255,.04)",
              colorInputBackground: "rgba(255,255,255,.06)",
              colorInputText: "#f7f8f8",
              colorText: "#f7f8f8",
              colorTextSecondary: "rgba(255,255,255,.45)",
              colorDanger: "#ef4444",
              borderRadius: "8px",
              fontFamily: "Inter, system-ui, sans-serif",
            },
            elements: {
              card: "border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,.7),0_0_80px_rgba(86,69,212,.1)] backdrop-blur-xl",
              socialButtonsBlockButton: "border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 font-normal",
              formFieldInput: "bg-white/5 border-white/10 text-white focus:border-[#5645d4] focus:ring-1 focus:ring-[#5645d4]",
              formButtonPrimary: "bg-[#5645d4] hover:bg-[#6b55e4] text-white shadow-none font-medium",
              footerActionLink: "text-[#7b5ef8] hover:text-[#9b7eff]",
              dividerLine: "bg-white/10",
              dividerText: "text-white/30",
              formFieldLabel: "text-white/50",
              identityPreviewText: "text-white/80",
            },
          }}
        />
      </div>
    </div>
  );
}
