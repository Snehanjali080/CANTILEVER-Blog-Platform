import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";


export default function Profile() {
  const [user, setUser]           = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleteId, setDeleteId]   = useState(null); // post being confirmed for delete
  const [deleting, setDeleting]   = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }

    
      const [profileRes, postsRes] = await Promise.all([
        API.get("/users/profile"),
        API.get("/users/my-posts"),
      ]);

      setUser(profileRes.data.user);
      setUserPosts(postsRes.data);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleDelete = async (postId) => {
    setDeleting(true);
    try {
      await API.delete(`/posts/admin/${postId}`);
      setUserPosts((prev) => prev.filter((p) => p._id !== postId));
      setDeleteId(null);
    } catch (err) {
      // Non-admin users can't use /admin/:id — try owner delete if you add that route
      console.log(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const totalViews = userPosts.reduce((sum, p) => sum + (p.views || 0), 0);

  const stats = [
    { label: "Stories",     value: userPosts.length },
    { label: "Total likes", value: totalLikes },
    { label: "Total views", value: totalViews },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin w-10 h-10" style={{ color: "var(--ink-amber)" }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6" style={{ backgroundColor: "var(--ink-bg)" }}>
      <div className="max-w-4xl mx-auto">

        {/* ── Profile card ── */}
        <div
          className="rounded-2xl p-8 mb-8 relative overflow-hidden"
          style={{ backgroundColor: "var(--ink-surface)", border: "1px solid var(--ink-border)" }}
        >
          {/* Amber glow */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"
            style={{ backgroundColor: "var(--ink-amber)" }}
          />

          <div className="relative flex items-start gap-6 flex-wrap">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0"
              style={{ backgroundColor: "var(--ink-amber)", color: "#0f1117", fontFamily: "'Playfair Display', serif" }}
            >
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>

            <div className="flex-1 min-w-0">
              <h1
                className="text-3xl font-black mb-1"
                style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
              >
                {user?.name || "Writer"}
              </h1>
              <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
                {user?.email}
              </p>

              {/* Stats row */}
              <div className="flex gap-8 flex-wrap">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-bold" style={{ color: "var(--ink-amber)" }}>
                      {s.value}
                    </div>
                    <div className="text-xs uppercase tracking-widest mt-0.5" style={{ color: "var(--ink-muted)" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/create"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-colors"
              style={{ backgroundColor: "var(--ink-amber)", color: "#0f1117" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fbbf24")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--ink-amber)")}
            >
              + Write
            </Link>
          </div>
        </div>

        {/* ── My Stories header ── */}
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
          >
            My Stories
          </h2>
          <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
            {userPosts.length} {userPosts.length === 1 ? "story" : "stories"}
          </span>
        </div>

        {/* ── Empty state ── */}
        {userPosts.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ backgroundColor: "var(--ink-surface)", border: "1px solid var(--ink-border)" }}
          >
            <div className="text-5xl mb-4">✍️</div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
            >
              Nothing published yet
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
              Your stories will appear here once you write them.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "var(--ink-amber)", color: "#0f1117" }}
            >
              Write your first story
            </Link>
          </div>
        ) : (
          // ── Post list ──
          <div className="flex flex-col gap-4">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="post-card rounded-2xl flex gap-4 items-start p-5"
                style={{ backgroundColor: "var(--ink-surface)", border: "1px solid var(--ink-border)" }}
              >
                {/* Thumbnail */}
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-24 h-20 rounded-xl object-cover shrink-0 hidden sm:block"
                  />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-lg font-bold mb-1 leading-snug"
                    style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: "var(--ink-muted)" }}>
                    {post.content?.substring(0, 100)}…
                  </p>

                  <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: "var(--ink-muted)" }}>
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>👁 {post.views || 0}</span>

                    <div className="ml-auto flex items-center gap-3">
                      <Link
                        to={`/post/${post._id}`}
                        className="font-semibold uppercase tracking-wide"
                        style={{ color: "var(--ink-amber)" }}
                      >
                        Read →
                      </Link>

                      {/* Delete button */}
                      <button
                        onClick={() => setDeleteId(post._id)}
                        className="flex items-center gap-1 font-semibold uppercase tracking-wide cursor-pointer transition-colors"
                        style={{ color: "var(--ink-muted)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-muted)")}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Delete confirm modal ── */}
      {deleteId && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(15,17,23,0.75)", backdropFilter: "blur(3px)" }}
            onClick={() => !deleting && setDeleteId(null)}
          />

          {/* Modal */}
          <div
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl p-7"
            style={{ backgroundColor: "var(--ink-surface)", border: "1px solid var(--ink-border)" }}
          >
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: "rgba(239,68,68,0.12)" }}
            >
              <svg className="w-7 h-7" style={{ color: "#ef4444" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3
              className="text-xl font-bold text-center mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
            >
              Delete this story?
            </h3>
            <p className="text-sm text-center mb-7" style={{ color: "var(--ink-muted)" }}>
              This action is permanent and cannot be undone. All comments and likes will be lost.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
                style={{
                  backgroundColor: "var(--ink-surface2)",
                  border: "1px solid var(--ink-border)",
                  color: "var(--ink-muted)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
                style={{
                  backgroundColor: deleting ? "rgba(239,68,68,0.5)" : "#ef4444",
                  color: "#fff",
                }}
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Deleting…
                  </span>
                ) : "Yes, delete"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}