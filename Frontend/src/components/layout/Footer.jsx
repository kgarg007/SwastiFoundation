import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { useOrgData } from "../../context/OrgDataContext";
import { Facebook, Instagram, Youtube, HeartPulse, Leaf } from "../ui/icons";
import "./Footer.css";

export default function Footer() {
  const { t } = useLanguage();
  const { orgInfo } = useOrgData();
  const year = new Date().getFullYear();

  const facebookUrl = orgInfo.social?.facebook && orgInfo.social.facebook !== '#' ? orgInfo.social.facebook : "https://www.facebook.com/Swastifoundationngo?mibextid=rS40aB7S9Ucbxw6v";
  const instagramUrl = orgInfo.social?.instagram && orgInfo.social.instagram !== '#' ? orgInfo.social.instagram : "https://www.instagram.com/swastifoundationngo?igsh=cHc2aXZ6N2M2ZGw1";
  const youtubeUrl = orgInfo.social?.youtube && orgInfo.social.youtube !== '#' ? orgInfo.social.youtube : "https://www.youtube.com/@swastifoundationngo4639";

  return (
    <footer className="footer">
      <div className="footer__bg-glow"></div>
      <div className="footer__pattern-overlay"></div>
      <div className="footer__top-transition"></div>

      <div className="container footer__inner">
        
        {/* Trust & Call out */}
        <div className="footer__hero">
          <h2 className="footer__hero-title">Be the catalyst for change.</h2>
          <p className="footer__hero-sub">Join us in our mission to empower communities and create sustainable impact across the nation.</p>
          <div className="footer__trust-badges">
            <span className="footer__badge"><HeartPulse className="footer__badge-icon" /> 100% Transparent</span>
            <span className="footer__badge"><Leaf className="footer__badge-icon" /> Sustainable Impact</span>
          </div>
        </div>

        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <div className="footer__brand">
              <img src="/images/logo.png" className="footer__brand-mark" alt="Swasti Foundation Logo" />
              <span className="footer__brand-text">{orgInfo.name}</span>
            </div>
            <p className="footer__tagline">{orgInfo.tagline}</p>
            <p className="footer__blurb">{t("footer.aboutBlurb")}</p>
            <div className="footer__reg-box">
              <span className="footer__reg-label" style={{ marginBottom: 0 }}>{t("footer.registered")}</span>
            </div>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">{t("footer.quickLinks")}</h3>
            <ul className="footer__links">
              <li><Link to="/about">{t("nav.about")}</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/programs">{t("nav.programs")}</Link></li>
              <li><Link to="/impact">{t("nav.impact")}</Link></li>
              <li><Link to="/stories">{t("nav.blog")}</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">{t("footer.getInvolved")}</h3>
            <ul className="footer__links">
              <li><Link to="/donate">{t("nav.donate")}</Link></li>
              <li><Link to="/volunteer">{t("nav.volunteer")}</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>

          <div className="footer__col footer__col--contact">
            <h3 className="footer__heading">{t("footer.contactUs")}</h3>
            <address className="footer__address">
              <p>{orgInfo.officeAddress}</p>
              <p>
                <a href={`mailto:${orgInfo.email}`}>{orgInfo.email}</a>
              </p>
              <p>
                <a href={`tel:+91${orgInfo.phone}`}>+91 {orgInfo.phone}</a>
              </p>
            </address>
            <h3 className="footer__heading footer__heading--social">{t("footer.followUs")}</h3>
            <div className="footer__social">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer__social-link">
                <Facebook className="footer__social-icon" />
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer__social-link">
                <Instagram className="footer__social-icon" />
              </a>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer__social-link">
                <Youtube className="footer__social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {year} {orgInfo.name}. {t("footer.rights")}</p>
          <div className="footer__bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/refund-policy">Refund Policy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
