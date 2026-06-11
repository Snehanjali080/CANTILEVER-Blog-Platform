import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--ink-bg)" }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden"
        style={{ backgroundColor: "var(--ink-surface)" }}
      >
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 60px, var(--ink-amber) 60px, var(--ink-amber) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, var(--ink-amber) 60px, var(--ink-amber) 61px)",
          }}
        />

        <div className="relative z-10">
          <span
            className="text-3xl font-black"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-amber)" }}
          >
            Inkwell
          </span>
        </div>

        <div className="relative z-10">
          <blockquote
            className="text-5xl font-black leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
          >
            "Write to be understood, speak to be heard, read to grow."
          </blockquote>
          <p style={{ color: "var(--ink-muted)" }} className="text-sm font-medium tracking-widest uppercase">
            — Lawrence Clark Powell
          </p>
        </div>

        <div className="relative z-10 flex gap-8" style={{ color: "var(--ink-muted)" }}>
          <div>
            <div className="text-2xl font-bold" style={{ color: "var(--ink-amber)" }}>10K+</div>
            <div className="text-xs uppercase tracking-widest">Writers</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: "var(--ink-amber)" }}>50K+</div>
            <div className="text-xs uppercase tracking-widest">Stories</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: "var(--ink-amber)" }}>2M+</div>
            <div className="text-xs uppercase tracking-widest">Readers</div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <span
              className="text-4xl font-black"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-amber)" }}
            >
              Inkwell
            </span>
          </div>

          <h2
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
          >
            Welcome back
          </h2>
          <p className="mb-8 text-sm" style={{ color: "var(--ink-muted)" }}>
            Sign in to continue your story
          </p>

          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
              style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label
                className="block text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: "var(--ink-muted)" }}
              >
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="ink-input w-full px-4 py-3 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: "var(--ink-surface)",
                  border: "1px solid var(--ink-border)",
                  color: "var(--ink-text)",
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: "var(--ink-muted)" }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="ink-input w-full px-4 py-3 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: "var(--ink-surface)",
                  border: "1px solid var(--ink-border)",
                  color: "var(--ink-text)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer mt-2"
              style={{
                backgroundColor: "var(--ink-amber)",
                color: "#0f1117",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "var(--ink-amber-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--ink-amber)")}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: "var(--ink-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--ink-amber)" }} className="font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}