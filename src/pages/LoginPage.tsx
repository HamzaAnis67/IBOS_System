import { useState, FormEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";

type Role = "client" | "employee" | "admin";

interface Toast {
  message: string;
  type: "success" | "error";
}

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
  );

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabels = ["Weak", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["#E24B4A", "#E24B4A", "#F59E0B", "#22C55E", "#1D9E75"];

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordStrength = getPasswordStrength(password);
  const emailError = touched.email && !emailValid;
  const passwordError = touched.password && password.length > 0 && password.length < 8;

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailValid) return showToast("Please enter a valid email", "error");
    if (password.length < 8) return showToast("Password must be at least 8 characters", "error");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    showToast("Login successful! Redirecting...", "success");
    setTimeout(() => navigate(`/${role}/dashboard`), 800);
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      showToast("Please enter a valid email", "error");
      return;
    }
    showToast("Reset link sent to your email", "success");
    setForgotOpen(false);
    setForgotEmail("");
  };

  const roles: { key: Role; label: string }[] = [
    { key: "client", label: "Client" },
    { key: "employee", label: "Employee" },
    { key: "admin", label: "Admin" },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "#0c0c12" }}>
      {/* Ambient orbs */}
      <div className="animate-float-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none" style={{ background: "#7F77DD" }} />
      <div className="animate-float-2 absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none" style={{ background: "#1D9E75" }} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg text-sm font-medium font-body shadow-lg animate-fade-in-up"
          style={{ background: toast.type === "success" ? "#1D9E75" : "#E24B4A", color: "#fff" }}>
          {toast.message}
        </div>
      )}

      {/* Login card */}
      <div className="animate-fade-in-up relative z-10 w-full max-w-md mx-4 rounded-2xl p-8 border border-border" style={{ background: "#16161e" }}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="14" width="24" height="6" rx="2" fill="url(#g1)" opacity="0.5"/>
            <rect x="4" y="6" width="24" height="6" rx="2" fill="url(#g1)" opacity="0.75"/>
            <rect x="4" y="22" width="24" height="6" rx="2" fill="url(#g1)" opacity="0.35"/>
            <defs><linearGradient id="g1" x1="4" y1="6" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#7F77DD"/><stop offset="1" stopColor="#1D9E75"/></linearGradient></defs>
          </svg>
          <span className="text-2xl font-bold font-heading tracking-tight text-foreground">
            IBO<span style={{ color: "#7F77DD" }}>S</span>
          </span>
        </div>

        {/* Role selector */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl bg-muted">
          {roles.map((r) => (
            <button key={r.key} onClick={() => setRole(r.key)} type="button"
              className={`flex-1 py-2 text-sm font-medium font-body rounded-lg transition-all duration-200 ${
                role === r.key ? "text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
              style={role === r.key ? { background: "#7F77DD" } : {}}>
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium font-body text-muted-foreground mb-1.5">Email</label>
            <input type="email" value={email} placeholder="you@company.com"
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className={`w-full px-4 py-2.5 rounded-lg bg-muted text-foreground font-body text-sm outline-none transition-all border ${
                emailError ? "border-destructive" : "border-border focus:border-primary"
              }`}
            />
            {emailError && <p className="text-xs mt-1 text-destructive font-body">Please enter a valid email address</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium font-body text-muted-foreground mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className={`w-full px-4 py-2.5 pr-12 rounded-lg bg-muted text-foreground font-body text-sm outline-none transition-all border ${
                  passwordError ? "border-destructive" : "border-border focus:border-primary"
                }`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {passwordError && <p className="text-xs mt-1 text-destructive font-body">Password must be at least 8 characters</p>}

            {/* Strength meter */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ background: i < passwordStrength ? strengthColors[passwordStrength] : "rgba(255,255,255,0.1)" }} />
                  ))}
                </div>
                <p className="text-xs mt-1 font-body" style={{ color: strengthColors[passwordStrength] }}>
                  {strengthLabels[passwordStrength]}
                </p>
              </div>
            )}
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-primary" style={{ accentColor: "#7F77DD" }} />
              <span className="text-sm text-muted-foreground font-body">Remember me</span>
            </label>
            <button type="button" onClick={() => setForgotOpen(true)}
              className="text-sm font-body hover:underline" style={{ color: "#7F77DD" }}>
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold font-body text-foreground flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #7F77DD, #1D9E75)" }}>
            {loading ? <><Spinner /> Signing in...</> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-body mt-6">
          New to IBOS? <span className="text-foreground font-medium">Contact your admin</span> to get access.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setForgotOpen(false)}>
          <div className="animate-fade-in-up w-full max-w-sm mx-4 rounded-2xl p-6 border border-border" style={{ background: "#16161e" }}
            onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold font-heading text-foreground mb-1">Reset Password</h3>
            <p className="text-sm text-muted-foreground font-body mb-4">Enter your email to receive a reset link.</p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-lg bg-muted text-foreground font-body text-sm outline-none border border-border focus:border-primary" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setForgotOpen(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-body font-medium bg-muted text-foreground hover:opacity-80 transition-opacity">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-body font-medium text-foreground transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #7F77DD, #1D9E75)" }}>
                  Send link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
