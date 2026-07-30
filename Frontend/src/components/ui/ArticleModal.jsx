import { useEffect } from "react";
import "./ArticleModal.css";

export default function ArticleModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Lock body scroll
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const title = item.title || item.name || "Article Details";
  const category = item.category || item.program || "News & Stories";
  const author = item.author || "Swasti Foundation";
  const dateStr = item.publishedDate
    ? new Date(item.publishedDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : null;

  const summary = item.excerpt || item.summary;
  const fullContent = item.content || item.story || summary || "No content provided.";

  // Split content into clean paragraphs
  const paragraphs = fullContent
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="article-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="article-modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          className="article-modal__close-btn"
          onClick={onClose}
          aria-label="Close article"
        >
          ✕
        </button>

        <div className="article-modal__header">
          <span className="article-modal__badge">{category}</span>
          <h2 className="article-modal__title">{title}</h2>
          <div className="article-modal__meta">
            <span>By <strong>{author}</strong></span>
            {dateStr && <span className="article-modal__meta-dot">•</span>}
            {dateStr && <span>Published {dateStr}</span>}
          </div>
        </div>

        {item.image && (
          <div className="article-modal__media">
            <img src={item.image} alt={title} />
          </div>
        )}

        {summary && summary !== fullContent && (
          <div className="article-modal__summary">
            <p>"{summary}"</p>
          </div>
        )}

        <div className="article-modal__body">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
          
          {item.link && (
            <div className="article-modal__link-section">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="article-modal__external-link"
              >
                Read full article on official source &rarr;
              </a>
            </div>
          )}
        </div>

        <div className="article-modal__footer">
          <button className="article-modal__btn-close" onClick={onClose}>
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
}
