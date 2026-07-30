import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Section from "../components/ui/Section";
import "../styles/page-hero.css";
import "./LegalPage.css";

function sanitizeHTML(htmlString) {
  if (!htmlString) return "";
  return htmlString
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
}

export default function CMSPage({ slug: propSlug }) {
  const params = useParams();
  const rawSlug = propSlug || params.slug;
  const slug = rawSlug ? rawSlug.toLowerCase().trim() : "";

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchPage() {
      setLoading(true);
      setErrorMsg("");
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

      try {
        // Fetch /cms/:slug with no-store cache policy
        let res = await fetch(`${apiBaseUrl}/cms/${slug}`, { cache: "no-store" });
        if (!res.ok) {
          res = await fetch(`${apiBaseUrl}/api/cms/${slug}`, { cache: "no-store" });
        }

        if (!res.ok) {
          throw new Error("This page is currently unavailable.");
        }

        const data = await res.json();
        if (isMounted) {
          setPage(data);

          if (data.metaTitle || data.title) {
            document.title = `${data.metaTitle || data.title} - Swasti Foundation`;
          }
          if (data.metaDescription) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement("meta");
              metaDesc.name = "description";
              document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute("content", data.metaDescription);
          }
        }
      } catch (err) {
        if (isMounted) {
          setErrorMsg(err.message || "This page is currently unavailable.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      fetchPage();
    } else {
      setLoading(false);
      setErrorMsg("This page is currently unavailable.");
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const pageTitle = page?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (loading) {
    return (
      <>
        <header className="page-hero">
          <div className="container">
            <span className="page-hero__eyebrow">Swasti Foundation</span>
            <h1 className="page-hero__title">Loading…</h1>
          </div>
        </header>
        <Section tone="base" className="legal-page">
          <div className="container">
            <div className="legal-card legal-skeleton">
              <div className="skeleton-line" style={{ width: "40%", height: "32px" }} />
              <div className="skeleton-line" style={{ width: "100%" }} />
              <div className="skeleton-line" style={{ width: "90%" }} />
              <div className="skeleton-line" style={{ width: "95%" }} />
              <div className="skeleton-line" style={{ width: "60%" }} />
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">Swasti Foundation</span>
          <h1 className="page-hero__title">{pageTitle}</h1>
        </div>
      </header>

      <Section tone="base" className="legal-page">
        <div className="container">
          <article className="legal-card">
            {errorMsg ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <h3 style={{ color: "var(--color-primary-dark)", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Page Notice
                </h3>
                <p style={{ color: "var(--color-ink-soft)", fontSize: "1rem" }}>
                  {errorMsg}
                </p>
              </div>
            ) : (
              <>
                <div className="legal-meta-badge">
                  Last updated: {new Date(page.updatedAt || page.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                </div>
                <div
                  className="legal-content"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(page.content) }}
                />
              </>
            )}
          </article>
        </div>
      </Section>
    </>
  );
}
