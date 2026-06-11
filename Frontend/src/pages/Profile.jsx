import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) { navigate("/login"); return; }

      const postsRes = await API.get("/posts");
      const myPosts = postsRes.data.filter(
        (post) => post.author?._id === userId
      );
      setUserPosts(myPosts);
      if (myPosts.length > 0) setUser(myPosts[0].author);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const totalViews = userPosts.reduce((sum, p) => sum + (p.views || 0), 0);

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

  const stats = [
    { icon: "📝", label: "Stories", value: userPosts.length },
    { icon: "❤️", label: "Total likes", value: totalLikes },
    { icon: "👁", label: "Total views", value: totalViews },
  ];

  return (
    <div className="min-h-screen py-10 px-6" style={{ backgroundColor: "var(--ink-bg)" }}>
      <div className="max-w-4xl mx-auto">

        {/* Profile card */}
        <div
          className="rounded-2xl p-8 mb-8 relative overflow-hidden"
          style={{
            backgroundColor: "var(--ink-surface)",
            border: "1px solid var(--ink-border)",
          }}
        >
          {/* Background accent */}
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
              <p className="text-sm mb-5" style={{ color: "var(--ink-muted)" }}>
                {user?.email}
              </p>

              {/* Stats */}
              <div className="flex gap-6 flex-wrap">
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
              className="px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0"
              style={{ backgroundColor: "var(--ink-amber)", color: "#0f1117" }}
            >
              + Write
            </Link>
          </div>
        </div>

        {/* Posts */}
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
          <div className="flex flex-col gap-4">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="post-card p-5 rounded-2xl flex gap-4 items-start"
                style={{
                  backgroundColor: "var(--ink-surface)",
                  border: "1px solid var(--ink-border)",
                }}
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-24 h-20 rounded-xl object-cover shrink-0 hidden sm:block"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-lg font-bold mb-1 leading-snug"
                    style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: "var(--ink-muted)" }}>
                    {post.content.substring(0, 100)}…
                  </p>

                  <div className="flex items-center gap-4 text-xs" style={{ color: "var(--ink-muted)" }}>
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>👁 {post.views || 0}</span>
                    <Link
                      to={`/post/${post._id}`}
                      className="ml-auto font-semibold text-xs uppercase tracking-wide"
                      style={{ color: "var(--ink-amber)" }}
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}