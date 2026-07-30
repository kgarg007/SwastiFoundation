import { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";

const CANONICAL_SLUGS = [
  "privacy-policy",
  "terms-and-conditions",
  "donation-refund-policy",
  "disclaimer",
  "contact"
];

export default function CmsManager() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "published"
  });

  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchPages();
  }, []);

  // Initialize editor content when modal opens
  useEffect(() => {
    if (isModalOpen && editorRef.current) {
      if (editorRef.current.innerHTML !== formData.content) {
        editorRef.current.innerHTML = formData.content || "<p><br></p>";
      }
    }
  }, [isModalOpen, selectedPage]);

  async function fetchPages() {
    setLoading(true);
    setErrorMsg("");
    try {
      let data;
      try {
        data = await api.get("/cms/admin/all");
      } catch (e) {
        data = await api.get("/cms/admin");
      }

      // Deduplicate by canonical slug map to guarantee strictly 5 canonical rows
      const canonicalPagesMap = new Map();
      if (Array.isArray(data)) {
        data.forEach((p) => {
          let slugKey = p.slug ? p.slug.toLowerCase().trim() : "";
          if (slugKey === "terms") slugKey = "terms-and-conditions";
          if (slugKey === "refund-policy") slugKey = "donation-refund-policy";

          if (CANONICAL_SLUGS.includes(slugKey)) {
            if (!canonicalPagesMap.has(slugKey)) {
              canonicalPagesMap.set(slugKey, { ...p, slug: slugKey });
            }
          }
        });
      }

      const uniqueCanonicalPages = Array.from(canonicalPagesMap.values());
      setPages(uniqueCanonicalPages);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load pages.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenEdit(page) {
    setSelectedPage(page);
    setFormData({
      title: page.title || "",
      slug: page.slug || "",
      content: page.content || "",
      status: page.status || "published"
    });
    setIsModalOpen(true);
    setErrorMsg("");
  }

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 4000);
  }

  function handleEditorInput(e) {
    const html = e.currentTarget.innerHTML;
    setFormData((prev) => ({
      ...prev,
      content: html
    }));
  }

  function handleFormatCommand(command, value = null) {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    if (command === "createLink") {
      const url = prompt("Enter link URL (e.g. https://example.org):");
      if (url) {
        document.execCommand("createLink", false, url);
      }
    } else {
      document.execCommand(command, false, value);
    }

    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setFormData((prev) => ({
        ...prev,
        content: html
      }));
    }
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    let currentContent = formData.content;
    if (editorRef.current) {
      currentContent = editorRef.current.innerHTML;
    }

    const dataToSave = {
      ...formData,
      content: currentContent
    };

    try {
      if (selectedPage && selectedPage._id) {
        await api.put(`/cms/admin/${selectedPage._id}`, dataToSave);
      }
      setIsModalOpen(false);
      await fetchPages();
      showToast("Page updated successfully.");
    } catch (err) {
      setErrorMsg(err.message || "Failed to save page.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cms-manager" style={{ fontFamily: "var(--admin-font, 'Inter', system-ui, sans-serif)" }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#10b981",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
            fontSize: "14px",
            fontWeight: 600,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>✅</span> {toastMsg}
        </div>
      )}

      {/* Admin Section Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", color: "var(--admin-text, #f8fafc)", fontWeight: 700 }}>
          Legal & Informational Pages
        </h2>
        <p style={{ color: "var(--admin-text-muted, #94a3b8)", margin: 0, fontSize: "14px" }}>
          Edit website policies and Razorpay required documents.
        </p>
      </div>

      {errorMsg && !isModalOpen && (
        <div className="admin-alert admin-alert--danger" style={{ marginBottom: "16px" }}>
          {errorMsg}
        </div>
      )}

      {/* Table Card (Dark Navy Theme) */}
      <div
        className="admin-card"
        style={{
          background: "var(--admin-card-bg, rgba(30, 41, 59, 0.7))",
          borderRadius: "12px",
          border: "1px solid var(--admin-border, rgba(255, 255, 255, 0.08))",
          backdropFilter: "blur(16px)"
        }}
      >
        {loading && !pages.length ? (
          <p style={{ padding: "30px", textAlign: "center", color: "var(--admin-text-muted, #94a3b8)" }}>
            Loading pages...
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "rgba(15, 23, 42, 0.4)",
                    textAlign: "left",
                    color: "var(--admin-text-muted, #94a3b8)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  <th style={{ padding: "14px 16px", borderBottom: "1px solid var(--admin-border, rgba(255, 255, 255, 0.08))" }}>
                    Page Name
                  </th>
                  <th style={{ padding: "14px 16px", borderBottom: "1px solid var(--admin-border, rgba(255, 255, 255, 0.08))" }}>
                    Status
                  </th>
                  <th style={{ padding: "14px 16px", borderBottom: "1px solid var(--admin-border, rgba(255, 255, 255, 0.08))" }}>
                    Last Updated
                  </th>
                  <th style={{ padding: "14px 16px", borderBottom: "1px solid var(--admin-border, rgba(255, 255, 255, 0.08))", textAlign: "right" }}>
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page._id} style={{ borderBottom: "1px solid var(--admin-border, rgba(255, 255, 255, 0.08))" }}>
                    <td style={{ padding: "16px" }}>
                      <strong style={{ fontSize: "14px", color: "var(--admin-text, #f8fafc)" }}>{page.title}</strong>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontWeight: 600,
                          display: "inline-block",
                          background: page.status === "published" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          color: page.status === "published" ? "#34d399" : "#fbbf24",
                          border: `1px solid ${page.status === "published" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`
                        }}
                      >
                        {page.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ padding: "16px", fontSize: "13px", color: "var(--admin-text-muted, #94a3b8)" }}>
                      {new Date(page.updatedAt || page.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <button
                        className="admin-btn"
                        style={{
                          padding: "6px 14px",
                          fontSize: "13px",
                          fontWeight: 500,
                          background: "var(--admin-edit, #3b82f6)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                        onClick={() => handleOpenEdit(page)}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Centered Modal Editor (Dark Navy Theme Matching Admin Dashboard) */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              height: "80vh",
              maxHeight: "850px",
              background: "#1e293b",
              color: "#f8fafc",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#1e293b"
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#f8fafc" }}>
                Edit Page: {formData.title}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "4px 8px"
                }}
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div style={{ padding: "12px 24px", background: "rgba(239, 68, 68, 0.15)", color: "#fca5a5", fontSize: "13px", borderBottom: "1px solid rgba(239, 68, 68, 0.3)" }}>
                {errorMsg}
              </div>
            )}

            {/* Modal Body (Scrollable Internally) */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}
            >
              {/* Form Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#f8fafc",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Slug (Fixed)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.slug}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      color: "#94a3b8",
                      fontSize: "14px",
                      cursor: "not-allowed"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: formData.status === "published" ? "#34d399" : "#fbbf24",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <option value="published" style={{ background: "#0f172a", color: "#34d399" }}>Published</option>
                    <option value="draft" style={{ background: "#0f172a", color: "#fbbf24" }}>Draft</option>
                  </select>
                </div>
              </div>

              {/* Rich Text Editor Container */}
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: "320px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Content
                </label>

                {/* 7 Formatting Toolbar Buttons Only */}
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    padding: "8px",
                    background: "#0f172a",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderBottom: "none",
                    borderRadius: "8px 8px 0 0"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleFormatCommand("bold")}
                    style={{ padding: "6px 12px", fontWeight: "bold", background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatCommand("italic")}
                    style={{ padding: "6px 12px", fontStyle: "italic", background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatCommand("underline")}
                    style={{ padding: "6px 12px", textDecoration: "underline", background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                    title="Underline"
                  >
                    U
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatCommand("formatBlock", "<h2>")}
                    style={{ padding: "6px 12px", fontWeight: 600, background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                    title="Heading"
                  >
                    Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatCommand("insertUnorderedList")}
                    style={{ padding: "6px 12px", background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                    title="Bullet List"
                  >
                    • Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatCommand("insertOrderedList")}
                    style={{ padding: "6px 12px", background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                    title="Numbered List"
                  >
                    1. Numbered
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatCommand("createLink")}
                    style={{ padding: "6px 12px", background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                    title="Link"
                  >
                    🔗 Link
                  </button>
                </div>

                {/* Dark Navy Editable Area */}
                <div
                  ref={editorRef}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onInput={handleEditorInput}
                  onBlur={handleEditorInput}
                  style={{
                    flex: 1,
                    minHeight: "260px",
                    padding: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "0 0 8px 8px",
                    background: "rgba(15, 23, 42, 0.8)",
                    color: "#f8fafc",
                    overflowY: "auto",
                    lineHeight: "1.6",
                    outline: "none",
                    cursor: "text",
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    pointerEvents: "auto",
                    opacity: 1,
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                background: "#0f172a",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px"
              }}
            >
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: "8px 18px",
                  fontSize: "14px",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#94a3b8",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={loading}
                onClick={handleSubmit}
                style={{
                  padding: "8px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  background: "var(--admin-primary, #10b981)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
