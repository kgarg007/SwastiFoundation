import { useLanguage } from "../i18n/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import { useOrgData } from "../context/OrgDataContext";
import { leadershipTeam } from "../data/orgData";
import Section from "../components/ui/Section";
import SectionHeading from "../components/ui/SectionHeading";
import CtaBand from "../components/sections/CtaBand";
import "../styles/page-hero.css";
import "./AboutPage.css";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export default function AboutPage() {
  const { t } = useLanguage();
  const { orgInfo, aboutContent, founderMessage, team } = useOrgData();
  useReveal();

  const teamToRender = team && team.length > 0 ? team : leadershipTeam;

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">{orgInfo.name}</span>
          <h1 className="page-hero__title">{t("about.title")}</h1>
          <p className="page-hero__sub">{t("about.subtitle")}</p>
        </div>
      </header>

      <Section tone="base">
        <SectionHeading align="left" title={t("about.storyTitle")} />
        <div className="about-story reveal">
          <div className="about-story__block">
            <h3>{t("about.whyFoundedLabel")}</h3>
            <p>{aboutContent.whyFounded}</p>
          </div>
          <div className="about-story__block">
            <h3>{t("about.problemLabel")}</h3>
            <p>{aboutContent.problem}</p>
          </div>
          <div className="about-story__block">
            <h3>{t("about.founderStoryLabel")}</h3>
            <p>{aboutContent.founderStory}</p>
          </div>
          <div className="about-story__block">
            <h3>{t("about.inspirationLabel")}</h3>
            <p>{aboutContent.inspiration}</p>
          </div>
        </div>
      </Section>

      <Section tone="deep">
        <div className="mission-vision">
          <div className="mission-vision__col reveal">
            <span className="mission-vision__eyebrow">{t("about.missionTitle")}</span>
            <p>{aboutContent.mission}</p>
          </div>
          <div className="mission-vision__col reveal">
            <span className="mission-vision__eyebrow">{t("about.visionTitle")}</span>
            <p>{aboutContent.vision}</p>
            <p className="mission-vision__extended">{aboutContent.visionExtended}</p>
          </div>
        </div>
      </Section>

      <Section tone="base">
        <SectionHeading title={t("about.valuesTitle")} />
        <div className="values-grid">
          {(aboutContent.coreValues || []).map((value, i) => (
            <div className="values-grid__item reveal" key={value.id} style={{ transitionDelay: `${i * 50}ms` }}>
              <span className="values-grid__index">{String(i + 1).padStart(2, "0")}</span>
              <h3>{value.name}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="alt">
        <SectionHeading title={t("about.leadershipTitle")} />
        <div className="leadership-grid">
          {teamToRender.map((member, i) => (
            <div className="leadership-card reveal" key={member._id || member.name} style={{ transitionDelay: `${i * 40}ms` }}>
              <div className="leadership-card__avatar" aria-hidden="true" style={{ overflow: 'hidden' }}>
                {member.image ? (
                  <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  member.name.charAt(0)
                )}
              </div>
              <h3 className="leadership-card__name">{member.name}</h3>
              <p className="leadership-card__role">{member.role}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="base">
        <SectionHeading title={t("about.orgDetailsTitle")} />
        <dl className="org-details reveal">
          <div className="org-details__row">
            <dt>{t("about.registeredAt")}</dt>
            <dd>{orgInfo.registeredAt}</dd>
          </div>
          <div className="org-details__row">
            <dt>{t("about.establishedOn")}</dt>
            <dd>{formatDate(orgInfo.foundedDate)}</dd>
          </div>
          <div className="org-details__row">
            <dt>{t("about.orgType")}</dt>
            <dd>{orgInfo.type}</dd>
          </div>
          <div className="org-details__row">
            <dt>{t("about.address")}</dt>
            <dd>{orgInfo.officeAddress}</dd>
          </div>
          <div className="org-details__row">
            <dt>{t("about.branches")}</dt>
            <dd>{orgInfo.branchLocations.join(", ")}</dd>
          </div>
        </dl>
      </Section>

      <Section tone="deep" id="founders-desk">
        <div className="founders-desk reveal">
          <div className="founders-desk__portrait" aria-hidden="true" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {founderMessage.founderImage ? (
              <img src={founderMessage.founderImage} alt={founderMessage.founderName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>{founderMessage.founderName.charAt(0)}</span>
            )}
          </div>
          <div className="founders-desk__content">
            <span className="founders-desk__eyebrow">Message from the Founder's Desk</span>
            {((founderMessage.letter || []).flatMap(p => p.split(/\r?\n/)).map(p => p.trim()).filter(Boolean)).map((paragraph, i) => (
              <p key={i} className={i === 0 ? "founders-desk__salutation" : ""}>
                {paragraph}
              </p>
            ))}
            <p className="founders-desk__closing">{founderMessage.closing}</p>
            <p className="founders-desk__name">{founderMessage.founderName}</p>
            <p className="founders-desk__role">{founderMessage.founderTitle}</p>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
