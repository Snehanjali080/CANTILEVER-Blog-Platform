import { useState, useRef } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle]     = useState("");
  const [content, setContent] = useState("");
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ── Image handling ──────────────────────────────────────────────────────────
  const applyFile = (file) => {
    if (!file) return;
    // Validate type
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Please upload a JPG, PNG, WebP, or GIF image.");
      return;
    }
    // Validate size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10 MB.");
      return;
    }
    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleFileInput = (e) => applyFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) { setError("Title is required."); return; }
    if (!content.trim()) { setError("Content is required."); return; }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    if (image) formData.append("image", image);

    try {
       //
      await API.post("/posts", formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime  = Math.max(1, Math.ceil(wordCount / 200));

  // ── Styles (hardcoded so CSS vars don't break) ──────────────────────────────
  const S = {
    bg:       "#0f1117",
    surface:  "#181c26",
    surface2: "#1f2437",
    border:   "#2a2f42",
    amber:    "#f0a500",
    amberLt:  "#fbbf24",
    text:     "#e8e9ed",
    muted:    "#8b90a0",
    danger:   "#ef4444",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: S.bg, padding: "40px 24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "32px" }}>
          <Link
            to="/"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: S.muted, fontSize: "0.8rem", textDecoration: "none", marginBottom: "16px" }}
          >
            <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: S.amber, marginBottom: "6px" }}>
            New story
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem", fontWeight: 900, color: S.text, margin: 0 }}>
            Write something great
          </h1>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div style={{
            marginBottom: "24px", padding: "12px 16px", borderRadius: "10px",
            fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px",
            backgroundColor: "rgba(239,68,68,0.1)", color: S.danger,
            border: "1px solid rgba(239,68,68,0.3)",
          }}>
            <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* ── Cover image ── */}
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: S.muted, marginBottom: "10px" }}>
              Cover image <span style={{ color: S.border, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </p>

            {/* Preview */}
            {preview ? (
              <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", height: "240px" }}>
                <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {/* Dark overlay at top */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,17,23,0.4) 0%, transparent 40%)" }} />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: "absolute", top: "12px", right: "12px",
                    padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem",
                    fontWeight: 600, cursor: "pointer", border: "none",
                    backgroundColor: "rgba(15,17,23,0.85)", color: S.text,
                    display: "flex", alignItems: "center", gap: "4px",
                  }}
                >
                  <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Remove
                </button>
                <div style={{ position: "absolute", bottom: "12px", left: "12px", fontSize: "0.7rem", color: "rgba(232,233,237,0.7)" }}>
                  {image?.name}
                </div>
              </div>
            ) : (
              //
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  height: "176px", borderRadius: "16px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  border: `2px dashed ${dragOver ? S.amber : S.border}`,
                  backgroundColor: dragOver ? "rgba(240,165,0,0.05)" : S.surface,
                  transition: "border-color 0.2s, background-color 0.2s",
                }}
              >
                <svg style={{ width: 40, height: 40, color: S.muted, marginBottom: "10px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p style={{ fontSize: "0.875rem", color: S.muted, marginBottom: "4px" }}>
                  Click or drag & drop to upload
                </p>
                <p style={{ fontSize: "0.75rem", color: S.border }}>
                  JPG, PNG, WebP — max 10 MB
                </p>
              </div>
            )}

            {/* Hidden file input triggered by ref */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={handleFileInput}
            />
          </div>

          {/* ── Title ── */}
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: S.muted, marginBottom: "10px" }}>
              Title
            </p>
            <input
              type="text"
              placeholder="Give your story a title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%", padding: "16px 20px", borderRadius: "12px",
                fontSize: "1.25rem", fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                backgroundColor: S.surface,
                border: `1px solid ${S.border}`,
                color: S.text, outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = S.amber; e.target.style.boxShadow = "0 0 0 3px rgba(240,165,0,0.12)"; }}
              onBlur={(e)  => { e.target.style.borderColor = S.border; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* ── Content ── */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: S.muted }}>
                Content
              </p>
              <span style={{ fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", color: S.muted }}>
                {wordCount} words · {readTime} min read
              </span>
            </div>
            <textarea
              placeholder="Tell your story…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={18}
              style={{
                width: "100%", padding: "16px 20px", borderRadius: "12px",
                fontSize: "0.9rem", lineHeight: "1.9", resize: "vertical",
                backgroundColor: S.surface,
                border: `1px solid ${S.border}`,
                color: S.text, outline: "none", boxSizing: "border-box",
                fontFamily: "'Inter', sans-serif",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = S.amber; e.target.style.boxShadow = "0 0 0 3px rgba(240,165,0,0.12)"; }}
              onBlur={(e)  => { e.target.style.borderColor = S.border; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* ── Action buttons ── */}
          <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, padding: "14px", borderRadius: "12px",
                fontSize: "0.875rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                //
                backgroundColor: S.amber,
                color: "#0f1117", border: "none",
                opacity: loading ? 0.7 : 1,
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = S.amberLt)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = S.amber)}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <svg style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Publishing…
                </span>
              ) : (
                "Publish story ✦"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                padding: "14px 28px", borderRadius: "12px",
                fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                backgroundColor: S.surface,
                border: `1px solid ${S.border}`,
                color: S.muted,
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = S.muted; e.currentTarget.style.color = S.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.color = S.muted; }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}