import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const typeIcon = (msg = "") => {
    if (msg.toLowerCase().includes("like")) return "❤️";
    if (msg.toLowerCase().includes("comment")) return "💬";
    if (msg.toLowerCase().includes("follow")) return "👤";
    return "🔔";
  };

  return (
    <div className="min-h-screen py-10 px-6" style={{ backgroundColor: "var(--ink-bg)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "var(--ink-amber)" }}
          >
            Activity
          </p>
          <h1
            className="text-4xl font-black"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
          >
            Notifications
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin w-8 h-8" style={{ color: "var(--ink-amber)" }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : notifications.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ backgroundColor: "var(--ink-surface)", border: "1px solid var(--ink-border)" }}
          >
            <div className="text-5xl mb-4">🔕</div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
            >
              All caught up
            </h2>
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
              No notifications yet. Start writing to get some!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="flex items-start gap-4 p-5 rounded-2xl transition-all"
                style={{
                  backgroundColor: "var(--ink-surface)",
                  border: "1px solid var(--ink-border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: "var(--ink-surface2)" }}
                >
                  {typeIcon(n.message)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm mb-1" style={{ color: "var(--ink-text)" }}>
                    {n.message}
                  </p>
                  <p
                    className="text-xs font-mono"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}