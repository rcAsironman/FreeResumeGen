import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  ShadingType,
  TextRun,
} from "docx";

import type { MasterResume } from "@/types/resume";
import { plainContactValue } from "@/utils/resume-text";
import {
  DEFAULT_RESUME_FONT,
  type ResumeFont,
} from "@/types/resume-font";

interface CreateResumeDocxInput {
  resume: MasterResume;
  technicalSkills: string[];
  selectedSections: string[];
  fontFamily?: ResumeFont;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function isSelected(
  section: string,
  selectedSections: string[],
): boolean {
  return selectedSections.includes(section);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createHighlightedRuns(
  text: string,
  skills: string[],
  enabled: boolean,
  fontFamily: ResumeFont,
): TextRun[] {
  if (!enabled || skills.length === 0) {
    return [
      new TextRun({
        text,
        font: fontFamily,
      }),
    ];
  }

  const uniqueSkills = Array.from(
    new Map(
      skills
        .filter(Boolean)
        .map((skill) => [
          normalize(skill),
          skill.trim(),
        ]),
    ).values(),
  ).sort((a, b) => b.length - a.length);

  if (uniqueSkills.length === 0) {
    return [
      new TextRun({
        text,
        font: fontFamily,
      }),
    ];
  }

  const escapedSkills =
    uniqueSkills.map(escapeRegExp);

  /*
   * Also bolds version suffixes:
   *
   * Java 18
   * Java 8/11/17
   * Spring Boot 3.2
   * Angular 18
   */
  const regex = new RegExp(
    `(?<![A-Za-z0-9])(${escapedSkills.join(
      "|",
    )})(?:\\s+\\d+(?:\\.\\d+)*)?(?:\\/\\d+(?:\\.\\d+)*)*(?![A-Za-z0-9])`,
    "gi",
  );

  const runs: TextRun[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(
        new TextRun({
          text: text.slice(
            lastIndex,
            match.index,
          ),
          font: fontFamily,
        }),
      );
    }

    runs.push(
      new TextRun({
        text: match[0],
        bold: true,
        font: fontFamily,
      }),
    );

    lastIndex =
      match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push(
      new TextRun({
        text: text.slice(lastIndex),
        font: fontFamily,
      }),
    );
  }

  return runs;
}

function sectionHeading(
  title: string,
  fontFamily: ResumeFont,
): Paragraph {
  return new Paragraph({
    spacing: {
      before: 120,
      after: 80,
    },

    border: {
      top: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: "000000",
      },

      bottom: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: "000000",
      },

      left: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: "000000",
      },

      right: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: "000000",
      },
    },

    shading: {
      type: ShadingType.CLEAR,
      fill: "D3D3D3",
    },

    keepNext: true,

    children: [
      new TextRun({
        text: title,
        bold: true,
        font: fontFamily,
        size: 22,
      }),
    ],
  });
}

