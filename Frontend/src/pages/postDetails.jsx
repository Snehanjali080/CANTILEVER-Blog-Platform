import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [progress, setProgress] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this post?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/posts/${post._id}`);

    alert("Post deleted successfully");

    window.location.href = "/";
  } catch (err) {
    console.log(err);
    alert("Failed to delete post");
  }
};
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts")) || [];
        if (!viewedPosts.includes(id)) {
          await API.put(`/posts/${id}/view`);
          viewedPosts.push(id);
          localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
        }
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await API.get(`/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadPost();
    fetchComments();
  }, [id]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      await API.post(`/comments/${id}`, { text: commentText });
      const res = await API.get(`/comments/${id}`);
      setComments(res.data);
      setCommentText("");
    } catch (err) {
      console.log(err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin w-10 h-10"
            style={{ color: "var(--ink-amber)" }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p style={{ color: "var(--ink-muted)" }} className="text-sm">Loading story…</p>
        </div>
      </div>
    );
  }

  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const currentUserId =
  localStorage.getItem("userId");

  return (
    <>
      {/* Reading progress bar */}
      <div
        id="reading-bar"
        style={{ width: `${progress}%` }}
      />

      <div className="min-h-screen py-10 px-6" style={{ backgroundColor: "var(--ink-bg)" }}>
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: "var(--ink-muted)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to stories
          </Link>

          {/* Cover image */}
          {post.image && (
            <div className="rounded-2xl overflow-hidden mb-10 h-80">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: "var(--ink-amber)", color: "#0f1117" }}
            >
              {post.author?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--ink-text)" }}>
                {post.author?.name || "Anonymous"}
              </p>
              <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
                {readTime} min read · {post.views || 0} views
              </p>
            </div>
            {post.author?._id === currentUserId && (
  <button
    onClick={handleDelete}
    className="bg-red-500 text-white px-4 py-2 rounded mb-4"
  >
    Delete Post
  </button>
)}
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-black leading-tight mb-8"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
          >
            {post.title}
          </h1>

          {/* Divider */}
          <div
            className="w-16 h-1 rounded mb-10"
            style={{ backgroundColor: "var(--ink-amber)" }}
          />

          {/* Content */}
          <div
            className="text-base leading-loose whitespace-pre-wrap mb-16"
            style={{ color: "var(--ink-text)", lineHeight: "1.9", letterSpacing: "0.01em" }}
          >
            {post.content}
          </div>

          {/* Stats footer */}
          <div
            className="flex items-center gap-6 py-6 mb-12"
            style={{ borderTop: "1px solid var(--ink-border)", borderBottom: "1px solid var(--ink-border)" }}
          >
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-muted)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views || 0} views
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-muted)" }}>
              <span>❤️</span>
              {post.likes?.length || 0} likes
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-muted)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {comments.length} comments
            </div>
            {currentUserId === post.author?._id && (
  <button
    onClick={() =>
      navigate(`/edit/${post._id}`)
    }
    className="bg-yellow-500 text-white px-4 py-2 rounded"
  >
    ✏️ Edit Post
  </button>
)}
          </div>

          {/* Comments section */}
          <section>
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
            >
              Discussion ({comments.length})
            </h2>

            {/* Add comment */}
            <div
              className="p-5 rounded-2xl mb-8"
              style={{
                backgroundColor: "var(--ink-surface)",
                border: "1px solid var(--ink-border)",
              }}
            >
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts…"
                rows={3}
                className="ink-input w-full px-4 py-3 rounded-xl text-sm resize-none mb-3 transition-all"
                style={{
                  backgroundColor: "var(--ink-surface2)",
                  border: "1px solid var(--ink-border)",
                  color: "var(--ink-text)",
                }}
              />
              <button
                onClick={addComment}
                disabled={commentLoading || !commentText.trim()}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: "var(--ink-amber)",
                  color: "#0f1117",
                  opacity: commentLoading || !commentText.trim() ? 0.6 : 1,
                }}
              >
                {commentLoading ? "Posting…" : "Post comment"}
              </button>
            </div>

            {/* Comment list */}
            <div className="flex flex-col gap-4">
              {comments.length === 0 ? (
                <p className="text-center py-10 text-sm" style={{ color: "var(--ink-muted)" }}>
                  Be the first to comment on this story.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="p-5 rounded-2xl"
                    style={{
                      backgroundColor: "var(--ink-surface)",
                      border: "1px solid var(--ink-border)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: "var(--ink-amber)", color: "#0f1117" }}
                      >
                        {comment.user?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "var(--ink-text)" }}>
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
          </section>
        </div>
      </div>
    </>
  );
}