module.exports = [
"[project]/components/preview/BoldSkillsText.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BoldSkillsText",
    ()=>BoldSkillsText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function normalize(value) {
    return value.trim().toLowerCase();
}
function uniqueSkills(skills) {
    return Array.from(new Map(skills.map((skill)=>skill.trim()).filter(Boolean).map((skill)=>[
            normalize(skill),
            skill
        ])).values()).sort((a, b)=>b.length - a.length);
}
function deterministicScore(value) {
    let score = 0;
    for(let index = 0; index < value.length; index++){
        score = score * 31 + value.charCodeAt(index) >>> 0;
    }
    return score;
}
function BoldSkillsText({ text, skills, additionalSkills = [], enabled = true, maxExtraHighlights = 2 }) {
    if (!enabled || !text) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: text
        }, void 0, false);
    }
    const primarySkills = uniqueSkills(skills);
    const primarySet = new Set(primarySkills.map(normalize));
    const availableExtraSkills = uniqueSkills(additionalSkills).filter((skill)=>!primarySet.has(normalize(skill))).filter((skill)=>{
        const regex = new RegExp(`(?<![A-Za-z0-9])${escapeRegExp(skill)}(?![A-Za-z0-9])`, "i");
        return regex.test(text);
    }).sort((first, second)=>deterministicScore(`${text}-${first}`) - deterministicScore(`${text}-${second}`)).slice(0, maxExtraHighlights);
    const skillsToHighlight = uniqueSkills([
        ...primarySkills,
        ...availableExtraSkills
    ]);
    if (skillsToHighlight.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: text
        }, void 0, false);
    }
    const pattern = skillsToHighlight.map(escapeRegExp).join("|");
    const regex = new RegExp(`(?<![A-Za-z0-9])(${pattern})(?:\\s+\\d+(?:\\.\\d+)*)?(?:/\\d+(?:\\.\\d+)*)*(?![A-Za-z0-9])`, "gi");
    const nodes = [];
    let lastIndex = 0;
    let match;
    while((match = regex.exec(text)) !== null){
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }
        nodes.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
            children: match[0]
        }, `${match.index}-${match[0]}`, false, {
            fileName: "[project]/components/preview/BoldSkillsText.tsx",
            lineNumber: 108,
            columnNumber: 7
        }, this));
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: nodes
    }, void 0, false);
}
}),
"[project]/utils/resume-text.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/templates/fixed-resume/fixed-resume.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "bulletList": "fixed-resume-module__cPvCYa__bulletList",
  "clientRow": "fixed-resume-module__cPvCYa__clientRow",
  "contactLine": "fixed-resume-module__cPvCYa__contactLine",
  "dates": "fixed-resume-module__cPvCYa__dates",
  "environment": "fixed-resume-module__cPvCYa__environment",
  "experience": "fixed-resume-module__cPvCYa__experience",
  "experienceList": "fixed-resume-module__cPvCYa__experienceList",
  "header": "fixed-resume-module__cPvCYa__header",
  "linkedIn": "fixed-resume-module__cPvCYa__linkedIn",
  "name": "fixed-resume-module__cPvCYa__name",
  "responsibilitiesLabel": "fixed-resume-module__cPvCYa__responsibilitiesLabel",
  "resume": "fixed-resume-module__cPvCYa__resume",
  "role": "fixed-resume-module__cPvCYa__role",
  "section": "fixed-resume-module__cPvCYa__section",
  "sectionHeading": "fixed-resume-module__cPvCYa__sectionHeading",
  "separator": "fixed-resume-module__cPvCYa__separator",
  "skillRow": "fixed-resume-module__cPvCYa__skillRow",
  "skills": "fixed-resume-module__cPvCYa__skills",
  "title": "fixed-resume-module__cPvCYa__title",
});
}),
"[project]/types/resume-font.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/templates/fixed-resume/FixedResumeTemplate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FixedResumeTemplate",
    ()=>FixedResumeTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$preview$2f$BoldSkillsText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/preview/BoldSkillsText.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$resume$2d$text$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/resume-text.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/templates/fixed-resume/fixed-resume.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$resume$2d$font$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/resume-font.ts [app-ssr] (ecmascript)");
