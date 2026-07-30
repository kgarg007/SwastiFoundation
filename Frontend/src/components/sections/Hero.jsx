import { motion } from "framer-motion";
import { useLanguage } from "../../i18n/LanguageContext";
import { useOrgData } from "../../context/OrgDataContext";
import { impactStats as fallbackStats } from "../../data/orgData";
import Button from "../ui/Button";
import "./Hero.css";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  })
};

export default function Hero() {
  const { t } = useLanguage();
  const { orgInfo, impactStats } = useOrgData();
  const statsToRender = impactStats && impactStats.length > 0 ? impactStats : fallbackStats;

  return (
    <section className="hero">
      <div className="hero__bg">
        <div className="hero__bg-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}></div>
        <div className="hero__overlay"></div>
        <div className="hero__bg-glow"></div>
      </div>
      
      <div className="container hero__inner">
        <div className="hero__content">
          <motion.span 
            className="hero__eyebrow"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
          >
            {t("home.heroEyebrow")}
          </motion.span>
          
          <motion.h1 
            className="hero__headline"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
          >
            {orgInfo.tagline}
          </motion.h1>
          
          <motion.p 
            className="hero__translation"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
          >
            "{orgInfo.taglineTranslation}"
          </motion.p>
          
          <motion.div 
            className="hero__ctas"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
          >
            <Button to="/donate" variant="primary" size="lg">
              {t("home.ctaDonate")}
            </Button>
            <Button to="/programs" variant="outline" size="lg" className="hero__btn-secondary">
              {t("home.ctaPrograms")}
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="hero__stats-wrapper"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
      >
        <div className="container">
          <div className="hero__stats">
            {statsToRender.slice(0, 3).map((stat) => (
              <div className="hero__stat-card" key={stat.id}>
                <div className="hero__stat-value">
                  {stat.value.toLocaleString("en-IN")}{stat.suffix}
                </div>
                <div className="hero__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
