module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/utils/resume-text.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "plainContactValue",
    ()=>plainContactValue
]);
function plainContactValue(value) {
    if (!value) return "";
    return value.trim().replace(/^\[([^\]]+)]\((?:mailto:)?[^)]+\)$/i, "$1").replace(/^<mailto:([^>]+)>$/i, "$1").replace(/^mailto:/i, "");
}
}),
"[project]/types/resume-font.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_RESUME_FONT",
    ()=>DEFAULT_RESUME_FONT,
    "RESUME_FONT_OPTIONS",
    ()=>RESUME_FONT_OPTIONS,
    "getResumeFontStack",
    ()=>getResumeFontStack
]);
const DEFAULT_RESUME_FONT = "Times New Roman";
const RESUME_FONT_OPTIONS = [
    "Times New Roman",
    "Arial",
    "Calibri",
    "Cambria",
    "Georgia"
];
function getResumeFontStack(font) {
    const fontStacks = {
        "Times New Roman": '"Times New Roman", Times, serif',
        Arial: 'Arial, Helvetica, sans-serif',
        Calibri: 'Calibri, "Segoe UI", Arial, sans-serif',
        Cambria: 'Cambria, Georgia, "Times New Roman", serif',
        Georgia: 'Georgia, "Times New Roman", serif'
    };
    return fontStacks[font];
}
}),
"[project]/engine/export-engine/create-resume-docx.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createResumeDocx",
    ()=>createResumeDocx
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/docx/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$resume$2d$text$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/resume-text.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$resume$2d$font$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/resume-font.ts [app-route] (ecmascript)");
;
;
;
function normalize(value) {
    return value.trim().toLowerCase();
}
function isSelected(section, selectedSections) {
    return selectedSections.includes(section);
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function createHighlightedRuns(text, skills, enabled, fontFamily) {
    if (!enabled || skills.length === 0) {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                text,
                font: fontFamily
            })
        ];
    }
    const uniqueSkills = Array.from(new Map(skills.filter(Boolean).map((skill)=>[
            normalize(skill),
            skill.trim()
        ])).values()).sort((a, b)=>b.length - a.length);
    if (uniqueSkills.length === 0) {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                text,
                font: fontFamily
            })
        ];
    }
    const escapedSkills = uniqueSkills.map(escapeRegExp);
    /*
   * Also bolds version suffixes:
   *
   * Java 18
   * Java 8/11/17
   * Spring Boot 3.2
   * Angular 18
   */ const regex = new RegExp(`(?<![A-Za-z0-9])(${escapedSkills.join("|")})(?:\\s+\\d+(?:\\.\\d+)*)?(?:\\/\\d+(?:\\.\\d+)*)*(?![A-Za-z0-9])`, "gi");
    const runs = [];
    let lastIndex = 0;
    let match;
    while((match = regex.exec(text)) !== null){
        if (match.index > lastIndex) {
            runs.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                text: text.slice(lastIndex, match.index),
                font: fontFamily
            }));
        }
        runs.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
            text: match[0],
            bold: true,
            font: fontFamily
        }));
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        runs.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
            text: text.slice(lastIndex),
            font: fontFamily
        }));
    }
    return runs;
}
function sectionHeading(title, fontFamily) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
        spacing: {
            before: 120,
            after: 80
        },
        border: {
            top: {
                style: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BorderStyle"].SINGLE,
                size: 6,
                color: "000000"
            },
            bottom: {
                style: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BorderStyle"].SINGLE,
                size: 6,
                color: "000000"
            },
            left: {
                style: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BorderStyle"].SINGLE,
                size: 6,
                color: "000000"
            },
            right: {
                style: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BorderStyle"].SINGLE,
                size: 6,
                color: "000000"
            }
        },
        shading: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ShadingType"].CLEAR,
            fill: "D3D3D3"
        },
        keepNext: true,
        children: [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                text: title,
                bold: true,
                font: fontFamily,
                size: 22
            })
        ]
    });
}
async function createResumeDocx({ resume, technicalSkills, selectedSections, fontFamily = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$resume$2d$font$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_RESUME_FONT"] }) {
    const children = [];
    /*
   * ============================================================
   * HEADER
   * ============================================================
   */ children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
        children: [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                text: resume.personalInfo.fullName,
                bold: true,
                font: fontFamily,
                size: 36
            })
        ],
        spacing: {
            after: 40
        }
    }));
    children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
        children: [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                text: resume.personalInfo.professionalTitle,
                bold: true,
                font: fontFamily,
                size: 23
            })
        ],
        spacing: {
            after: 30
        }
    }));
    const contactItems = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$resume$2d$text$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["plainContactValue"])(resume.personalInfo.email),
        resume.personalInfo.phone,
        resume.personalInfo.location
    ].filter(Boolean);
    if (contactItems.length > 0) {
        children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
            children: [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: contactItems.join(" | "),
                    font: fontFamily,
                    size: 20
                })
            ]
        }));
    }
    if (resume.personalInfo.linkedIn) {
        children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
            children: [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: "LinkedIn: ",
                    bold: true,
                    font: fontFamily,
                    size: 20
                }),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$resume$2d$text$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["plainContactValue"])(resume.personalInfo.linkedIn),
                    font: fontFamily,
                    size: 20
                })
            ],
            spacing: {
                after: 80
            }
        }));
    }
    /*
   * ============================================================
   * PROFESSIONAL SUMMARY
   * ============================================================
   */ children.push(sectionHeading("PROFESSIONAL SUMMARY", fontFamily));
    for (const bullet of resume.professionalSummary.bullets){
        children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
            bullet: {
                level: 0
            },
            children: createHighlightedRuns(bullet, technicalSkills, isSelected("professionalSummary", selectedSections), fontFamily),
            spacing: {
                after: 40
            }
        }));
    }
    /*
   * ============================================================
   * TECHNICAL SKILLS
   * ============================================================
   */ children.push(sectionHeading("TECHNICAL SKILLS", fontFamily));
    for (const category of resume.technicalSkills.categories){
        const skillRuns = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                text: `${category.name}: `,
                bold: true,
                font: fontFamily
            })
        ];
        category.skills.forEach((skill, index)=>{
            if (index > 0) {
                skillRuns.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: ", ",
                    font: fontFamily
                }));
            }
            skillRuns.push(...createHighlightedRuns(skill, technicalSkills, isSelected("technicalSkills", selectedSections), fontFamily));
        });
        children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
            children: skillRuns,
            spacing: {
                after: 40
            }
        }));
    }
    /*
   * ============================================================
   * EDUCATION
   * ============================================================
   */ if (resume.education.length > 0) {
        children.push(sectionHeading("EDUCATION", fontFamily));
        for (const education of resume.education){
            const educationText = [
                education.degree,
                " from ",
                education.institution,
                education.location ? `, ${education.location}` : "",
                education.graduationDate ? ` in ${education.graduationDate}` : "",
                "."
            ].join("");
            children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
                bullet: {
                    level: 0
                },
                children: [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                        text: educationText,
                        font: fontFamily
                    })
                ],
                spacing: {
                    after: 40
                }
            }));
        }
    }
    /*
   * ============================================================
   * PROFESSIONAL EXPERIENCE
   * ============================================================
   */ children.push(sectionHeading("PROFESSIONAL EXPERIENCE", fontFamily));
    for (const experience of resume.experience){
        /*
     * Client + Dates
     */ children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
            keepNext: true,
            children: [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: "Client:- ",
                    bold: true,
                    font: fontFamily
                }),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: `${experience.company}${experience.location ? `, ${experience.location}` : ""}`,
                    font: fontFamily
                }),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: `\t${experience.startDate} – ${experience.endDate}`,
                    bold: true,
                    font: fontFamily
                })
            ],
            tabStops: [
                {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AlignmentType"].RIGHT,
                    position: 9360
                }
            ]
        }));
        /*
     * Role
     */ children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
            keepNext: true,
            children: [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: "Role:- ",
                    bold: true,
                    font: fontFamily
                }),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: experience.role,
                    font: fontFamily
                })
            ]
        }));
        /*
     * Responsibilities Label
     */ children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
            keepNext: true,
            children: [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: "Responsibilities:",
                    bold: true,
                    font: fontFamily
                })
            ]
        }));
        /*
     * Responsibility Bullets
     */ for (const responsibility of experience.responsibilities){
            children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
                bullet: {
                    level: 0
                },
                children: createHighlightedRuns(responsibility, technicalSkills, isSelected("experience", selectedSections), fontFamily),
                spacing: {
                    after: 40
                }
            }));
        }
        /*
     * Environment
     */ if (experience.environment.length > 0) {
            const environmentRuns = [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                    text: "Environment: ",
                    bold: true,
                    font: fontFamily
                })
            ];
            experience.environment.forEach((technology, index)=>{
                if (index > 0) {
                    environmentRuns.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                        text: ", ",
                        font: fontFamily
                    }));
                }
                environmentRuns.push(...createHighlightedRuns(technology, technicalSkills, isSelected("environment", selectedSections), fontFamily));
            });
            environmentRuns.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextRun"]({
                text: ".",
                font: fontFamily
            }));
            children.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Paragraph"]({
                children: environmentRuns,
                spacing: {
                    after: 100
                }
            }));
        }
    }
    /*
   * ============================================================
   * DOCUMENT
   * ============================================================
   */ const document = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Document"]({
        /*
     * Global default font.
     *
     * If no user font is selected,
     * fontFamily automatically becomes:
     *
     * Times New Roman
     */ styles: {
            default: {
                document: {
                    run: {
                        font: fontFamily,
                        size: 21
                    },
                    paragraph: {
                        spacing: {
                            after: 0
                        }
                    }
                }
            }
        },
        sections: [
            {
                properties: {
                    page: {
                        /*
             * US Letter:
             * 8.5 × 11 inches
             */ size: {
                            width: 12240,
                            height: 15840
                        },
                        margin: {
                            top: 605,
                            right: 720,
                            bottom: 605,
                            left: 720
                        }
                    }
                },
                children
            }
        ]
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Packer"].toBuffer(document);
}
}),
"[project]/engine/export-engine/repair-html-docx.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "repairHtmlDocx",
    ()=>repairHtmlDocx
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jszip/lib/index.js [app-route] (ecmascript)");
;
async function repairHtmlDocx(input) {
    const zip = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].loadAsync(input);
    const documentPart = zip.file("word/document.xml");
    if (!documentPart) throw new Error("Generated Word document is missing word/document.xml.");
    let xml = await documentPart.async("string");
    // html-to-docx currently places sectPr before the document paragraphs.
    // OOXML requires the body-level sectPr to be the final child of w:body.
    const sectionMatch = xml.match(/\s*<w:sectPr\b[\s\S]*?<\/w:sectPr>/);
    if (sectionMatch) {
        xml = xml.replace(sectionMatch[0], "");
        xml = xml.replace("</w:body>", `${sectionMatch[0].trim()}\n  </w:body>`);
    }
    // Remove invalid values emitted for omitted optional margin properties.
    xml = xml.replace(/\s+w:(?:header|footer|gutter)="undefined"/g, "");
    zip.file("word/document.xml", xml);
    return Buffer.from(await zip.generateAsync({
        type: "uint8array",
        compression: "DEFLATE"
    }));
}
}),
"[project]/engine/validation/resume.schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "certificationsSchema",
    ()=>certificationsSchema,
    "educationSchema",
    ()=>educationSchema,
    "experienceSchema",
    ()=>experienceSchema,
    "masterResumeSchema",
    ()=>masterResumeSchema,
    "personalInfoSchema",
    ()=>personalInfoSchema,
    "professionalSummarySchema",
    ()=>professionalSummarySchema,
    "projectsSchema",
    ()=>projectsSchema,
    "technicalSkillsSchema",
    ()=>technicalSkillsSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const personalInfoSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    fullName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    professionalTitle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    linkedIn: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    portfolio: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const professionalSummarySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    bullets: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)).min(1)
});
const technicalSkillsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    categories: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        skills: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1))
    }))
});
const experienceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    company: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    startDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    endDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    responsibilities: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)),
    environment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1))
}));
const projectsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    technologies: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    highlights: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
}));
const educationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    institution: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    degree: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    graduationDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
}));
const certificationsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    issuer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    year: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
}));
const masterResumeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    personalInfo: personalInfoSchema,
    professionalSummary: professionalSummarySchema,
    technicalSkills: technicalSkillsSchema,
    experience: experienceSchema,
    projects: projectsSchema,
    education: educationSchema,
    certifications: certificationsSchema
});
}),
"[project]/app/api/export/docx/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$docx$2f$dist$2f$html$2d$to$2d$docx$2e$esm$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html-to-docx/dist/html-to-docx.esm.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$engine$2f$export$2d$engine$2f$create$2d$resume$2d$docx$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/engine/export-engine/create-resume-docx.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$engine$2f$export$2d$engine$2f$repair$2d$html$2d$docx$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/engine/export-engine/repair-html-docx.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$engine$2f$validation$2f$resume$2e$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/engine/validation/resume.schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$resume$2d$font$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/resume-font.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const runtime = "nodejs";
const requestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    resume: __TURBOPACK__imported__module__$5b$project$5d2f$engine$2f$validation$2f$resume$2e$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["masterResumeSchema"],
    technicalSkills: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    selectedSections: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    documentHtml: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(2_000_000).optional(),
    fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "Times New Roman",
        "Arial",
        "Calibri",
        "Cambria",
        "Georgia"
    ]).optional().default(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$resume$2d$font$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_RESUME_FONT"])
});
async function POST(request) {
    try {
        /*
     * Read the request body sent from:
     *
     * app/generated-preview/page.tsx
     */ const body = await request.json();
        /*
     * Validate the complete request.
     *
     * If fontFamily is missing,
     * Times New Roman is automatically used.
     */ const { resume, technicalSkills, selectedSections, fontFamily, documentHtml } = requestSchema.parse(body);
        /*
     * Generate the DOCX using the
     * user-selected font.
     */ const docxBuffer = documentHtml ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$engine$2f$export$2d$engine$2f$repair$2d$html$2d$docx$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["repairHtmlDocx"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$docx$2f$dist$2f$html$2d$to$2d$docx$2e$esm$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(`<!doctype html><html><head><meta charset="utf-8"></head><body>${documentHtml}</body></html>`, undefined, {
            pageSize: {
                width: 12240,
                height: 15840
            },
            margins: {
                top: 605,
                right: 720,
                bottom: 605,
                left: 720,
                header: 0,
                footer: 0,
                gutter: 0
            }
        })) : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$engine$2f$export$2d$engine$2f$create$2d$resume$2d$docx$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createResumeDocx"])({
            resume,
            technicalSkills,
            selectedSections,
            fontFamily
        });
        /*
     * Convert the Node.js Buffer into
     * a web-compatible Uint8Array.
     */ const docxBytes = new Uint8Array(docxBuffer);
        /*
     * Return the generated Word document.
     */ return new Response(docxBytes, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": 'attachment; filename="Karthik_Mangineni_Resume.docx"',
                "Cache-Control": "no-store"
            }
        });
    } catch (error) {
        console.error("DOCX generation error:", error);
        /*
     * Zod validation error
     */ if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return Response.json({
                success: false,
                error: "Invalid DOCX export data.",
                details: error.flatten()
            }, {
                status: 400
            });
        }
        /*
     * General DOCX generation error
     */ return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Unable to generate DOCX."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0n87jbg._.js.map