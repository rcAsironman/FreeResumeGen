import { Fragment, type CSSProperties, type ComponentProps } from "react";
import { BoldSkillsText } from "@/components/preview/BoldSkillsText";
import { FixedResumeTemplate } from "@/templates/fixed-resume/FixedResumeTemplate";
import { plainEmailValue } from "@/utils/resume-text";
import { CertificationLogoStrip } from "@/components/preview/CertificationLogoStrip";
import { DEFAULT_RESUME_FONT, getResumeFontStack } from "@/types/resume-font";
import styles from "./architect-resume.module.css";

export function ArchitectResumeTemplate({ resume, technicalSkills = [], selectedSections = [], fontFamily = DEFAULT_RESUME_FONT, showCertificationLogos = false, selectedCertificationBadges = [], certificationBadgePosition, certificationBadgeSize, onCertificationBadgePositionChange }: ComponentProps<typeof FixedResumeTemplate>) {
  const highlight = (text: string, section: string) => <BoldSkillsText text={text} skills={technicalSkills} enabled={selectedSections.includes(section)}/>;
  const qualification = (text: string) => {
    const colon = text.indexOf(":");
    return colon > 0 && colon < 80 ? <><strong>{text.slice(0, colon + 1)}</strong>{highlight(text.slice(colon + 1), "professionalSummary")}</> : highlight(text, "professionalSummary");
  };
  return <article className={styles.resume} data-resume-layout="architect-resume" style={{ "--resume-font": getResumeFontStack(fontFamily) } as CSSProperties}>
    <header className={styles.header}>
      <h1 data-resume-field="fullName">{resume.personalInfo.fullName}</h1>
      <p className={styles.title} data-resume-field="professionalTitle">{resume.personalInfo.professionalTitle}</p>
      <p className={styles.contact}>{[{ field: "phone", value: resume.personalInfo.phone }, { field: "email", value: plainEmailValue(resume.personalInfo.email) }, { field: "location", value: resume.personalInfo.location }].filter((item) => item.value).map((item, i) => <Fragment key={item.field}>{i > 0 && "  |  "}<span data-contact-field={item.field}>{item.value}</span></Fragment>)}</p>
      <CertificationLogoStrip selectedBadges={selectedCertificationBadges} enabled={showCertificationLogos} position={certificationBadgePosition} badgeSize={certificationBadgeSize} onPositionChange={onCertificationBadgePositionChange}/>
    </header>
    <h2>PROFESSIONAL SUMMARY</h2>
    {resume.professionalSummary.bullets[0] && <p className={styles.summary} data-summary-index={0}>{highlight(resume.professionalSummary.bullets[0], "professionalSummary")}</p>}
    {resume.professionalSummary.bullets.length > 1 && <><h2>KEY QUALIFICATIONS</h2><ul>{resume.professionalSummary.bullets.slice(1).map((bullet, i) => <li key={i} data-summary-index={i + 1}>{qualification(bullet)}</li>)}</ul></>}
    <h2>TECHNICAL SKILLS</h2>
    {resume.technicalSkills.categories.map((category, i) => <p className={styles.skill} key={i} data-skill-category-index={i}><strong data-skill-category-name>{category.name}:</strong>{" "}{category.skills.map((skill, j) => <span key={j} data-skill-index={j}>{j > 0 && ", "}{highlight(skill, "technicalSkills")}</span>)}</p>)}
    <h2>PROFESSIONAL EXPERIENCE</h2>
    {resume.experience.map((entry, i) => <section className={styles.experience} key={entry.id} data-experience-index={i}>
      <div className={styles.roleRow}><strong data-experience-field="role">{entry.role}</strong><strong className={styles.dates}><span data-experience-field="startDate">{entry.startDate}</span> – <span data-experience-field="endDate">{entry.endDate}</span></strong></div>
      <p className={styles.company}><strong data-experience-field="company">{entry.company}</strong>{entry.location && <>  |  <strong data-experience-field="location">{entry.location}</strong></>}</p>
      {entry.description && <p className={styles.description} data-experience-field="description">{entry.description}</p>}
      {entry.responsibilities.map((bullet, j) => <Fragment key={j}>{entry.responsibilityGroups?.filter((group) => group.startIndex === j).map((group) => <h3 key={group.heading}>{group.heading}</h3>)}<ul className={styles.singleBullet}><li data-responsibility-index={j}>{highlight(bullet, "experience")}</li></ul></Fragment>)}
    </section>)}
    {resume.education.length > 0 && <><h2>EDUCATION</h2>{resume.education.map((entry, i) => <p className={styles.education} key={entry.id} data-education-index={i}><span><span data-education-field="degree">{entry.degree}</span>, <span data-education-field="institution">{entry.institution}</span>{entry.location && <>, <span data-education-field="location">{entry.location}</span></>}</span><span data-education-field="graduationDate">{entry.graduationDate}</span></p>)}</>}
  </article>;
}
