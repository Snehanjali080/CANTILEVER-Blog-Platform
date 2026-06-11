import { useEffect, useState } from "react";
import API from "../api/axios";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const addComment = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await API.post(`/comments/${postId}`, { text });
      setText("");
      fetchComments();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3
        className="text-xl font-bold mb-5"
        style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
      >
        Comments ({comments.length})
      </h3>

      {/* Input */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Write a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addComment() }

          className="ink-input flex-1 px-4 py-3 rounded-xl text-sm transition-all"
          style={{
            backgroundColor: "var(--ink-surface)",
            border: "1px solid var(--ink-border)",
            color: "var(--ink-text)",
          }}
        />
        <button
          onClick={addComment}
          disabled={loading || !text.trim()}
          className="px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer"
          style={{
            backgroundColor: "var(--ink-amber)",
            color: "#0f1117",
            opacity: loading || !text.trim() ? 0.6 : 1,
          }}
        >
          {loading ? "…" : "Post"}
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="p-4 rounded-xl"
            style={{ backgroundColor: "var(--ink-surface)", border: "1px solid var(--ink-border)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
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
        ))}
      </div>
    </div>
  );
}