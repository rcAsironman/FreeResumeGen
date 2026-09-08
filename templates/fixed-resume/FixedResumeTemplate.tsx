import { BoldSkillsText } from "@/components/preview/BoldSkillsText";
import type { MasterResume } from "@/types/resume";
import { plainContactValue } from "@/utils/resume-text";

import styles from "./fixed-resume.module.css";

import type { CSSProperties } from "react";

import {
  DEFAULT_RESUME_FONT,
  getResumeFontStack,
  type ResumeFont,
} from "@/types/resume-font";

interface FixedResumeTemplateProps {
  resume: MasterResume;
  technicalSkills?: string[];
  selectedSections?: string[];
  fontFamily?: ResumeFont;
}

export function FixedResumeTemplate({
  resume,
  technicalSkills = [],
  selectedSections = [],
  fontFamily = DEFAULT_RESUME_FONT,
}: FixedResumeTemplateProps) {
  function shouldBold(section: string): boolean {
    return selectedSections.includes(section);
  }

  const contactItems = [
    plainContactValue(resume.personalInfo.email),
    resume.personalInfo.phone,
    resume.personalInfo.location,
  ].filter(Boolean);

  const allResumeSkills =
    resume.technicalSkills.categories.flatMap(
      (category) => category.skills,
    );

  const resumeStyle = {
    "--resume-font": getResumeFontStack(fontFamily),
  } as CSSProperties;

  return (
    <article
      className={styles.resume}
      style={resumeStyle}
    >
      <header className={styles.header}>
        <h1 className={styles.name}>
          {resume.personalInfo.fullName}
        </h1>

        <div className={styles.title}>
          {resume.personalInfo.professionalTitle}
        </div>

        {contactItems.length > 0 && (
          <div className={styles.contactLine}>
            {contactItems.map((item, index) => (
              <span key={item}>
                {index > 0 && (
                  <span className={styles.separator}> | </span>
                )}

                {item}
              </span>
            ))}
          </div>
        )}

        {resume.personalInfo.linkedIn && (
          <div className={styles.linkedIn}>
            <strong>LinkedIn:</strong>{" "}
            {plainContactValue(resume.personalInfo.linkedIn)}
          </div>
        )}
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>
          PROFESSIONAL SUMMARY
        </h2>

        <ul className={styles.bulletList}>
          {resume.professionalSummary.bullets.map(
            (bullet, index) => (
              <li key={`summary-${index}`}>
                <BoldSkillsText
                  text={bullet}
                  skills={technicalSkills}
                  additionalSkills={allResumeSkills}
                  maxExtraHighlights={2}
                  enabled={shouldBold("professionalSummary")}
                />
              </li>
            ),
          )}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>
          TECHNICAL SKILLS
        </h2>

        <div className={styles.skills}>
          {resume.technicalSkills.categories.map(
            (category) => (
              <p
                className={styles.skillRow}
                key={category.name}
              >
                <strong>{category.name}:</strong>{" "}

                {category.skills.map((skill, index) => (
                  <span key={`${category.name}-${skill}`}>
                    {index > 0 && ", "}

                    <BoldSkillsText
                      text={skill}
                      skills={technicalSkills}
                      additionalSkills={allResumeSkills}
                      maxExtraHighlights={1}
                      enabled={shouldBold("technicalSkills")}
                    />
                  </span>
                ))}
              </p>
            ),
          )}
        </div>
      </section>

      {resume.education.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            EDUCATION
          </h2>

          <ul className={styles.bulletList}>
            {resume.education.map((education) => (
              <li key={education.id}>
                {education.degree} from{" "}
                {education.institution}
                {education.location
                  ? `, ${education.location}`
                  : ""}
                {education.graduationDate
                  ? ` in ${education.graduationDate}`
                  : ""}
                .
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>
          PROFESSIONAL EXPERIENCE
        </h2>

        <div className={styles.experienceList}>
          {resume.experience.map((experience) => (
            <section
              className={styles.experience}
              key={experience.id}
            >
              <div className={styles.clientRow}>
                <div>
                  <strong>Client:-</strong>{" "}
                  {experience.company}
                  {experience.location
                    ? `, ${experience.location}`
                    : ""}
                </div>

                <div className={styles.dates}>
                  {experience.startDate} –{" "}
                  {experience.endDate}
                </div>
              </div>

              <div className={styles.role}>
                <strong>Role:-</strong>{" "}
                {experience.role}
              </div>

              <div className={styles.responsibilitiesLabel}>
                <strong>Responsibilities:</strong>
              </div>

              <ul className={styles.bulletList}>
                {experience.responsibilities.map(
                  (responsibility, index) => (
                    <li
                      key={`${experience.id}-responsibility-${index}`}
                    >
                      <BoldSkillsText
                        text={responsibility}
                        skills={technicalSkills}
                        additionalSkills={allResumeSkills}
                        maxExtraHighlights={2}
                        enabled={shouldBold("experience")}
                      />
                    </li>
                  ),
                )}
              </ul>

              {experience.environment.length > 0 && (
                <p className={styles.environment}>
                  <strong>Environment:</strong>{" "}

                  {experience.environment.map(
                    (technology, index) => (
                      <span
                        key={`${experience.id}-environment-${technology}`}
                      >
                        {index > 0 && ", "}

                        <BoldSkillsText
                          text={technology}
                          skills={technicalSkills}
                          additionalSkills={allResumeSkills}
                          maxExtraHighlights={1}
                          enabled={shouldBold("environment")}
                        />
                      </span>
                    ),
                  )}
                  .
                </p>
              )}
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}
