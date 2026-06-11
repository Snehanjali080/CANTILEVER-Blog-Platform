import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/create", label: "Write" },
    { to: "/profile", label: "Profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        backgroundColor: "var(--ink-surface)",
        borderBottom: "1px solid var(--ink-border)",
      }}
      className="sticky top-0 z-50"
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className="text-2xl font-black tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--ink-amber)",
            }}
          >
            Inkwell
          </span>
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: "var(--ink-border)",
              color: "var(--ink-muted)",
            }}
          >
            BLOG
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                color: isActive(link.to)
                  ? "var(--ink-amber)"
                  : "var(--ink-muted)",
                backgroundColor: isActive(link.to)
                  ? "rgba(240,165,0,0.1)"
                  : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: "var(--ink-muted)" }}
            title="Notifications"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </Link>

          <div
            style={{ width: "1px", height: "20px", backgroundColor: "var(--ink-border)" }}
            className="mx-2"
          />

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
            style={{
              color: "var(--ink-danger)",
              border: "1px solid var(--ink-danger)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Log out
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          style={{ color: "var(--ink-muted)" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: "var(--ink-surface)",
            borderTop: "1px solid var(--ink-border)",
          }}
          className="md:hidden px-6 py-4 flex flex-col gap-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium"
              style={{
                color: isActive(link.to) ? "var(--ink-amber)" : "var(--ink-muted)",
                backgroundColor: isActive(link.to) ? "rgba(240,165,0,0.1)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/notifications"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 rounded-lg text-sm font-medium"
            style={{ color: "var(--ink-muted)" }}
          >
            Notifications
          </Link>
          <button
            onClick={logout}
            className="mt-2 px-4 py-3 rounded-lg text-sm font-medium text-left"
            style={{ color: "var(--ink-danger)", border: "1px solid var(--ink-danger)" }}
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}