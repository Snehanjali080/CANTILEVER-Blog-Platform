import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

// ─── PostCard ────────────────────────────────────────────────────────────────
function PostCard({ post, onLike, onOpenComments, currentUserId }) {
  const isLiked = post.likes?.some((id) => id.toString() === currentUserId);

  return (
    <article
      className="post-card rounded-2xl overflow-hidden flex flex-col"
      style={{ backgroundColor: "var(--ink-surface)", border: "1px solid var(--ink-border)" }}
    >
      {post.image ? (
        <div className="relative overflow-hidden h-48">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(15,17,23,0.8) 0%, transparent 55%)" }}
          />
        </div>
      ) : (
        <div
          className="h-28 flex items-center justify-center text-5xl"
          style={{ backgroundColor: "var(--ink-surface2)" }}
        >
          ✍️
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h2
          className="text-lg font-bold mb-2 leading-snug line-clamp-2"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
        >
          {post.title}
        </h2>

        <p className="text-sm leading-relaxed mb-4 line-clamp-2 flex-1" style={{ color: "var(--ink-muted)" }}>
          {post.content.substring(0, 120)}…
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: "var(--ink-amber)", color: "#0f1117" }}
          >
            {post.author?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <span className="text-xs truncate" style={{ color: "var(--ink-muted)" }}>
            {post.author?.name || "Anonymous"}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid var(--ink-border)" }}>
          <button
            onClick={() => onLike(post._id)}
            className="flex items-center gap-1 text-sm cursor-pointer group"
            style={{ color: isLiked ? "#ef4444" : "var(--ink-muted)" }}
          >
            <span className="transition-transform group-hover:scale-125">{isLiked ? "❤️" : "🤍"}</span>
            <span className="font-medium text-xs">{post.likes?.length || 0}</span>
          </button>

          <button
            onClick={() => onOpenComments(post._id)}
            className="flex items-center gap-1 text-xs cursor-pointer"
            style={{ color: "var(--ink-muted)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-medium">Comments</span>
          </button>

          <Link
            to={`/post/${post._id}`}
            className="ml-auto flex items-center gap-1 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--ink-amber)" }}
          >
            Read
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── TrendingCard ─────────────────────────────────────────────────────────────
function TrendingCard({ post, rank }) {
  const medalColors = ["#f0a500", "#94a3b8", "#cd7f32"];
  const rankColor = rank <= 3 ? medalColors[rank - 1] : "var(--ink-muted)";

  return (
    <Link
      to={`/post/${post._id}`}
      className="flex gap-3 items-start group p-3 rounded-xl transition-all"
      style={{ textDecoration: "none" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--ink-surface2)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {/* Rank badge */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
        style={{ backgroundColor: rank <= 3 ? `${rankColor}20` : "var(--ink-surface2)", color: rankColor }}
      >
        {rank}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold leading-snug line-clamp-2 mb-1 transition-colors group-hover:text-amber-400"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
        >
          {post.title}
        </p>
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--ink-muted)" }}>
          <span>❤️ {post.likes?.length || 0}</span>
          <span>👁 {post.views || 0}</span>
        </div>
      </div>

      {/* Thumbnail */}
      {post.image && (
        <img
          src={post.image}
          alt=""
          className="w-12 h-12 rounded-lg object-cover shrink-0"
        />
      )}
    </Link>
  );
}

// ─── Home ────────────────────────────────────────────────────────────────────
export default function Home() {
  const [posts, setPosts]               = useState([]);
  const [trending, setTrending]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [search, setSearch]             = useState("");
  const [searching, setSearching]       = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments]         = useState([]);
  const [commentText, setCommentText]   = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  // ── fetch all / search posts ──
  const fetchPosts = useCallback(async (query = "") => {
    query ? setSearching(true) : setLoading(true);
    try {
      const url = query ? `/posts?search=${encodeURIComponent(query)}` : "/posts";
      const res = await API.get(url);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  // ── fetch trending ──
  const fetchTrending = async () => {
    try {
      const res = await API.get("/posts/trending");
      setTrending(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setTrendingLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchTrending();
  }, []);

  // ── debounced search ──
  useEffect(() => {
    const t = setTimeout(() => fetchPosts(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const openComments = async (postId) => {
    try {
      const res = await API.get(`/comments/${postId}`);
      setComments(res.data);
      setSelectedPost(postId);
    } catch (err) { console.log(err); }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      await API.post(`/comments/${selectedPost}`, { text: commentText });
      const res = await API.get(`/comments/${selectedPost}`);
      setComments(res.data);
      setCommentText("");
    } catch (err) { console.log(err); }
    finally { setCommentLoading(false); }
  };

  const handleLike = async (postId) => {
    try {
      await API.put(`/posts/${postId}/like`);
      fetchPosts(search);
    } catch (err) { console.log(err); }
  };

  // ─── Spinner ───
  const Spinner = () => (
    <svg className="animate-spin w-6 h-6" style={{ color: "var(--ink-amber)" }} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <svg className="animate-spin w-10 h-10" style={{ color: "var(--ink-amber)" }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p style={{ color: "var(--ink-muted)" }} className="text-sm">Loading stories…</p>
      </div>
    );
  }

  return (
    <>
      {/* ── HERO + SEARCH ── */}
      <div style={{ borderBottom: "1px solid var(--ink-border)" }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--ink-amber)" }}>
            Latest stories
          </p>
          <h1
            className="text-4xl md:text-5xl font-black leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
          >
            What's on your mind?
          </h1>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--ink-muted)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories by title…"
              className="ink-input w-full pl-11 pr-12 py-3 rounded-xl text-sm"
              style={{
                backgroundColor: "var(--ink-surface)",
                border: "1px solid var(--ink-border)",
                color: "var(--ink-text)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded cursor-pointer"
                style={{ color: "var(--ink-muted)" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search result hint */}
          {search && (
            <p className="mt-3 text-sm" style={{ color: "var(--ink-muted)" }}>
              {searching
                ? "Searching…"
                : `${posts.length} result${posts.length !== 1 ? "s" : ""} for "${search}"`}
            </p>
          )}
        </div>
      </div>

      {/* ── MAIN LAYOUT: posts + trending sidebar ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">

          {/* ── LEFT: posts grid ── */}
          <main className="flex-1 min-w-0">
            {searching ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-5xl mb-4">{search ? "🔍" : "📭"}</div>
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
                >
                  {search ? "No results found" : "No stories yet"}
                </h2>
                <p className="mb-6 text-sm" style={{ color: "var(--ink-muted)" }}>
                  {search ? `Nothing matched "${search}". Try a different keyword.` : "Be the first to write something."}
                </p>
                {!search && (
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                    style={{ backgroundColor: "var(--ink-amber)", color: "#0f1117" }}
                  >
                    Write a story
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUserId={currentUserId}
                    onLike={handleLike}
                    onOpenComments={openComments}
                  />
                ))}
              </div>
            )}
          </main>

          {/* ── RIGHT: trending sidebar ── */}
          <aside
            className="hidden lg:block w-80 shrink-0 sticky top-20"
            style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "var(--ink-surface)", border: "1px solid var(--ink-border)" }}
            >
              {/* Sidebar header */}
              <div
                className="px-5 py-4 flex items-center gap-2"
                style={{ borderBottom: "1px solid var(--ink-border)" }}
              >
                <span className="text-lg">🔥</span>
                <h2
                  className="font-bold text-base"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
                >
                  Trending
                </h2>
                <span
                  className="ml-auto text-xs font-mono px-2 py-0.5 rounded"
                  style={{ backgroundColor: "var(--ink-surface2)", color: "var(--ink-muted)" }}
                >
                  Top 10
                </span>
              </div>

              {/* Trending list */}
              <div className="p-3">
                {trendingLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner />
                  </div>
                ) : trending.length === 0 ? (
                  <p className="text-center py-8 text-sm" style={{ color: "var(--ink-muted)" }}>
                    No trending posts yet
                  </p>
                ) : (
                  trending.map((post, i) => (
                    <TrendingCard key={post._id} post={post} rank={i + 1} />
                  ))
                )}
              </div>

              {/* Footer CTA */}
              <div
                className="px-5 py-4"
                style={{ borderTop: "1px solid var(--ink-border)" }}
              >
                <Link
                  to="/create"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ backgroundColor: "var(--ink-amber)", color: "#0f1117" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fbbf24")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--ink-amber)")}
                >
                  ✍️ Write a story
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ── MOBILE trending strip (below posts on small screens) ── */}
        <div className="lg:hidden mt-10">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--ink-surface)", border: "1px solid var(--ink-border)" }}
          >
            <div
              className="px-5 py-4 flex items-center gap-2"
              style={{ borderBottom: "1px solid var(--ink-border)" }}
            >
              <span className="text-lg">🔥</span>
              <h2
                className="font-bold text-base"
                style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
              >
                Trending Stories
              </h2>
            </div>
            <div className="p-3 grid sm:grid-cols-2 gap-1">
              {trendingLoading ? (
                <div className="flex justify-center py-8 col-span-2"><Spinner /></div>
              ) : (
                trending.slice(0, 6).map((post, i) => (
                  <TrendingCard key={post._id} post={post} rank={i + 1} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── COMMENT SIDE PANEL ── */}
      {selectedPost && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(15,17,23,0.6)", backdropFilter: "blur(2px)" }}
            onClick={() => setSelectedPost(null)}
          />
          <div
            className="comment-panel fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col"
            style={{ backgroundColor: "var(--ink-surface)", borderLeft: "1px solid var(--ink-border)" }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid var(--ink-border)" }}
            >
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
              >
                Comments
              </h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-lg cursor-pointer"
                style={{ color: "var(--ink-muted)" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {comments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
                    No comments yet. Start the conversation!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: "var(--ink-surface2)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: "var(--ink-amber)", color: "#0f1117" }}
                      >
                        {comment.user?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--ink-text)" }}>
                        {comment.user?.name || "Anonymous"}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-4" style={{ borderTop: "1px solid var(--ink-border)" }}>
              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment()}
                  placeholder="Add a comment…"
                  className="ink-input flex-1 px-4 py-2.5 rounded-xl text-sm"
                  style={{
                    backgroundColor: "var(--ink-surface2)",
                    border: "1px solid var(--ink-border)",
                    color: "var(--ink-text)",
                  }}
                />
                <button
                  onClick={addComment}
                  disabled={commentLoading || !commentText.trim()}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{
                    backgroundColor: "var(--ink-amber)",
                    color: "#0f1117",
                    opacity: commentLoading || !commentText.trim() ? 0.6 : 1,
                  }}
                >
                  {commentLoading ? "…" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}