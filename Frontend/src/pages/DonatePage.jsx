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

export default function DonatePage() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [status, setStatus] = useState(null); // null | "success" | "failure"
  useReveal();

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  function handlePay(e) {
    e.preventDefault();
    // TODO: Integrate Razorpay Payment Gateway
    // Dummy handler — simulates success for now.
    setStatus("success");
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
                <Button variant="outline" onClick={() => setStatus(null)}>
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
                    <span>{t("common.name")}</span>
                    <div className="input-icon-wrapper">
                      <User className="input-field-icon" size={18} />
                      <input type="text" name="name" autoComplete="name" placeholder="Your full name" />
                    </div>
                  </label>
                  <label className="form-field">
                    <span>{t("common.email")}</span>
                    <div className="input-icon-wrapper">
                      <Mail className="input-field-icon" size={18} />
                      <input type="email" name="email" autoComplete="email" placeholder="email@example.com" />
                    </div>
                  </label>
                </div>

                <Button type="submit" variant="primary" size="lg" className="donate-card__cta">
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