;
;
;
;
;
function FixedResumeTemplate({ resume, technicalSkills = [], selectedSections = [], fontFamily = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$resume$2d$font$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESUME_FONT"] }) {
    function shouldBold(section) {
        return selectedSections.includes(section);
    }
    const contactItems = [
        {
            field: "email",
            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$resume$2d$text$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["plainContactValue"])(resume.personalInfo.email)
        },
        {
            field: "phone",
            value: resume.personalInfo.phone
        },
        {
            field: "location",
            value: resume.personalInfo.location
        }
    ].filter((item)=>Boolean(item.value));
    const allResumeSkills = resume.technicalSkills.categories.flatMap((category)=>category.skills);
    const resumeStyle = {
        "--resume-font": (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$resume$2d$font$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResumeFontStack"])(fontFamily)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].resume,
        style: resumeStyle,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].name,
                        "data-resume-field": "fullName",
                        children: resume.personalInfo.fullName
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].title,
                        "data-resume-field": "professionalTitle",
                        children: resume.personalInfo.professionalTitle
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    contactItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].contactLine,
                        children: contactItems.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "data-contact-field": item.field,
                                children: [
                                    index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].separator,
                                        children: " | "
                                    }, void 0, false, {
                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                        lineNumber: 66,
                                        columnNumber: 19
                                    }, this),
                                    item.value
                                ]
                            }, item.field, true, {
                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                lineNumber: 64,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this),
                    resume.personalInfo.linkedIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].linkedIn,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "LinkedIn:"
                            }, void 0, false, {
                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "data-resume-field": "linkedIn",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$resume$2d$text$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["plainContactValue"])(resume.personalInfo.linkedIn)
                            }, void 0, false, {
                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionHeading,
                        children: "PROFESSIONAL SUMMARY"
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bulletList,
                        children: resume.professionalSummary.bullets.map((bullet, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                "data-summary-index": index,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$preview$2f$BoldSkillsText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoldSkillsText"], {
                                    text: bullet,
                                    skills: technicalSkills,
                                    additionalSkills: allResumeSkills,
                                    maxExtraHighlights: 2,
                                    enabled: shouldBold("professionalSummary")
                                }, void 0, false, {
                                    fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                    lineNumber: 92,
                                    columnNumber: 17
                                }, this)
                            }, `summary-${index}`, false, {
                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                lineNumber: 91,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionHeading,
                        children: "TECHNICAL SKILLS"
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].skills,
                        children: resume.technicalSkills.categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].skillRow,
                                "data-skill-category-index": resume.technicalSkills.categories.indexOf(category),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        "data-skill-category-name": true,
                                        children: [
                                            category.name,
                                            ":"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this),
                                    " ",
                                    category.skills.map((skill, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "data-skill-index": index,
                                            children: [
                                                index > 0 && ", ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$preview$2f$BoldSkillsText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoldSkillsText"], {
                                                    text: skill,
                                                    skills: technicalSkills,
                                                    additionalSkills: allResumeSkills,
                                                    maxExtraHighlights: 1,
                                                    enabled: shouldBold("technicalSkills")
                                                }, void 0, false, {
                                                    fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, `${category.name}-${skill}`, true, {
                                            fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                            lineNumber: 121,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, category.name, true, {
                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            resume.education.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionHeading,
                        children: "EDUCATION"
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bulletList,
                        children: resume.education.map((education)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                "data-education-index": resume.education.indexOf(education),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "data-education-field": "degree",
                                        children: education.degree
                                    }, void 0, false, {
                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, this),
                                    " from",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "data-education-field": "institution",
                                        children: education.institution
                                    }, void 0, false, {
                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                        lineNumber: 149,
                                        columnNumber: 17
                                    }, this),
                                    education.location ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            ", ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                "data-education-field": "location",
                                                children: education.location
                                            }, void 0, false, {
                                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                lineNumber: 150,
                                                columnNumber: 43
                                            }, this)
                                        ]
                                    }, void 0, true) : "",
                                    education.graduationDate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            " in ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                "data-education-field": "graduationDate",
                                                children: education.graduationDate
                                            }, void 0, false, {
                                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                lineNumber: 151,
                                                columnNumber: 51
                                            }, this)
                                        ]
                                    }, void 0, true) : "",
                                    "."
                                ]
                            }, education.id, true, {
                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                lineNumber: 147,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                lineNumber: 140,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionHeading,
                        children: "PROFESSIONAL EXPERIENCE"
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].experienceList,
                        children: resume.experience.map((experience)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].experience,
                                "data-experience-index": resume.experience.indexOf(experience),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].clientRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Client:-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 19
                                                    }, this),
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        "data-experience-field": "company",
                                                        children: experience.company
                                                    }, void 0, false, {
                                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 19
                                                    }, this),
                                                    experience.location ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            ", ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                "data-experience-field": "location",
                                                                children: experience.location
                                                            }, void 0, false, {
                                                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                                lineNumber: 175,
                                                                columnNumber: 46
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : ""
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                lineNumber: 172,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dates,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        "data-experience-field": "startDate",
                                                        children: experience.startDate
                                                    }, void 0, false, {
                                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 19
                                                    }, this),
                                                    " –",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        "data-experience-field": "endDate",
                                                        children: experience.endDate
                                                    }, void 0, false, {
                                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                lineNumber: 178,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                        lineNumber: 171,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].role,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Role:-"
                                            }, void 0, false, {
                                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                "data-experience-field": "role",
                                                children: experience.role
                                            }, void 0, false, {
                                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                lineNumber: 186,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].responsibilitiesLabel,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Responsibilities:"
                                        }, void 0, false, {
                                            fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                            lineNumber: 190,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bulletList,
                                        children: experience.responsibilities.map((responsibility, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                "data-responsibility-index": index,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$preview$2f$BoldSkillsText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoldSkillsText"], {
                                                    text: responsibility,
                                                    skills: technicalSkills,
                                                    additionalSkills: allResumeSkills,
                                                    maxExtraHighlights: 2,
                                                    enabled: shouldBold("experience")
                                                }, void 0, false, {
                                                    fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 23
                                                }, this)
                                            }, `${experience.id}-responsibility-${index}`, false, {
                                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                lineNumber: 196,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                        lineNumber: 193,
                                        columnNumber: 15
                                    }, this),
                                    experience.environment.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$fixed$2d$resume$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].environment,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Environment:"
                                            }, void 0, false, {
                                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                lineNumber: 214,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            experience.environment.map((technology, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    "data-environment-index": index,
                                                    children: [
                                                        index > 0 && ", ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$preview$2f$BoldSkillsText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoldSkillsText"], {
                                                            text: technology,
                                                            skills: technicalSkills,
                                                            additionalSkills: allResumeSkills,
                                                            maxExtraHighlights: 1,
                                                            enabled: shouldBold("environment")
                                                        }, void 0, false, {
                                                            fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, `${experience.id}-environment-${technology}`, true, {
                                                    fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 23
                                                }, this)),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                        lineNumber: 213,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, experience.id, true, {
                                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/templates/fixed-resume/FixedResumeTemplate.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/builder/SectionSelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SectionSelector",
    ()=>SectionSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const sections = [
    {
        id: "professionalSummary",
        label: "Professional Summary",
        description: "Bold matching JD skills in professional-summary bullets."
    },
    {
        id: "technicalSkills",
        label: "Technical Skills",
        description: "Bold matching technologies in technical-skill categories."
    },
    {
        id: "experience",
        label: "Professional Experience",
        description: "Bold matching skills inside experience responsibilities."
    },
    {
        id: "environment",
        label: "Environment",
        description: "Bold matching skills in each client environment."
    }
];
function SectionSelector({ selectedSections, onChange }) {
    const selectAllRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const allSelected = selectedSections.length === sections.length;
    const partiallySelected = selectedSections.length > 0 && selectedSections.length < sections.length;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = partiallySelected;
        }
    }, [
        partiallySelected
    ]);
    function handleSelectAll() {
        if (allSelected) {
            onChange([]);
            return;
        }
        onChange(sections.map((section)=>section.id));
    }
    function handleSectionChange(sectionId) {
        if (selectedSections.includes(sectionId)) {
            onChange(selectedSections.filter((id)=>id !== sectionId));
            return;
        }
        onChange([
            ...selectedSections,
            sectionId
        ]);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "mt-4 rounded-2xl border border-violet-200 bg-white/90 p-4 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-[0.18em] text-violet-600",
                        children: "Skill Emphasis"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/SectionSelector.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mt-1 text-lg font-bold text-stone-900",
                        children: "Select sections for bolding skills"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/SectionSelector.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-stone-600",
                        children: "Matching skills extracted from the job description will be bolded only in the selected sections."
                    }, void 0, false, {
                        fileName: "[project]/components/builder/SectionSelector.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/SectionSelector.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "flex cursor-pointer items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/80 p-3 transition hover:border-violet-400 hover:bg-violet-100/80",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: selectAllRef,
                        type: "checkbox",
                        checked: allSelected,
                        onChange: handleSelectAll,
                        className: "h-5 w-5 cursor-pointer rounded border-violet-300 accent-violet-600"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/SectionSelector.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-semibold text-violet-900",
                                children: "Select All"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/SectionSelector.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-violet-700",
                                children: "Apply bold skill formatting to every supported section."
                            }, void 0, false, {
                                fileName: "[project]/components/builder/SectionSelector.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/SectionSelector.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/SectionSelector.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 grid gap-3 md:grid-cols-2",
                children: sections.map((section)=>{
                    const checked = selectedSections.includes(section.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: `flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${checked ? "border-violet-400 bg-violet-50 shadow-sm" : "border-stone-200 bg-[#fffdf8] hover:border-violet-300"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: checked,
                                onChange: ()=>handleSectionChange(section.id),
                                className: "mt-0.5 h-5 w-5 cursor-pointer rounded border-violet-300 accent-violet-600"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/SectionSelector.tsx",
                                lineNumber: 126,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-semibold text-stone-900",
                                        children: section.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/SectionSelector.tsx",
                                        lineNumber: 134,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xs leading-5 text-stone-600",
                                        children: section.description
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/SectionSelector.tsx",
                                        lineNumber: 138,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/builder/SectionSelector.tsx",
                                lineNumber: 133,
                                columnNumber: 15
                            }, this)
                        ]
                    }, section.id, true, {
                        fileName: "[project]/components/builder/SectionSelector.tsx",
                        lineNumber: 118,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/builder/SectionSelector.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 rounded-xl border border-violet-100 bg-[#fffaf0] px-4 py-3 text-sm text-stone-600",
                children: selectedSections.length === 0 ? "No sections selected." : `${selectedSections.length} of ${sections.length} sections selected.`
            }, void 0, false, {
                fileName: "[project]/components/builder/SectionSelector.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/SectionSelector.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/builder/RichTextToolbar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RichTextToolbar",
    ()=>RichTextToolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function RichTextToolbar({ editorRef }) {
    const savedRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function rememberSelection() {
            const selection = window.getSelection();
            if (!selection?.rangeCount || !editorRef.current) return;
            const range = selection.getRangeAt(0);
            if (editorRef.current.contains(range.commonAncestorContainer)) savedRange.current = range.cloneRange();
        }
        document.addEventListener("selectionchange", rememberSelection);
        return ()=>document.removeEventListener("selectionchange", rememberSelection);
    }, [
        editorRef
    ]);
    function run(command, value) {
        editorRef.current?.focus();
        if (savedRange.current) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(savedRange.current);
        }
        document.execCommand(command, false, value);
    }
    const action = (command, label)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            title: label,
            "aria-label": label,
            onMouseDown: (event)=>{
                event.preventDefault();
                run(command);
            },
            className: "min-w-9 rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm font-semibold hover:border-violet-400 hover:bg-violet-50",
            children: label
        }, void 0, false, {
            fileName: "[project]/components/builder/RichTextToolbar.tsx",
            lineNumber: 31,
            columnNumber: 54
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "sticky top-0 z-20 flex flex-wrap items-center gap-1.5 rounded-xl border border-violet-200 bg-[#fffaf0]/95 p-2 shadow-md backdrop-blur",
        children: [
            action("undo", "Undo"),
            action("redo", "Redo"),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mx-1 h-7 border-l"
            }, void 0, false, {
                fileName: "[project]/components/builder/RichTextToolbar.tsx",
                lineNumber: 35,
                columnNumber: 5
            }, this),
            action("bold", "B"),
            action("italic", "I"),
            action("underline", "U"),
            action("strikeThrough", "S"),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                "aria-label": "Font family",
                defaultValue: "",
                onChange: (event)=>{
                    if (event.target.value) run("fontName", event.target.value);
                    event.target.value = "";
                },
                className: "rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "Font"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 37,
                        columnNumber: 242
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        children: "Times New Roman"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 37,
                        columnNumber: 272
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        children: "Arial"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 37,
                        columnNumber: 304
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        children: "Calibri"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 37,
                        columnNumber: 326
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        children: "Cambria"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 37,
                        columnNumber: 350
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        children: "Georgia"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 37,
                        columnNumber: 374
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/RichTextToolbar.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                "aria-label": "Font size",
                defaultValue: "",
                onChange: (event)=>{
                    if (event.target.value) run("fontSize", event.target.value);
                    event.target.value = "";
                },
                className: "rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "Size"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 38,
                        columnNumber: 240
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "1",
                        children: "8"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 38,
                        columnNumber: 270
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "2",
                        children: "10"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 38,
                        columnNumber: 298
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "3",
                        children: "12"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 38,
                        columnNumber: 327
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "4",
                        children: "14"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 38,
                        columnNumber: 356
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "5",
                        children: "18"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 38,
                        columnNumber: 385
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "6",
                        children: "24"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 38,
                        columnNumber: 414
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "7",
                        children: "32"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 38,
                        columnNumber: 443
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/RichTextToolbar.tsx",
                lineNumber: 38,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                title: "Text color",
                className: "flex h-9 items-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-xs",
                children: [
                    "A",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        "aria-label": "Text color",
                        type: "color",
                        defaultValue: "#000000",
                        onInput: (event)=>run("foreColor", event.currentTarget.value),
                        className: "h-5 w-5"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 39,
                        columnNumber: 129
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/RichTextToolbar.tsx",
                lineNumber: 39,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                title: "Highlight color",
                className: "flex h-9 items-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-xs",
                children: [
                    "HL",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        "aria-label": "Highlight color",
                        type: "color",
                        defaultValue: "#fff59d",
                        onInput: (event)=>run("hiliteColor", event.currentTarget.value),
                        className: "h-5 w-5"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/RichTextToolbar.tsx",
                        lineNumber: 40,
                        columnNumber: 135
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/RichTextToolbar.tsx",
                lineNumber: 40,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mx-1 h-7 border-l"
            }, void 0, false, {
                fileName: "[project]/components/builder/RichTextToolbar.tsx",
                lineNumber: 41,
                columnNumber: 5
            }, this),
            action("justifyLeft", "Left"),
            action("justifyCenter", "Center"),
            action("justifyRight", "Right"),
            action("justifyFull", "Justify"),
            action("insertUnorderedList", "Bullets"),
            action("insertOrderedList", "Numbering"),
            action("outdent", "Outdent"),
            action("indent", "Indent"),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onMouseDown: (event)=>{
                    event.preventDefault();
                    const url = window.prompt("Paste the link URL");
                    if (url) run("createLink", url);
                },
                className: "rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm font-semibold",
                children: "Link"
            }, void 0, false, {
                fileName: "[project]/components/builder/RichTextToolbar.tsx",
                lineNumber: 44,
                columnNumber: 5
            }, this),
            action("unlink", "Unlink"),
            action("removeFormat", "Clear format")
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/RichTextToolbar.tsx",
        lineNumber: 33,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/builder/FileResumeEditor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileResumeEditor",
    ()=>FileResumeEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/* eslint-disable react-hooks/set-state-in-effect */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.mjs [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$FixedResumeTemplate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/templates/fixed-resume/FixedResumeTemplate.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$builder$2f$SectionSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/builder/SectionSelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$builder$2f$RichTextToolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/builder/RichTextToolbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$resume$2d$font$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/resume-font.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const DEFAULT_SECTIONS = [
    "professionalSummary",
    "experience"
];
function safeName(value) {
    return value.trim().replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
function downloadName(resume, format) {
    const parts = resume.personalInfo.fullName.trim().split(/\s+/);
    const candidate = safeName(parts.length > 1 ? `${parts[0]}_${parts.at(-1)}` : parts[0] || "Candidate");
    return `${candidate}_Resume.${format}`;
}
function FileResumeEditor() {
    const [resume, setResume] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [jsonText, setJsonText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [font, setFont] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$resume$2d$font$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESUME_FONT"]);
    const [fullPreview, setFullPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [downloading, setDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [previewHtml, setPreviewHtml] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [selectedSections, setSelectedSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SECTIONS);
    const [technicalSkills, setTechnicalSkills] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const loadFile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setError("");
        setNotice("");
        try {
            const guided = sessionStorage.getItem("guidedResumeData");
            if (guided) {
                const data = JSON.parse(guided);
                setResume(data.resume);
                setJsonText(JSON.stringify(data.resume, null, 2));
                setTechnicalSkills(data.technicalSkills);
                setSelectedSections(data.selectedSections);
                return;
            }
            const response = await fetch("/api/current-resume", {
                cache: "no-store"
            });
            const result = await response.json();
            if (!response.ok || !result.resume) throw new Error(result.error ?? "Unable to load the resume file.");
            setResume(result.resume);
            setJsonText(JSON.stringify(result.resume, null, 2));
            setTechnicalSkills(result.resume.technicalSkills.categories.flatMap((category)=>category.skills));
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Unable to load data/generated-resume.json.");
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void loadFile();
    }, [
        loadFile
    ]);
    function update(next) {
        setResume(next);
        setJsonText(JSON.stringify(next, null, 2));
        setError("");
        setNotice("Preview updated in memory. Copy the JSON into the VS Code file to keep it permanently.");
    }
    async function applyJson() {
        try {
            const parsed = JSON.parse(jsonText);
            const response = await fetch("/api/current-resume", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(parsed)
            });
            const result = await response.json();
            if (!response.ok || !result.resume) throw new Error(result.error ?? "Invalid resume JSON.");
            update(result.resume);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Invalid resume JSON.");
        }
    }
    async function copyJson() {
        await navigator.clipboard.writeText(jsonText);
        setNotice("Updated JSON copied. Paste it into data/generated-resume.json in VS Code and save.");
    }
    async function download(format) {
        if (!resume || downloading) return;
        setDownloading(format);
        setError("");
        try {
            const documentHtml = serializeEditedDocument();
            const editedResume = readDirectTextEdits();
            const response = await fetch(`/api/export/${format}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resume: editedResume,
                    technicalSkills,
                    selectedSections,
                    fontFamily: font,
                    documentHtml: format === "pdf" ? documentHtml : undefined
                })
            });
            if (!response.ok) throw new Error(`Unable to generate ${format.toUpperCase()}.`);
            const url = URL.createObjectURL(await response.blob());
            const link = document.createElement("a");
            link.href = url;
            link.download = downloadName(resume, format);
            link.click();
            setTimeout(()=>URL.revokeObjectURL(url), 1000);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Download failed.");
        } finally{
            setDownloading("");
        }
    }
    function readDirectTextEdits() {
        const root = editorRef.current;
        const next = structuredClone(resume);
        if (!root) return next;
        const text = (element)=>element?.innerText.replace(/\s+/g, " ").trim() ?? "";
        next.personalInfo.fullName = text(root.querySelector('[data-resume-field="fullName"]'));
        next.personalInfo.professionalTitle = text(root.querySelector('[data-resume-field="professionalTitle"]'));
        next.personalInfo.email = text(root.querySelector('[data-contact-field="email"]')).replace(/^\|\s*/, "");
        next.personalInfo.phone = text(root.querySelector('[data-contact-field="phone"]')).replace(/^\|\s*/, "");
        next.personalInfo.location = text(root.querySelector('[data-contact-field="location"]')).replace(/^\|\s*/, "");
        next.personalInfo.linkedIn = text(root.querySelector('[data-resume-field="linkedIn"]'));
        next.professionalSummary.bullets = Array.from(root.querySelectorAll("[data-summary-index]")).map((element)=>text(element)).filter(Boolean);
        next.technicalSkills.categories = Array.from(root.querySelectorAll("[data-skill-category-index]")).map((categoryElement)=>({
                name: text(categoryElement.querySelector("[data-skill-category-name]")).replace(/:\s*$/, ""),
                skills: Array.from(categoryElement.querySelectorAll("[data-skill-index]")).map((element)=>text(element).replace(/^,\s*/, "")).filter(Boolean)
            })).filter((category)=>category.name && category.skills.length);
        next.education = Array.from(root.querySelectorAll("[data-education-index]")).map((element)=>{
            const index = Number(element.getAttribute("data-education-index"));
            return {
                ...next.education[index],
                degree: text(element.querySelector('[data-education-field="degree"]')),
                institution: text(element.querySelector('[data-education-field="institution"]')),
                location: text(element.querySelector('[data-education-field="location"]')) || undefined,
                graduationDate: text(element.querySelector('[data-education-field="graduationDate"]')) || undefined
            };
        }).filter((item)=>item?.degree && item?.institution);
        next.experience = Array.from(root.querySelectorAll("[data-experience-index]")).map((element)=>{
            const index = Number(element.getAttribute("data-experience-index"));
            const original = next.experience[index];
            return {
                ...original,
                company: text(element.querySelector('[data-experience-field="company"]')),
                location: text(element.querySelector('[data-experience-field="location"]')),
                startDate: text(element.querySelector('[data-experience-field="startDate"]')),
                endDate: text(element.querySelector('[data-experience-field="endDate"]')),
                role: text(element.querySelector('[data-experience-field="role"]')),
                responsibilities: Array.from(element.querySelectorAll("[data-responsibility-index]")).map((item)=>text(item)).filter(Boolean),
                environment: Array.from(element.querySelectorAll("[data-environment-index]")).map((item)=>text(item).replace(/^,\s*/, "")).filter(Boolean)
            };
        }).filter((item)=>item?.company && item?.role);
        return next;
    }
    function serializeEditedDocument() {
        const source = editorRef.current?.firstElementChild;
        if (!source) return undefined;
        const clone = source.cloneNode(true);
        const sourceNodes = [
            source,
            ...Array.from(source.querySelectorAll("*"))
        ];
        const cloneNodes = [
            clone,
            ...Array.from(clone.querySelectorAll("*"))
        ];
        const properties = [
            "font-family",
            "font-size",
            "font-weight",
            "font-style",
            "text-decoration",
            "color",
            "background-color",
            "text-align",
            "line-height",
            "margin-top",
            "margin-right",
            "margin-bottom",
            "margin-left",
            "padding-top",
            "padding-right",
            "padding-bottom",
            "padding-left",
            "border-top",
            "border-right",
            "border-bottom",
            "border-left",
            "display",
            "list-style-type",
            "white-space"
        ];
        sourceNodes.forEach((node, index)=>{
            const target = cloneNodes[index];
            if (!target) return;
            const computed = window.getComputedStyle(node);
            for (const property of properties){
                let value = computed.getPropertyValue(property);
                if (property === "font-family") value = value.replace(/["']/g, "").split(",")[0]?.trim() ?? value;
                if (property === "background-color" && (value === "rgba(0, 0, 0, 0)" || value === "transparent")) continue;
                target.style.setProperty(property, value);
            }
            target.removeAttribute("contenteditable");
        });
        return clone.outerHTML;
    }
    function openFullPreview() {
        setPreviewHtml(serializeEditedDocument() ?? "");
        setFullPreview(true);
    }
    if (!resume) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto max-w-4xl p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-violet-200 bg-white p-6",
            children: error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-red-700",
                        children: "Resume file error"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                        lineNumber: 154,
                        columnNumber: 140
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-red-700",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                        lineNumber: 154,
                        columnNumber: 210
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm text-stone-600",
                        children: [
                            "Fix ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                children: "data/generated-resume.json"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 154,
                                columnNumber: 301
                            }, this),
                            ", save it, then reload."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                        lineNumber: 154,
                        columnNumber: 254
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>void loadFile(),
                        className: "mt-4 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white",
                        children: "Try again"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                        lineNumber: 154,
                        columnNumber: 367
                    }, this)
                ]
            }, void 0, true) : "Loading data/generated-resume.json…"
        }, void 0, false, {
            fileName: "[project]/components/builder/FileResumeEditor.tsx",
            lineNumber: 154,
            columnNumber: 62
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/builder/FileResumeEditor.tsx",
        lineNumber: 154,
        columnNumber: 23
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto max-w-7xl p-4 sm:p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "rounded-3xl border border-violet-200 bg-[#fffaf0] p-5 shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-bold uppercase tracking-[.18em] text-violet-600",
                        children: "File-driven · No AI key"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                        lineNumber: 157,
                        columnNumber: 89
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "mt-1 text-3xl font-bold text-violet-950",
                        children: "Resume from generated-resume.json"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                        lineNumber: 157,
                        columnNumber: 192
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-stone-600",
                        children: [
                            "Replace or edit ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                children: "data/generated-resume.json"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 157,
                                columnNumber: 337
                            }, this),
                            " in VS Code, restart the app, and this page loads it automatically."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                        lineNumber: 157,
                        columnNumber: 286
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex flex-wrap gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>void loadFile(),
                                className: "inline-flex items-center gap-2 rounded-xl border border-violet-300 bg-white px-4 py-2 font-semibold text-violet-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 157,
                                        columnNumber: 658
                                    }, this),
                                    " Reload file"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 157,
                                columnNumber: 490
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: font,
                                onChange: (event)=>setFont(event.target.value),
                                className: "rounded-xl border border-violet-300 bg-white px-3 py-2",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$resume$2d$font$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESUME_FONT_OPTIONS"].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        children: item
                                    }, item, false, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 157,
                                        columnNumber: 888
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 157,
                                columnNumber: 701
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>void download("pdf"),
                                disabled: Boolean(downloading),
                                className: "inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white disabled:opacity-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 157,
                                        columnNumber: 1133
                                    }, this),
                                    downloading === "pdf" ? "Creating…" : "Download PDF"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 157,
                                columnNumber: 933
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>void download("docx"),
                                disabled: Boolean(downloading),
                                className: "inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white disabled:opacity-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 157,
                                        columnNumber: 1418
                                    }, this),
                                    downloading === "docx" ? "Creating…" : "Download DOCX"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 157,
                                columnNumber: 1217
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                        lineNumber: 157,
                        columnNumber: 447
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                lineNumber: 157,
                columnNumber: 5
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                lineNumber: 158,
                columnNumber: 15
            }, this),
            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800",
                children: notice
            }, void 0, false, {
                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                lineNumber: 158,
                columnNumber: 118
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$builder$2f$SectionSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SectionSelector"], {
                selectedSections: selectedSections,
                onChange: setSelectedSections
            }, void 0, false, {
                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                lineNumber: 159,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-5 grid gap-5 lg:grid-cols-[.72fr_1.28fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "rounded-2xl border border-violet-200 bg-white p-4 shadow-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold",
                                                children: "Edit JSON and content"
                                            }, void 0, false, {
                                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                lineNumber: 161,
                                                columnNumber: 160
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-stone-600",
                                                children: "All fields can be changed here. Validate before previewing."
                                            }, void 0, false, {
                                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                lineNumber: 161,
                                                columnNumber: 220
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 161,
                                        columnNumber: 155
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>void copyJson(),
                                        className: "rounded-lg border border-violet-300 px-3 py-2 text-sm font-semibold text-violet-700",
                                        children: "Copy updated JSON"
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 161,
                                        columnNumber: 327
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 161,
                                columnNumber: 88
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: jsonText,
                                onChange: (event)=>setJsonText(event.target.value),
                                spellCheck: false,
                                className: "mt-4 h-[540px] w-full rounded-xl bg-stone-950 p-4 font-mono text-xs leading-5 text-emerald-100"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 161,
                                columnNumber: 495
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>void applyJson(),
                                className: "mt-3 w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white",
                                children: "Validate edits and update preview"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 161,
                                columnNumber: 703
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-5 border-t pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-bold",
                                                children: "Quick summary controls"
                                            }, void 0, false, {
                                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                lineNumber: 162,
                                                columnNumber: 96
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>update({
                                                        ...resume,
                                                        professionalSummary: {
                                                            bullets: [
                                                                ...resume.professionalSummary.bullets,
                                                                "Add new summary text here."
                                                            ]
                                                        }
                                                    }),
                                                className: "inline-flex items-center gap-1 text-sm font-semibold text-violet-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 381
                                                    }, this),
                                                    " Add text"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                lineNumber: 162,
                                                columnNumber: 149
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 162,
                                        columnNumber: 45
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 space-y-2",
                                        children: resume.professionalSummary.bullets.map((bullet, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-2 rounded-lg bg-stone-50 p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex-1 text-xs leading-5",
                                                        children: bullet
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 607
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        disabled: resume.professionalSummary.bullets.length === 1,
                                                        onClick: ()=>update({
                                                                ...resume,
                                                                professionalSummary: {
                                                                    bullets: resume.professionalSummary.bullets.filter((_, itemIndex)=>itemIndex !== index)
                                                                }
                                                            }),
                                                        className: "text-red-600 disabled:opacity-30",
                                                        "aria-label": "Remove summary text",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 964
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 665
                                                    }, this)
                                                ]
                                            }, `${bullet}-${index}`, true, {
                                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                lineNumber: 162,
                                                columnNumber: 513
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 162,
                                        columnNumber: 422
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 162,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                        lineNumber: 161,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "rounded-2xl border border-violet-200 bg-stone-200 p-3 shadow-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 flex items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "font-bold",
                                                children: "Edit directly on the resume"
                                            }, void 0, false, {
                                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                lineNumber: 164,
                                                columnNumber: 159
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-stone-600",
                                                children: "Click text, select it, type, delete, or use the formatting toolbar. Direct edits are included in both downloads."
                                            }, void 0, false, {
                                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                lineNumber: 164,
                                                columnNumber: 217
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 164,
                                        columnNumber: 154
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: openFullPreview,
                                        className: "inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                                lineNumber: 164,
                                                columnNumber: 536
                                            }, this),
                                            " Full preview"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 164,
                                        columnNumber: 377
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 164,
                                columnNumber: 92
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$builder$2f$RichTextToolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RichTextToolbar"], {
                                editorRef: editorRef
                            }, void 0, false, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 164,
                                columnNumber: 580
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 max-h-[900px] overflow-auto rounded-lg bg-stone-400 p-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: editorRef,
                                    contentEditable: true,
                                    suppressContentEditableWarning: true,
                                    spellCheck: true,
                                    className: "mx-auto min-h-[1056px] w-[816px] max-w-full bg-white p-8 shadow-xl outline-none focus:ring-4 focus:ring-violet-300",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$templates$2f$fixed$2d$resume$2f$FixedResumeTemplate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FixedResumeTemplate"], {
                                        resume: resume,
                                        technicalSkills: technicalSkills,
                                        selectedSections: selectedSections,
                                        fontFamily: font
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                        lineNumber: 164,
                                        columnNumber: 904
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                    lineNumber: 164,
                                    columnNumber: 698
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 164,
                                columnNumber: 620
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/FileResumeEditor.tsx",
                        lineNumber: 164,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                lineNumber: 160,
                columnNumber: 5
            }, this),
            fullPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 bg-black/75 p-3 sm:p-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-stone-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between bg-white p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Resume preview"
                                }, void 0, false, {
                                    fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                    lineNumber: 166,
                                    columnNumber: 241
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setFullPreview(false),
                                    className: "inline-flex items-center gap-1 rounded-lg border px-3 py-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                            lineNumber: 166,
                                            columnNumber: 389
                                        }, this),
                                        " Close"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                    lineNumber: 166,
                                    columnNumber: 272
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/builder/FileResumeEditor.tsx",
                            lineNumber: 166,
                            columnNumber: 177
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto w-[816px] max-w-full bg-white p-8 shadow-xl",
                                dangerouslySetInnerHTML: {
                                    __html: previewHtml
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                                lineNumber: 166,
                                columnNumber: 462
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/builder/FileResumeEditor.tsx",
                            lineNumber: 166,
                            columnNumber: 424
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/builder/FileResumeEditor.tsx",
                    lineNumber: 166,
                    columnNumber: 80
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/builder/FileResumeEditor.tsx",
                lineNumber: 166,
                columnNumber: 21
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/FileResumeEditor.tsx",
        lineNumber: 156,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=_194is_2._.js.map