export async function createResumeDocx({
  resume,
  technicalSkills,
  selectedSections,
  fontFamily = DEFAULT_RESUME_FONT,
}: CreateResumeDocxInput): Promise<Buffer> {
  const children: Paragraph[] = [];

  /*
   * ============================================================
   * HEADER
   * ============================================================
   */

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resume.personalInfo.fullName,
          bold: true,
          font: fontFamily,
          size: 36,
        }),
      ],

      spacing: {
        after: 40,
      },
    }),
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text:
            resume.personalInfo
              .professionalTitle,
          bold: true,
          font: fontFamily,
          size: 23,
        }),
      ],

      spacing: {
        after: 30,
      },
    }),
  );

  const contactItems = [
    plainContactValue(resume.personalInfo.email),
    resume.personalInfo.phone,
    resume.personalInfo.location,
  ].filter(Boolean);

  if (contactItems.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactItems.join(" | "),
            font: fontFamily,
            size: 20,
          }),
        ],
      }),
    );
  }

  if (resume.personalInfo.linkedIn) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "LinkedIn: ",
            bold: true,
            font: fontFamily,
            size: 20,
          }),

          new TextRun({
            text: plainContactValue(resume.personalInfo.linkedIn),
            font: fontFamily,
            size: 20,
          }),
        ],

        spacing: {
          after: 80,
        },
      }),
    );
  }

  /*
   * ============================================================
   * PROFESSIONAL SUMMARY
   * ============================================================
   */

  children.push(
    sectionHeading(
      "PROFESSIONAL SUMMARY",
      fontFamily,
    ),
  );

  for (
    const bullet of
    resume.professionalSummary.bullets
  ) {
    children.push(
      new Paragraph({
        bullet: {
          level: 0,
        },

        children: createHighlightedRuns(
          bullet,
          technicalSkills,
          isSelected(
            "professionalSummary",
            selectedSections,
          ),
          fontFamily,
        ),

        spacing: {
          after: 40,
        },
      }),
    );
  }

  /*
   * ============================================================
   * TECHNICAL SKILLS
   * ============================================================
   */

  children.push(
    sectionHeading(
      "TECHNICAL SKILLS",
      fontFamily,
    ),
  );

  for (
    const category of
    resume.technicalSkills.categories
  ) {
    const skillRuns: TextRun[] = [
      new TextRun({
        text: `${category.name}: `,
        bold: true,
        font: fontFamily,
      }),
    ];

    category.skills.forEach(
      (skill, index) => {
        if (index > 0) {
          skillRuns.push(
            new TextRun({
              text: ", ",
              font: fontFamily,
            }),
          );
        }

        skillRuns.push(
          ...createHighlightedRuns(
            skill,
            technicalSkills,
            isSelected(
              "technicalSkills",
              selectedSections,
            ),
            fontFamily,
          ),
        );
      },
    );

    children.push(
      new Paragraph({
        children: skillRuns,

        spacing: {
          after: 40,
        },
      }),
    );
  }

  /*
   * ============================================================
   * EDUCATION
   * ============================================================
   */

  if (resume.education.length > 0) {
    children.push(
      sectionHeading(
        "EDUCATION",
        fontFamily,
      ),
    );

    for (
      const education of resume.education
    ) {
      const educationText = [
        education.degree,
        " from ",
        education.institution,

        education.location
          ? `, ${education.location}`
          : "",

        education.graduationDate
          ? ` in ${education.graduationDate}`
          : "",

        ".",
      ].join("");

      children.push(
        new Paragraph({
          bullet: {
            level: 0,
          },

          children: [
            new TextRun({
              text: educationText,
              font: fontFamily,
            }),
          ],

          spacing: {
            after: 40,
          },
        }),
      );
    }
  }

  /*
   * ============================================================
   * PROFESSIONAL EXPERIENCE
   * ============================================================
   */

  children.push(
    sectionHeading(
      "PROFESSIONAL EXPERIENCE",
      fontFamily,
    ),
  );

  for (
    const experience of resume.experience
  ) {
    /*
     * Client + Dates
     */

    children.push(
      new Paragraph({
        keepNext: true,

        children: [
          new TextRun({
            text: "Client:- ",
            bold: true,
            font: fontFamily,
          }),

          new TextRun({
            text: `${
              experience.company
            }${
              experience.location
                ? `, ${experience.location}`
                : ""
            }`,
            font: fontFamily,
          }),

          new TextRun({
            text: `\t${experience.startDate} – ${experience.endDate}`,
            bold: true,
            font: fontFamily,
          }),
        ],

        tabStops: [
          {
            type: AlignmentType.RIGHT,
            position: 9360,
          },
        ],
      }),
    );

    /*
     * Role
     */

    children.push(
      new Paragraph({
        keepNext: true,

        children: [
          new TextRun({
            text: "Role:- ",
            bold: true,
            font: fontFamily,
          }),

          new TextRun({
            text: experience.role,
            font: fontFamily,
          }),
        ],
      }),
    );

    /*
     * Responsibilities Label
     */

    children.push(
      new Paragraph({
        keepNext: true,

        children: [
          new TextRun({
            text: "Responsibilities:",
            bold: true,
            font: fontFamily,
          }),
        ],
      }),
    );

    /*
     * Responsibility Bullets
     */

    for (
      const responsibility of
      experience.responsibilities
    ) {
      children.push(
        new Paragraph({
          bullet: {
            level: 0,
          },

          children: createHighlightedRuns(
            responsibility,
            technicalSkills,
            isSelected(
              "experience",
              selectedSections,
            ),
            fontFamily,
          ),

          spacing: {
            after: 40,
          },
        }),
      );
    }

    /*
     * Environment
     */

    if (
      experience.environment.length > 0
    ) {
      const environmentRuns: TextRun[] = [
        new TextRun({
          text: "Environment: ",
          bold: true,
          font: fontFamily,
        }),
      ];

      experience.environment.forEach(
        (technology, index) => {
          if (index > 0) {
            environmentRuns.push(
              new TextRun({
                text: ", ",
                font: fontFamily,
              }),
            );
          }

          environmentRuns.push(
            ...createHighlightedRuns(
              technology,
              technicalSkills,
              isSelected(
                "environment",
                selectedSections,
              ),
              fontFamily,
            ),
          );
        },
      );

      environmentRuns.push(
        new TextRun({
          text: ".",
          font: fontFamily,
        }),
      );

      children.push(
        new Paragraph({
          children:
            environmentRuns,

          spacing: {
            after: 100,
          },
        }),
      );
    }
  }

  /*
   * ============================================================
   * DOCUMENT
   * ============================================================
   */

  const document = new Document({
    /*
     * Global default font.
     *
     * If no user font is selected,
     * fontFamily automatically becomes:
     *
     * Times New Roman
     */

    styles: {
      default: {
        document: {
          run: {
            font: fontFamily,
            size: 21,
          },

          paragraph: {
            spacing: {
              after: 0,
            },
          },
        },
      },
    },

    sections: [
      {
        properties: {
          page: {
            /*
             * US Letter:
             * 8.5 × 11 inches
             */

            size: {
              width: 12240,
              height: 15840,
            },

            margin: {
              top: 605,
              right: 720,
              bottom: 605,
              left: 720,
            },
          },
        },

        children,
      },
    ],
  });

  return Packer.toBuffer(document);
}
