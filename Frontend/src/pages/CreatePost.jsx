import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen py-10 px-6" style={{ backgroundColor: "var(--ink-bg)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "var(--ink-amber)" }}
          >
            New story
          </p>
          <h1
            className="text-4xl font-black"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--ink-text)" }}
          >
            Write something great
          </h1>
        </div>

        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
            style={{
              backgroundColor: "rgba(239,68,68,0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Cover Image */}
          <div>
            <label
              className="block text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "var(--ink-muted)" }}
            >
              Cover image
            </label>

            {preview ? (
              <div className="relative rounded-2xl overflow-hidden h-60">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-3 right-3 p-2 rounded-full text-white text-xs"
                  style={{ backgroundColor: "rgba(15,17,23,0.8)" }}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <label
                className="flex flex-col items-center justify-center h-44 rounded-2xl cursor-pointer transition-all"
                style={{
                  border: "2px dashed var(--ink-border)",
                  backgroundColor: "var(--ink-surface)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink-amber)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--ink-border)")}
              >
                <svg
                  className="w-10 h-10 mb-3"
                  style={{ color: "var(--ink-muted)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
                  Click to upload a cover image
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--ink-border)" }}>
                  PNG, JPG, WebP up to 10MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
            )}
          </div>

          {/* Title */}
          <div>
            <label
              className="block text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "var(--ink-muted)" }}
            >
              Title
            </label>
            <input
              type="text"
              placeholder="Give your story a title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="ink-input w-full px-5 py-4 rounded-xl text-xl font-bold transition-all"
              style={{
                backgroundColor: "var(--ink-surface)",
                border: "1px solid var(--ink-border)",
                color: "var(--ink-text)",
                fontFamily: "'Playfair Display', serif",
              }}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "var(--ink-muted)" }}
              >
                Content
              </label>
              <span
                className="text-xs font-mono"
                style={{ color: "var(--ink-muted)" }}
              >
                {wordCount} words · {readTime} min read
              </span>
            </div>
            <textarea
              placeholder="Tell your story…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={16}
              className="ink-input w-full px-5 py-4 rounded-xl text-sm leading-relaxed resize-none transition-all"
              style={{
                backgroundColor: "var(--ink-surface)",
                border: "1px solid var(--ink-border)",
                color: "var(--ink-text)",
                lineHeight: "1.9",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
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
                  Publishing…
                </span>
              ) : (
                "Publish story"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              style={{
                backgroundColor: "var(--ink-surface)",
                border: "1px solid var(--ink-border)",
                color: "var(--ink-muted)",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}