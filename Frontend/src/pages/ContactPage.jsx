import { useState, useEffect } from "react";
import { useOrgData } from "../context/OrgDataContext";
import Section from "../components/ui/Section";
import Button from "../components/ui/Button";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";
import "../styles/page-hero.css";
import "./ContactPage.css";

export default function ContactPage() {
  const { orgInfo } = useOrgData();
  const [cmsPage, setCmsPage] = useState(null);
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCmsContent() {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      try {
        const res = await fetch(`${apiBaseUrl}/cms/contact`);
        if (res.ok) {
          const data = await res.json();
          setCmsPage(data);
        }
      } catch (err) {
        // Fallback to default rendering if cms page fetch is offline
      }
    }
    loadCmsContent();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSubmitted(false);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      role: "Contact Inquiry",
      message: `[Subject: ${formData.get("subject") || "General"}] ${formData.get("message")}`
    };

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${apiBaseUrl}/regis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      e.target.reset();
    } catch (err) {
      setErrorMsg(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const officeAddress = orgInfo?.officeAddress || "H.no 260/4, main road Chhattarpur New Delhi 110074";
  const email = orgInfo?.email || "foundationswasti@gmail.com";
  const phone = orgInfo?.phone || "8459073474";
  const workingHours = orgInfo?.workingHours || "Monday – Saturday 9:00 AM – 6:00 PM IST";

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">{orgInfo?.name || "Swasti Foundation"}</span>
          <h1 className="page-hero__title">{cmsPage?.title || "Contact Us"}</h1>
        </div>
      </header>

      <Section tone="base" className="contact-page">
        <div className="container">
          <div className="contact-grid">
            
            {/* Contact Details Card */}
            <div className="contact-info-card">
              <h2>Contact Information</h2>
              <div className="contact-details">
                <div className="contact-detail-item">
                  <MapPin className="contact-detail-icon" />
                  <div className="contact-detail-content">
                    <h3>Registered Office</h3>
                    <p>{officeAddress}</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <Mail className="contact-detail-icon" />
                  <div className="contact-detail-content">
                    <h3>Email Address</h3>
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <Phone className="contact-detail-icon" />
                  <div className="contact-detail-content">
                    <h3>Phone Number</h3>
                    <a href={`tel:+91${phone}`}>+91 {phone}</a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <Clock className="contact-detail-icon" />
                  <div className="contact-detail-content">
                    <h3>Working Hours</h3>
                    <p>{workingHours}</p>
                  </div>
                </div>
              </div>

              {cmsPage?.content && (
                <div 
                  className="contact-cms-body"
                  style={{ marginTop: "1.5rem", fontSize: "0.9375rem", color: "var(--color-ink-soft)" }}
                  dangerouslySetInnerHTML={{ __html: cmsPage.content }}
                />
              )}

              {orgInfo?.googleMapUrl && (
                <div className="contact-map-container">
                  <iframe
                    title="Swasti Foundation Location"
                    src={orgInfo.googleMapUrl}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Interactive Contact Form Card */}
            <div className="contact-form-card">
              <h2>Send Us a Message</h2>
              <p>For donation queries, volunteer applications, or general questions, fill out the form below.</p>

              {submitted && (
                <div className="contact-alert contact-alert--success">
                  ✓ Thank you! Your message has been sent successfully. We will get back to you shortly.
                </div>
              )}

              {errorMsg && (
                <div className="contact-alert contact-alert--error">
                  ✕ {errorMsg}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="contact-name">Full Name *</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    className="form-control"
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    className="form-control"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    required
                    className="form-control"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    className="form-control"
                    placeholder="Donation Query, Volunteering, General"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    className="form-control"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button type="submit" variant="primary" disabled={loading} style={{ marginTop: "1rem" }}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </Section>
    </>
  );
}
