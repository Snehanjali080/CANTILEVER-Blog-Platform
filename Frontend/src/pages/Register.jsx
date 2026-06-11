import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const C = {
  bg:       "#0f1117",
  surface:  "#181c26",
  surface2: "#1f2437",
  border:   "#2a2f42",
  amber:    "#f0a500",
  amberLt:  "#fbbf24",
  text:     "#e8e9ed",
  muted:    "#8b90a0",
  danger:   "#ef4444",
  success:  "#22c55e",
};

function InputField({ label, type = "text", placeholder, value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: C.muted,
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "10px",
          fontSize: "0.875rem",
          backgroundColor: C.surface,
          border: `1px solid ${error ? C.danger : focused ? C.amber : C.border}`,
          color: C.text,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
          boxShadow: focused ? `0 0 0 3px rgba(240,165,0,0.12)` : error ? `0 0 0 3px rgba(239,68,68,0.1)` : "none",
        }}
      />
      {error && (
        <p style={{ color: C.danger, fontSize: "0.75rem", marginTop: "5px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// Simple password strength checker
function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Weak",    color: C.danger },
    { label: "Fair",    color: "#f97316" },
    { label: "Good",    color: "#eab308" },
    { label: "Strong",  color: C.success },
  ];
  const level = levels[score - 1] || levels[0];

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              backgroundColor: i < score ? level.color : C.border,
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: "0.7rem", color: level.color, fontWeight: 600 }}>
        {level.label} password
      </p>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm) errs.confirm = "Passwords don't match.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: C.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden md:flex"
        style={{
          width: "50%",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: C.surface,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid decoration */}
        <div
          style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 59px, ${C.amber} 59px, ${C.amber} 60px),
              repeating-linear-gradient(90deg, transparent, transparent 59px, ${C.amber} 59px, ${C.amber} 60px)
            `,
          }}
        />

        {/* Amber circle glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(240,165,0,0.15) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.75rem",
              fontWeight: 900,
              color: C.amber,
              letterSpacing: "-0.02em",
            }}
          >
            Inkwell
          </span>
        </div>

        {/* Steps */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.amber,
              marginBottom: "1.5rem",
            }}
          >
            Get started in 3 steps
          </p>

          {[
            { n: "01", title: "Create your account",   desc: "Pick a name, add your email, set a password." },
            { n: "02", title: "Write your first story", desc: "Use our clean editor to craft and publish." },
            { n: "03", title: "Grow your audience",     desc: "Get likes, comments, and track your views." },
          ].map((step) => (
            <div
              key={step.n}
              style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", marginBottom: "1.75rem" }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: C.amber,
                  opacity: 0.7,
                  paddingTop: "2px",
                  minWidth: "24px",
                }}
              >
                {step.n}
              </span>
              <div>
                <p style={{ fontWeight: 600, color: C.text, marginBottom: "4px", fontSize: "0.9rem" }}>
                  {step.title}
                </p>
                <p style={{ color: C.muted, fontSize: "0.8rem", lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.4,
            }}
          >
            Every great writer started with a single account.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Mobile logo */}
          <div className="md:hidden" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2.25rem",
                fontWeight: 900,
                color: C.amber,
              }}
            >
              Inkwell
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: C.text,
              marginBottom: "0.4rem",
            }}
          >
            Create your account
          </h2>
          <p style={{ color: C.muted, fontSize: "0.875rem", marginBottom: "2rem" }}>
            Join thousands of writers on Inkwell
          </p>

          {/* API Error */}
          {apiError && (
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(239,68,68,0.1)",
                color: C.danger,
                border: `1px solid rgba(239,68,68,0.3)`,
              }}
            >
              ⚠ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

            <InputField
              label="Full name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={set("name")}
              error={errors.name}
            />

            <InputField
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
            />

            <div>
              <InputField
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
              />
              <PasswordStrength password={form.password} />
            </div>

            <InputField
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
            />

            {/* Terms note */}
            <p style={{ fontSize: "0.75rem", color: C.muted, lineHeight: 1.6 }}>
              By creating an account you agree to our{" "}
              <span style={{ color: C.amber, cursor: "pointer" }}>Terms of Service</span>{" "}
              and{" "}
              <span style={{ color: C.amber, cursor: "pointer" }}>Privacy Policy</span>.
            </p>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                fontSize: "0.875rem",
                fontWeight: 600,
                backgroundColor: C.amber,
                color: "#0f1117",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "background-color 0.2s",
                marginTop: "4px",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = C.amberLt)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.amber)}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <svg
                    style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }}
                    fill="none" viewBox="0 0 24 24"
                  >
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p style={{ marginTop: "1.75rem", textAlign: "center", fontSize: "0.875rem", color: C.muted }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: C.amber, fontWeight: 500, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}