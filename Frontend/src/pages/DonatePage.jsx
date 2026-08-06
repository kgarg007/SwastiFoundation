import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import Section from "../components/ui/Section";
import Button from "../components/ui/Button";
import { 
  GraduationCap, 
  Heart, 
  Briefcase, 
  Leaf, 
  ShieldCheck, 
  User, 
  Mail, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Lock
} from "lucide-react";
import "../styles/page-hero.css";
import "./DonatePage.css";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

const ALLOCATION = [
  { label: "Education programs", pct: 35, icon: GraduationCap, color: "var(--color-primary)" },
  { label: "Healthcare & wellness", pct: 25, icon: Heart, color: "var(--color-error)" },
  { label: "Livelihood & skill development", pct: 20, icon: Briefcase, color: "var(--color-accent)" },
  { label: "Environment & welfare initiatives", pct: 20, icon: Leaf, color: "var(--color-secondary)" },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function DonatePage() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "success" | "failure"
  useReveal();

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  async function handlePay(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay payment gateway failed to load. Please verify your connection.");
        return;
      }

      // 2. Create order on Backend
      const response = await fetch(`${API_BASE_URL}/api/donation/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: effectiveAmount })
      });

      const orderData = await response.json();
      if (!response.ok) {
        throw new Error(orderData.error || "Failed to initialize payment order.");
      }

      const { orderId, amount: orderAmount, receiptId, razorpayKeyId } = orderData;

      // 3. Launch Checkout Modal
      const options = {
        key: razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount * 100, // paise
        currency: "INR",
        name: "Swasti Foundation",
        description: "General Donation",
        image: "/images/logo.png",
        order_id: orderId,
        handler: async function (paymentResponse) {
          try {
            // Verify payment signature on Backend
            const verifyResponse = await fetch(`${API_BASE_URL}/api/donation/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                name: name,
                email: email
              })
            });

            const verifyData = await verifyResponse.json();
            if (verifyResponse.ok && verifyData.success) {
              setStatus("success");
            } else {
              setStatus("failure");
            }
          } catch (err) {
            console.error("Signature verification request failed:", err);
            setStatus("failure");
          }
        },
        prefill: {
          name: name,
          email: email
        },
        theme: {
          color: "#0f4c81"
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay Checkout dismissed.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (failResponse) {
        console.error("Payment failed:", failResponse.error);
        setStatus("failure");
      });
      rzp.open();
    } catch (error) {
      console.error("Payment setup error:", error);
      alert(error.message || "Failed to initialize payment transaction.");
    }
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">{t("nav.donate")}</span>
          <h1 className="page-hero__title">{t("donate.title")}</h1>
          <p className="page-hero__sub">{t("donate.subtitle")}</p>
        </div>
      </header>

      <Section tone="base">
        <div className="donate-layout">
          <form className="donate-card reveal" onSubmit={handlePay}>
            {status === "success" ? (
              <div className="donate-result donate-result--success" role="status">
                <div className="donate-result__icon-wrapper">
                  <CheckCircle2 className="donate-result__icon-svg" size={64} />
                </div>
                <h2>{t("donate.successTitle")}</h2>
                <p>{t("donate.successBody")}</p>
                <Button variant="outline" onClick={() => {
                  setStatus(null);
                  setName("");
                  setEmail("");
                }}>
                  {t("common.backToHome")}
                </Button>
              </div>
            ) : status === "failure" ? (
              <div className="donate-result donate-result--failure" role="alert">
                <div className="donate-result__icon-wrapper">
                  <XCircle className="donate-result__icon-svg" size={64} />
                </div>
                <h2>{t("donate.failureTitle")}</h2>
                <p>{t("donate.failureBody")}</p>
                <Button variant="primary" onClick={() => setStatus(null)}>
                  {t("common.submit")}
                </Button>
              </div>
            ) : (
              <>
                <h2 className="donate-card__title">{t("donate.amountTitle")}</h2>
                <div className="donate-amounts">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      className={`donate-amounts__btn ${amount === preset && !customAmount ? "is-active" : ""}`}
                      onClick={() => {
                        setAmount(preset);
                        setCustomAmount("");
                      }}
                    >
                      <span className="donate-amounts__rupee">₹</span>
                      <span className="donate-amounts__val">{preset.toLocaleString("en-IN")}</span>
                    </button>
                  ))}
                </div>
                
                <label className="form-field donate-custom-amount">
                  <span>{t("donate.customAmount")}</span>
                  <div className="input-icon-wrapper">
                    <HeartHandshake className="input-field-icon" size={18} />
                    <input
                      type="number"
                      min="1"
                      placeholder="₹ Enter custom amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                  </div>
                </label>

                <div className="donate-name-fields">
                  <label className="form-field">
                    <span>{t("common.name")} *</span>
                    <div className="input-icon-wrapper">
                      <User className="input-field-icon" size={18} />
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </label>
                  <label className="form-field">
                    <span>{t("common.email")} *</span>
                    <div className="input-icon-wrapper">
                      <Mail className="input-field-icon" size={18} />
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="donate-card__cta"
                  disabled={!name.trim() || !email.trim()}
                >
                  <Sparkles size={18} />
                  <span>{t("donate.proceedToPay")} — ₹{effectiveAmount.toLocaleString("en-IN")}</span>
                </Button>
                
                <div className="donate-tax-note">
                  <Lock size={12} className="donate-tax-note__icon" />
                  <span>{t("donate.taxNote")}</span>
                </div>
              </>
            )}
          </form>

          <div className="donate-sidebar">
            <div className="donate-allocation reveal">
              <div className="donate-allocation__header">
                <ShieldCheck className="donate-allocation__header-icon" size={24} />
                <h3>{t("donate.whyDonate")}</h3>
              </div>
              
              <ul className="donate-allocation__list">
                {ALLOCATION.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="donate-allocation__item">
                      <div 
                        className="donate-allocation__icon-box"
                        style={{ 
                          color: item.color,
                          borderColor: item.color
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="donate-allocation__details">
                        <div className="donate-allocation__row">
                          <span className="donate-allocation__label">{item.label}</span>
                          <span className="donate-allocation__pct" style={{ color: item.color }}>
                            {item.pct}%
                          </span>
                        </div>
                        <div className="donate-allocation__bar">
                          <div 
                            className="donate-allocation__bar-fill" 
                            style={{ 
                              width: `${item.pct}%`,
                              backgroundColor: item.color
                            }} 
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
