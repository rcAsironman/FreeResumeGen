"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { OriginalResumeEditor, originalResumeHTML } from "@/components/original-resume-editor";
import { createEditedDocx, snapshotDocument, saveResumeDownload } from "@/lib/document-export";
import { analyzeJD, companyId } from "@/lib/jd";
import { proposeJDTimeline, reviewEmploymentDates } from "@/lib/timeline";
import { buildPrompt, findHeadlineOnlyMatch, isDraftGenerationReady } from "@/lib/prompt";
import { prettyIssues, profileSchema, resumeSchema } from "@/lib/contracts";
import { matchExperienceToJD, scoreAlignment } from "@/lib/alignment";
import { evaluateResumeStrength } from "@/lib/resume-quality";
import { claimsFromResume } from "@/lib/claims";
import { certificationBadges, loadBadgeDataUrl } from "@/lib/certification-badges";
import { recommendCertificationBadges } from "@/lib/certification-recommendations";
import { selectDraftAchievements, confirmedMetricEvidence, parseSyntheticAchievementDraft, type AchievementEvidence, type SyntheticAchievementDraft } from "@/lib/achievements";

import { starterProfiles } from "@/lib/default-settings";
import { emptyProfile, type DraftClaim, type ProfileSettings, type Resume } from "@/types/resume";

const STORE = "resume-studio-v2";
const ACTIVE = "resume-studio-v2-active-profile";
const CONFIRMATIONS = "resume-studio-v2-confirmed-statements";
const ACHIEVEMENTS = "resume-studio-v2-achievement-evidence";
const BADGE_MIGRATION = "resume-studio-v2-official-badges-loaded";
type Notice = { kind: "success" | "error" | "info"; text: string } | null;

function downloadFile(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob); const link = document.createElement("a");
  link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}

function readInitialProfiles(): Record<"full-time" | "c2c", ProfileSettings> {
  const hasCandidateData = (profile: ProfileSettings) => Boolean(profile.personalInfo.fullName || profile.personalInfo.email || profile.personalInfo.phone || profile.education.length || profile.companies.length || profile.certifications.length);
  try {
    const raw = localStorage.getItem(STORE); if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const full = profileSchema.safeParse(parsed["full-time"]); const c2c = profileSchema.safeParse(parsed.c2c);
      return {
        "full-time": full.success && hasCandidateData(full.data) ? full.data : starterProfiles["full-time"],
        c2c: c2c.success && hasCandidateData(c2c.data) ? c2c.data : starterProfiles.c2c,
      };
    }
  } catch { /* start with clean settings when local data is malformed */ }
  return starterProfiles;
}



export default function ResumeApp() {
  const [activeTab, setActiveTab] = useState<"builder" | "settings">("builder");
  const [activeStep, setActiveStep] = useState(1);
  const [toasts, setToasts] = useState<{ id: string; title: string; text: string }[]>([]);
  const [downloading, setDownloading] = useState("");
  const [downloadStatus, setDownloadStatus] = useState<Notice>(null);
  const [profileType, setProfileType] = useState<"full-time" | "c2c">("full-time");
  const [profiles, setProfiles] = useState<Record<"full-time" | "c2c", ProfileSettings>>({ "full-time": emptyProfile("full-time"), c2c: emptyProfile("c2c") });
  const [settingsText, setSettingsText] = useState("");
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resume, setResume] = useState<Resume | null>(null);
  const [claims, setClaims] = useState<DraftClaim[]>([]);
  const [confirmedStatements, setConfirmedStatements] = useState<Record<"full-time" | "c2c", Record<string, string>>>({ "full-time": {}, c2c: {} });
  const [achievementEvidenceByProfile, setAchievementEvidenceByProfile] = useState<Record<"full-time" | "c2c", AchievementEvidence[]>>({ "full-time": [], c2c: [] });
  const [syntheticAchievementDraft, setSyntheticAchievementDraft] = useState<SyntheticAchievementDraft | null>(null);
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [hydrated, setHydrated] = useState(false);
  const [referenceDate, setReferenceDate] = useState(() => new Date(0));

  useEffect(() => {
    const stepFromHash = () => {
      const match = window.location.hash.match(/^#step-(\d{2})$/);
      const namedSteps: Record<string, number> = { "#profile-step": 1, "#experience-match": 1, "#job-description": 1, "#resume-import": 2, "#resume-preview": 2 };
      if (match) setActiveStep((Number(match[1]) >= 6 ? 2 : 1));
      else if (namedSteps[window.location.hash]) setActiveStep(namedSteps[window.location.hash]!);
    };
    stepFromHash();
    window.addEventListener("hashchange", stepFromHash);
    return () => window.removeEventListener("hashchange", stepFromHash);
  }, []);

  function goToStep(step: number) {
    const next = Math.min(2, Math.max(1, step));
    setActiveStep(next);
    const target = next === 1 ? "job-description" : "resume-import";
    window.history.replaceState(null, "", `#${target}`);
    requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  useEffect(() => {
    const loaded = readInitialProfiles(); const previous = localStorage.getItem(ACTIVE);
    loaded.c2c = { ...loaded.c2c, preferences: { ...loaded.c2c.preferences, maxExperienceYears: 13 } };
    if (localStorage.getItem(BADGE_MIGRATION) !== "done") {
      if (!loaded["full-time"].certifications.length) loaded["full-time"] = { ...loaded["full-time"], certifications: starterProfiles["full-time"].certifications };
      if (!loaded.c2c.certifications.length) loaded.c2c = { ...loaded.c2c, certifications: starterProfiles.c2c.certifications };
      localStorage.setItem(BADGE_MIGRATION, "done");
    }
    const selected = previous === "full-time" || previous === "c2c" ? previous : "full-time";
    let memory: Record<string, Record<string, string>> = {};
    try { memory = JSON.parse(localStorage.getItem(CONFIRMATIONS) ?? "{}"); } catch { /* reset invalid confirmation metadata */ }
    let achievementMemory: Record<string, AchievementEvidence[]> = {};
    try { achievementMemory = JSON.parse(localStorage.getItem(ACHIEVEMENTS) ?? "{}"); } catch { /* reset invalid metric review metadata */ }
    queueMicrotask(() => { setProfiles(loaded); setProfileType(selected); setSettingsText(JSON.stringify(loaded[selected], null, 2)); setConfirmedStatements({ "full-time": memory["full-time"] ?? {}, c2c: memory.c2c ?? {} }); setAchievementEvidenceByProfile({ "full-time": Array.isArray(achievementMemory["full-time"]) ? achievementMemory["full-time"]! : [], c2c: Array.isArray(achievementMemory.c2c) ? achievementMemory.c2c : [] }); setReferenceDate(new Date());
      try {
        const saved = JSON.parse(localStorage.getItem("resume-studio-v2-work") ?? "null");
        if (saved && saved.profileType === selected) {
          setJd(typeof saved.jd === "string" ? saved.jd : "");
          setResumeText(typeof saved.resumeText === "string" ? saved.resumeText : "");
          setPrompt(typeof saved.prompt === "string" ? saved.prompt : "");
          const restored = resumeSchema.safeParse(saved.resume);
          if (restored.success) { setResume(restored.data); setClaims(claimsFromResume(restored.data, loaded[selected], new Set())); }
          setActiveStep(saved.activeStep === 2 ? 2 : 1);
        }
      } catch { /* Invalid saved work never prevents opening the app. */ }
      setHydrated(true); });
  }, []);
  useEffect(() => { if (!hydrated) return; localStorage.setItem(STORE, JSON.stringify(profiles)); localStorage.setItem(ACTIVE, profileType); localStorage.setItem(CONFIRMATIONS, JSON.stringify(confirmedStatements)); localStorage.setItem(ACHIEVEMENTS, JSON.stringify(achievementEvidenceByProfile)); }, [profiles, profileType, confirmedStatements, achievementEvidenceByProfile, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("resume-studio-v2-work", JSON.stringify({ profileType, jd, resumeText, resume, prompt, activeStep, syntheticAchievementDraft })); }
    catch { /* Current work remains usable when storage is full or disabled. */ }
  }, [hydrated, profileType, jd, resumeText, resume, prompt, activeStep, syntheticAchievementDraft]);

  function addToast(title: string, text: string) {
    setToasts((current) => [...current, { id: crypto.randomUUID(), title, text }]);
  }

  const currentProfile = profiles[profileType];
  const badgeRecommendations = useMemo(() => recommendCertificationBadges(jd, currentProfile.certifications), [jd, currentProfile.certifications]);
  const confirmedMemory = confirmedStatements[profileType];
  const confirmedSourceFacts = Object.entries(confirmedMemory).flatMap(([key, text]) => {
    const [savedProfile, section, sourceId] = key.split("|");
    if (savedProfile !== profileType || !sourceId) return [];
    const company = currentProfile.companies.find((item) => companyId(item) === sourceId);
    return company ? [{ companyId: sourceId, companyName: company.companyName, section, text }] : [];
  });
  const settingsDraft = useMemo(() => {
    try { const parsed = profileSchema.safeParse(JSON.parse(settingsText)); return parsed.success && parsed.data.profileType === profileType ? parsed.data : currentProfile; }
    catch { return currentProfile; }
  }, [settingsText, profileType, currentProfile]);
  const analysis = useMemo(() => jd.trim() ? analyzeJD(jd) : null, [jd]);
  const employmentReview = useMemo(() => reviewEmploymentDates(currentProfile.companies, referenceDate), [currentProfile.companies, referenceDate]);
  const resumeTimeline = useMemo(() => analysis?.experienceYears !== null && analysis
    ? proposeJDTimeline(currentProfile.companies, analysis, currentProfile.preferences.maxExperienceYears, referenceDate)
    : null, [analysis, currentProfile.companies, currentProfile.preferences.maxExperienceYears, referenceDate]);
  const experienceMatch = useMemo(() => matchExperienceToJD(analysis, currentProfile, confirmedSourceFacts), [analysis, currentProfile, confirmedSourceFacts]);
  const alignment = useMemo(() => analysis ? scoreAlignment(analysis, resume, currentProfile, confirmedSourceFacts, claims.filter((claim) => claim.status === "needs-confirmation").map((claim) => claim.text), referenceDate) : null, [analysis, resume, currentProfile, confirmedSourceFacts, claims, referenceDate]);
  const achievementEvidence = achievementEvidenceByProfile[profileType];
  const resumeStrength = useMemo(() => analysis ? evaluateResumeStrength(analysis, resume, currentProfile, confirmedSourceFacts, achievementEvidence) : null, [analysis, resume, currentProfile, confirmedSourceFacts, achievementEvidence]);
  const missingEvidenceCompanies = currentProfile.companies.flatMap((company) => {
    const hasResponsibilities = company.responsibilities.length > 0 || company.technologies.length > 0 || company.projects.some((project) => project.responsibilities.length > 0 || project.technologies.length > 0 || Boolean(project.context.trim()));
    return hasResponsibilities ? [] : [company.companyName];
  });
  const canGeneratePrompt = isDraftGenerationReady(analysis, currentProfile);


  function setProfile(next: "full-time" | "c2c") { setProfileType(next); setSettingsText(JSON.stringify(profiles[next], null, 2)); setResume(null); setClaims([]); setResumeText(""); setSyntheticAchievementDraft(null); localStorage.setItem(ACTIVE, next); }
  function setBadgeVisible(id: string, visible: boolean) {
    const updated = { ...currentProfile, certifications: currentProfile.certifications.map((item) => item.id === id ? { ...item, visible } : item) };
    setProfiles((previous) => ({ ...previous, [profileType]: updated }));
    setSettingsText(JSON.stringify(updated, null, 2));
  }
  function updatePreviewBadge(id: string, patch: Partial<ProfileSettings["certifications"][number]>) {
    const updated = { ...currentProfile, certifications: currentProfile.certifications.map((item) => item.id === id ? { ...item, ...patch } : item) };
    setProfiles((previous) => ({ ...previous, [profileType]: updated }));
    setSettingsText(JSON.stringify(updated, null, 2));
  }
  function updateCompany(companyKey: string, update: (company: ProfileSettings["companies"][number]) => ProfileSettings["companies"][number]) {
    let parsed: unknown;
    try { parsed = JSON.parse(settingsText); } catch { setNotice({ kind: "error", text: "Fix the settings JSON before editing company details." }); return; }
    const result = profileSchema.safeParse(parsed);
    if (!result.success || result.data.profileType !== profileType) { setNotice({ kind: "error", text: "Validate the current profile settings before editing company details." }); return; }
    const next = { ...result.data, companies: result.data.companies.map((company) => companyId(company) === companyKey ? update(company) : company) };
    setSettingsText(JSON.stringify(next, null, 2));
  }
  function updateCompanyFields(companyKey: string, patch: Partial<ProfileSettings["companies"][number]>) {
    updateCompany(companyKey, (company) => ({ ...company, ...patch }));
  }
  function updateCompanyLines(companyKey: string, field: "technologies" | "responsibilities", text: string) {
    updateCompanyFields(companyKey, { [field]: text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) });
  }
  function addCompany() {
    const company = { id: crypto.randomUUID(), companyName: "New employer", clientName: "", industry: "", location: "", jobTitle: "", startDate: "", endDate: "", isCurrent: false, technologies: [], responsibilities: [], projects: [] };
    const next = { ...settingsDraft, companies: [...settingsDraft.companies, company] };
    setSettingsText(JSON.stringify(next, null, 2));
  }
  function removeCompany(companyKey: string) {
    const next = { ...settingsDraft, companies: settingsDraft.companies.filter((company) => companyId(company) !== companyKey) };
    setSettingsText(JSON.stringify(next, null, 2));
  }
  function updateProject(companyKey: string, index: number, patch: Partial<ProfileSettings["companies"][number]["projects"][number]>) {
    updateCompany(companyKey, (company) => ({ ...company, projects: company.projects.map((project, i) => i === index ? { ...project, ...patch } : project) }));
  }
  function updateProjectLines(companyKey: string, index: number, field: "technologies" | "responsibilities", text: string) {
    updateProject(companyKey, index, { [field]: text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) });
  }
  function addProject(companyKey: string) {
    updateCompany(companyKey, (company) => ({ ...company, projects: [...company.projects, { id: crypto.randomUUID(), name: `Project ${company.projects.length + 1}`, industry: company.industry, clientName: company.clientName, context: "", technologies: [], responsibilities: [] }] }));
  }
  function removeProject(companyKey: string, index: number) {
    updateCompany(companyKey, (company) => ({ ...company, projects: company.projects.filter((_, i) => i !== index) }));
  }
  function validateSettings(save: boolean) {
    let candidate: unknown; try { candidate = JSON.parse(settingsText); } catch (error) { setNotice({ kind: "error", text: `Settings JSON syntax error: ${(error as Error).message}` }); return false; }
    const result = profileSchema.safeParse(candidate);
    if (!result.success) { setNotice({ kind: "error", text: prettyIssues(result.error).slice(0, 5).join(" · ") }); return false; }
    if (result.data.profileType !== profileType) { setNotice({ kind: "error", text: `This JSON is for ${result.data.profileType}. Open that profile tab before importing it.` }); return false; }
    const normalized = result.data.profileType === "c2c" ? { ...result.data, preferences: { ...result.data.preferences, maxExperienceYears: 13 } } : result.data;
    if (save) { setProfiles((prev) => ({ ...prev, [profileType]: normalized })); setSettingsText(JSON.stringify(normalized, null, 2)); setResume(null); setClaims([]); setNotice({ kind: "success", text: `${profileType === "full-time" ? "Full-Time" : "C2C"} settings validated and saved in this browser.` }); }
    else setNotice({ kind: "success", text: "Settings JSON is valid." });
    return true;
  }
  function updateCertification(id: string, patch: Partial<ProfileSettings["certifications"][number]>) {
    let parsed: unknown;
    try { parsed = JSON.parse(settingsText); } catch { setNotice({ kind: "error", text: "Fix or validate the settings JSON before editing certifications." }); return; }
    const result = profileSchema.safeParse(parsed);
    if (!result.success || result.data.profileType !== profileType) { setNotice({ kind: "error", text: "Validate the current profile settings before editing certifications." }); return; }
    const next = { ...result.data, certifications: result.data.certifications.map((credential) => credential.id === id ? { ...credential, ...patch } : credential) };
    setSettingsText(JSON.stringify(next, null, 2));
  }
  function addCertification() {
    let parsed: unknown;
    try { parsed = JSON.parse(settingsText); } catch { setNotice({ kind: "error", text: "Fix or validate the settings JSON before adding a certification." }); return; }
    const result = profileSchema.safeParse(parsed);
    if (!result.success || result.data.profileType !== profileType) { setNotice({ kind: "error", text: "Validate the current profile settings before adding a certification." }); return; }
    const next = { ...result.data, certifications: [...result.data.certifications, { id: crypto.randomUUID(), name: "", issuer: "", year: "", logoSize: 72, visible: false }] };
    setSettingsText(JSON.stringify(next, null, 2));
  }
  async function selectCertificationBadge(id: string, badgeId: string) {
    if (!badgeId) { updateCertification(id, { badgeId: undefined, logo: undefined }); return; }
    const badge = certificationBadges.find((item) => item.id === badgeId);
    if (!badge) return;
    try {
      const logo = await loadBadgeDataUrl(badgeId);
      const credential = settingsDraft.certifications.find((item) => item.id === id);
      updateCertification(id, { badgeId, logo, name: credential?.name.trim() ? credential.name : badge.name });
      setNotice({ kind: "success", text: `${badge.name} badge imported. Choose “Show badge” if you want it on the resume, then save the profile.` });
    } catch (error) { setNotice({ kind: "error", text: (error as Error).message }); }
  }
  function removeCertification(id: string) {
    let parsed: unknown;
    try { parsed = JSON.parse(settingsText); } catch { setNotice({ kind: "error", text: "Fix or validate the settings JSON before removing a certification." }); return; }
    const result = profileSchema.safeParse(parsed);
    if (!result.success || result.data.profileType !== profileType) { setNotice({ kind: "error", text: "Validate the current profile settings before removing a certification." }); return; }
    setSettingsText(JSON.stringify({ ...result.data, certifications: result.data.certifications.filter((credential) => credential.id !== id) }, null, 2));
  }
  async function importCertificationLogo(id: string, file?: File) {
    if (!file) return;
    if (!(file.type === "image/png" || file.type === "image/jpeg")) { setNotice({ kind: "error", text: "Use a PNG or JPEG certification badge image." }); return; }
    if (file.size > 1_000_000) { setNotice({ kind: "error", text: "Badge image must be 1 MB or smaller so it can be stored with this profile." }); return; }
    const logo = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read image")); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); }).catch(() => "");
    if (!logo) { setNotice({ kind: "error", text: "Could not import that badge image." }); return; }
    updateCertification(id, { logo, badgeId: undefined });
    setNotice({ kind: "success", text: `${file.name} imported. Save the profile settings to keep the badge.` });
  }
  function validateResume() {
    let response: unknown; try { response = JSON.parse(resumeText); } catch (error) { setResume(null); setSyntheticAchievementDraft(null); setNotice({ kind: "error", text: `Resume JSON syntax error: ${(error as Error).message}` }); return; }
    const responseObject = response && typeof response === "object" && !Array.isArray(response) ? response as Record<string, unknown> : null;
    const isEnvelope = Boolean(responseObject && Object.hasOwn(responseObject, "resume"));
    const candidate = isEnvelope ? responseObject!.resume : response;
    setSyntheticAchievementDraft(null);
    const result = resumeSchema.safeParse(candidate);
    if (!result.success) { setResume(null); setClaims([]); setNotice({ kind: "error", text: prettyIssues(result.error).slice(0, 6).join(" · ") }); return; }
    const importAnalysis = analysis ?? analyzeJD(`Role: ${result.data.personalInfo.professionalTitle}`);
    let separated: ReturnType<typeof selectDraftAchievements>;
    try { separated = selectDraftAchievements(result.data as Resume, importAnalysis); } catch (error) { setResume(null); setClaims([]); setNotice({ kind: "error", text: (error as Error).message }); return; }
    // Imported JSON is authoritative. Company Settings are only a Step 1 source.
    const draft = separated.resume;
    setResume(draft); setClaims([]);
    const importedSyntheticDraft = isEnvelope ? parseSyntheticAchievementDraft(responseObject!.syntheticAchievementDraft, draft) : null;
    setSyntheticAchievementDraft(separated.synthetic.examples.length ? separated.synthetic : importedSyntheticDraft);
    const syntheticCount = separated.synthetic.examples.length + (importedSyntheticDraft?.examples.length ?? 0);
    const syntheticNotice = syntheticCount ? ` ${syntheticCount} synthetic example${syntheticCount === 1 ? "" : "s"} retained in the draft as unverified examples.` : " Resume JSON loaded.";
    const roleWarning = analysis ? findHeadlineOnlyMatch(draft, analysis) : null;
    setNotice({ kind: roleWarning ? "info" : "success", text: roleWarning ?? `Resume ready.${syntheticNotice} Review the preview before downloading.` });
  }
  async function copyPrompt() {
    if (!jd.trim()) { setNotice({ kind: "error", text: "Paste a job description first." }); return; }

    const nextAnalysis = analyzeJD(jd); const nextPrompt = buildPrompt(jd, nextAnalysis, currentProfile, confirmedSourceFacts, referenceDate, achievementEvidence); setPrompt(nextPrompt);
    try { await navigator.clipboard.writeText(nextPrompt); addToast("Prompt copied", "Copied to your clipboard. Paste it into ChatGPT, then bring the response to Step 2."); setNotice({ kind: "success", text: "Prompt copied. Paste it into ChatGPT, then bring the complete JSON answer back to Step 2." }); }
    catch { setNotice({ kind: "info", text: "Prompt is ready below. Select and copy it manually if clipboard access is blocked." }); }
  }
  async function copyCorrectionPrompt() {
    if (!analysis || !alignment || !resume) return;
    const findings = alignment.checks.filter((item) => item.status !== "supported");
    const qualityFindings = resumeStrength?.findings ?? [];
    const bulletQualityFindings = resumeStrength?.bulletFindings ?? [];
    const unsupportedSkills = resumeStrength?.unsupportedSkills ?? [];
    const corrective = `Revise the resume content below to align closely with the role and requirements in the JD. First build an employer-by-employer evidence map from profile facts, project records, and candidate-confirmed statements. Use confirmed source facts first. When source facts are sparse, add distinct employer-specific, technically concrete review options using role-relevant JD technologies and implementation tasks; the app marks these unconfirmed and excludes them from final exports until approved. Keep the application-ready resume evidence-based: use actual metrics only when confirmed evidence supports the same employer. Separately generate 2–4 role-relevant synthetic percentage examples per employer when distinct technical responsibilities support them. Set their status to synthetic-unverified, tie each to an exact responsibility and employer ID, and never place them in the resume JSON, summary, skills, environment, or project content. Synthetic values are fictional demonstrations, not candidate accomplishments. When no metric is supported, use concrete qualitative results only if source facts establish them, or describe the implementation without claiming an outcome. Improve weak bullets using a concrete action, technology/component, implementation or troubleshooting detail, and purpose where the source supports it. Do not force a repeated sentence template or copy identical responsibilities between employers. Use only source-recorded or confirmed technologies in each employer's Environment. Keep projects tied to configured project records, preserve the employer association, and do not create projects to fill empty sections. Check every technical skill against source or candidate-confirmed evidence; do not list unsupported JD keywords as established experience. Preserve configured employer names, IDs, official titles, locations, education, certifications, and the exact start and end dates already present in the resume JSON. The application handles candidate fact review separately. Keep every JSON value in polished, direct resume voice; never include workflow, review, application, or requirement commentary in the resume text. Return only a JSON object with exactly two root keys: resume (the unchanged resume schema) and syntheticAchievementDraft (status synthetic-unverified plus examples containing employerId, employer, exact sourceResponsibility, achievementExample with one percentage, metricType, numeric percentage, direction, and status synthetic-unverified). Keep every synthetic example outside resume. The JD alignment and internal resume-strength estimates recalculate after revised JSON is loaded.

Current JD analysis:
${JSON.stringify(analysis, null, 2)}

JD alignment findings:
${JSON.stringify(findings, null, 2)}

Resume-strength findings:
${JSON.stringify(qualityFindings, null, 2)}

Bullet-level technical-depth findings:
${JSON.stringify(bulletQualityFindings, null, 2)}

Skills without source-history evidence:
${JSON.stringify(unsupportedSkills, null, 2)}

Candidate-attested achievement metric evidence (only these numeric outcomes may be used; statuses and measurement context must remain accurate):
${JSON.stringify(confirmedMetricEvidence(achievementEvidence), null, 2)}

Current resume draft:
${JSON.stringify(resume, null, 2)}

Selected candidate profile and source work history:
${JSON.stringify(currentProfile, null, 2)}

Job description:
${jd}`;
    try { await navigator.clipboard.writeText(corrective); setNotice({ kind: "success", text: "Proposed-draft improvement prompt copied. New narrative statements will need confirmation." }); }
    catch { setPrompt(corrective); setNotice({ kind: "info", text: "Correction prompt is shown in the prompt box for manual copying." }); }
  }
  function downloadAlignmentReport() {
    if (!alignment || !analysis) return;
    const report = { targetRole: analysis.targetRole, estimate: alignment.score, breakdown: alignment.breakdown, resumeStrength, missingKeywords: alignment.missingKeywords, unsupportedClaims: alignment.unsupportedClaims, unconfirmedClaims: alignment.checks.filter((x) => x.status === "unconfirmed draft claim"), disclaimer: alignment.disclaimer, supported: alignment.checks.filter((x) => x.status === "supported"), missingFromDraft: alignment.checks.filter((x) => x.status === "supported but missing from draft"), unsupportedDraftClaims: alignment.checks.filter((x) => x.status === "unsupported draft claim"), notDocumented: alignment.checks.filter((x) => x.status === "not documented") };
    downloadFile("jd-alignment-report.json", new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
  }
  async function exportDocument(candidate: Resume, format: "docx" | "pdf" | "json") {
    if (downloading) return;
    setDownloading(format);
    setDownloadStatus({ kind: "info", text: `Creating and saving ${format.toUpperCase()}…` });
    try {
      let blob: Blob;
      const root = document.querySelector<HTMLElement>(".original-paper[data-resume-paper]");
      if (format === "json") blob = new Blob([JSON.stringify(candidate, null, 2)], { type: "application/json" });
      else if (!root) throw new Error("Open the resume preview before downloading.");
      else if (resume && originalResumeHTML(candidate) !== originalResumeHTML(resume)) {
        throw new Error("The confirmed content differs from the preview. Review the resume before downloading.");
      } else if (format === "docx") blob = await createEditedDocx(root);
      else {
        const response = await fetch("/api/render-pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ html: await snapshotDocument(root) }) });
        if (!response.ok) throw new Error((await response.json()).error ?? "PDF export failed.");
        blob = await response.blob();
      }
      const saved = await saveResumeDownload(blob, candidate.personalInfo.fullName, format);
      setNotice({ kind: "success", text: `Saved ${saved.filePath}` });
      setDownloadStatus({ kind: "success", text: `Saved successfully: ${saved.filePath}` });
      addToast("Resume saved", saved.filePath);
    } catch (error) { const failure = { kind: "error" as const, text: (error as Error).message }; setNotice(failure); setDownloadStatus(failure); }
    finally { setDownloading(""); }
  }
  async function downloadJSON() { if (resume) await exportDocument(resume, "json"); }
  async function downloadDocx() { if (resume) await exportDocument(resume, "docx"); }
  async function renderPDF(candidate: Resume) { await exportDocument(candidate, "pdf"); }
  async function downloadPDF() { if (resume) await renderPDF(resume); }
  async function importFile(event: React.ChangeEvent<HTMLInputElement>, kind: "settings" | "resume") {
    const file = event.target.files?.[0]; if (!file) return;
    try { const text = await file.text(); if (kind === "settings") setSettingsText(text); else { setResumeText(text); setResume(null); setClaims([]); setSyntheticAchievementDraft(null); } setNotice({ kind: "info", text: `${file.name} loaded. Validate it before using.` }); }
    catch { setNotice({ kind: "error", text: "Could not read the selected file." }); }
    event.target.value = "";
  }
  function exportSettings() { downloadFile(`${profileType}-settings.json`, new Blob([JSON.stringify(currentProfile, null, 2)], { type: "application/json" })); }

  return <main className="app-shell" data-active-step={activeStep}>
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">R</span><span>Resume Studio<small>JD-first · Evidence-based</small></span></a><nav><button className={activeTab === "builder" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("builder")}>Resume builder</button><button className={activeTab === "settings" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("settings")}>Company Settings</button></nav><span className="private-label">Saved in this browser</span></header>
    <section id="top" className="hero"><div><span className="eyebrow">MANUAL CHATGPT WORKFLOW · NO API KEY</span><h1>JD to tailored resume</h1><p>Select your profile, paste a job description, and build a targeted resume draft for review.</p></div><div className="hero-chip"><span className="live-dot"/> Two independent profiles <b>Full-Time · C2C</b></div></section>
    {notice && <div role="status" className={`notice ${notice.kind}`}><span>{notice.text}</span><button onClick={() => setNotice(null)} aria-label="Dismiss notice">×</button></div>}

    <aside className="side-toasts" aria-label="Notifications" aria-live="polite">{toasts.map((toast) => <div className="side-toast" key={toast.id}><button type="button" aria-label={`Close ${toast.title} notification`} onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}>×</button><strong>{toast.title}</strong><p>{toast.text}</p></div>)}</aside>
    {activeTab === "builder" ? <>
      <nav className="workflow-guide" aria-label="Resume workflow">{[[1,"Job description & prompt"],[2,"Paste response & download"]].map(([step,label]) => <button type="button" key={step} className={activeStep === step ? "active" : ""} aria-current={activeStep === step ? "step" : undefined}  onClick={() => goToStep(Number(step))}><b>{step}</b><span>{label}</span></button>)}</nav>
      <section id="profile-step" className="profile-bar panel"><div><span className="field-label">SAVED PROFILE</span><div className="segmented"><button className={profileType === "full-time" ? "selected" : ""} onClick={() => setProfile("full-time")}>Full-Time</button><button className={profileType === "c2c" ? "selected" : ""} onClick={() => setProfile("c2c")}>C2C</button></div></div><p className="helper">This selects your saved candidate details. Company facts and dates stay in Company Settings.</p><button className="button quiet" onClick={() => setActiveTab("settings")}>Edit work history →</button></section>
      <section id="step-02" className="panel profile-bar"><div><span className="field-label">PROFILE FACTS</span><h2>Your saved work history</h2><p className="helper">Employers: {currentProfile.companies.length} · Work details recorded: {currentProfile.companies.length - missingEvidenceCompanies.length} · Saved dates total {employmentReview.years} years {employmentReview.remainingMonths} months.</p></div><button className="button quiet" onClick={() => setActiveTab("settings")}>Edit work history →</button>{missingEvidenceCompanies.length > 0 && <div className="evidence-warning profile-evidence-warning"><b>Work details are missing for {missingEvidenceCompanies.join(", ")}.</b> You can still generate a draft; unsupported work suggestions remain clearly identified.</div>}<div className="timeline-proposal"><b>{resumeTimeline ? `JD-based draft window: ${resumeTimeline.targetYears} years` : "Resume dates: use saved source dates"}</b>{resumeTimeline ? <><small>The JD states {analysis?.experienceYears} years. Proposed draft dates are calculated backward from today and shown for review before final export.</small><div>{resumeTimeline.entries.map((entry) => <small key={entry.id}>{entry.companyName}: {entry.proposedStartDate} – {entry.proposedEndDate}</small>)}</div></> : <small>No numeric experience duration was detected. Saved employer dates remain unchanged.</small>}{employmentReview.overlaps.length > 0 && <small>Saved-date overlap warning: {employmentReview.overlaps.join("; ")}</small>}</div><a className="button primary" href="#job-description">Continue to job description ↓</a></section>

      <div className="workspace-grid">
        <div className="workspace-column">
      <section id="job-description" className="panel section-card"><div className="section-title"><div className="step">01</div><div><span className="field-label">STEP 1 · JOB DESCRIPTION</span><h2>Paste the job description</h2></div></div><p className="helper">Paste the complete JD. Target role, seniority, years, skills, and responsibilities are analyzed locally; nothing is sent to an API.</p><textarea className="jd-input" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the complete job description here…"/><div className="input-footer"><span>{jd.length.toLocaleString()} characters · local analysis updates as you type</span>{analysis && <a className="button primary" href="#experience-match">Continue to JD match ↓</a>}</div>{analysis && <div className="analysis-strip"><div><span>Target role</span><strong>{analysis.targetRole}</strong></div><div><span>Experience in JD</span><strong>{analysis.experienceYears ? `${analysis.experienceYears} years` : "Not specified"}</strong></div><div><span>Industry</span><strong>{analysis.industry}</strong></div></div>}</section>

          {analysis && experienceMatch && <section id="experience-match" className="panel section-card evidence-match-card"><div className="section-title"><div className="step">04</div><div><span className="field-label">STEP 2 · JD MATCH</span><h2>Compare the JD with your work history</h2></div><div className="score-orb"><strong>{experienceMatch.score}</strong><span>/ 100</span></div></div><p className="helper">This estimate compares the JD with recorded facts. Gaps stay visible; generation can still draft unverified suggestions for review.</p>{missingEvidenceCompanies.length > 0 && <div className="evidence-warning"><b>Source details missing:</b> {missingEvidenceCompanies.join(", ")}. Draft generation is still available; unsupported suggestions will be labeled unverified.</div>}<div className="requirements-list">{experienceMatch.checks.slice(0, 20).map((item, index) => { const styleStatus = item.status === "not documented" ? "missing" : item.status; return <div className="requirement" key={`${item.text}-${index}`}><span className={`status-dot ${styleStatus}`}/><div><strong>{item.text}</strong><small>{item.rationale}</small></div><span className={`status-label ${styleStatus}`}>{item.status}</span></div>; })}</div><div className="input-footer"><span>Use the prompt to create a proposed draft. Gaps remain visible for your review.</span><a className="button primary" href="#step-05">Continue to prompt ↓</a></div></section>}

          <section id="step-05" className="panel section-card"><div className="section-title"><div className="step">01</div><div><span className="field-label">STEP 1 · COPY PROMPT</span><h2>Generate in ChatGPT (manual)</h2></div></div><p className="helper">Copy the prompt, open ChatGPT yourself, paste it, and send it. The prompt returns complete resume JSON with supported measurable results directly in the experience bullets. Paste the response in Step 2. No API connection is used.</p>{missingEvidenceCompanies.length > 0 && <div className="evidence-warning">Draft generation is available. Companies without source work facts will receive unverified AI suggestions that require your review and confirmation.</div>}<div className="button-row"><button className="button primary" disabled={!canGeneratePrompt} onClick={() => void copyPrompt()}>Copy prompt for ChatGPT</button><button className="button secondary" disabled={!canGeneratePrompt} onClick={() => { if (!jd.trim()) return setNotice({ kind: "error", text: "Paste a job description in Step 2 first." }); setPrompt(buildPrompt(jd, analyzeJD(jd), currentProfile, confirmedSourceFacts, referenceDate, achievementEvidence)); setNotice({ kind: "success", text: "Prompt is shown below. Select and copy it, then paste it into ChatGPT." }); }}>Show prompt here</button><button className="button quiet" onClick={() => setActiveTab("settings")}>Open Company Settings →</button></div>{prompt && <textarea className="code-input prompt-box" readOnly value={prompt} onFocus={(e) => e.currentTarget.select()} aria-label="Generated ChatGPT prompt"/>}<div className="input-footer"><span>When ChatGPT returns the complete JSON object, continue to import it.</span><a className="button primary" href="#resume-import">Continue to import ↓</a></div></section>

          <section id="resume-import" className="panel section-card"><div className="section-title"><div className="step">02</div><div><span className="field-label">STEP 2 · PASTE RESPONSE</span><h2>Bring ChatGPT’s resume back</h2></div></div><p className="helper">Paste or import complete resume JSON for any candidate. Its details and dates are used as supplied, independently of Company Settings. Click <b>Generate resume</b> to open the preview. </p><label className="file-button">Import JSON file<input type="file" accept=".json,application/json" onChange={(e) => void importFile(e, "resume")}/></label><textarea className="code-input resume-json" value={resumeText} onChange={(e) => { setResumeText(e.target.value); setResume(null); setClaims([]); setSyntheticAchievementDraft(null); }} placeholder="Paste the complete JSON response here…" aria-label="Resume JSON editor"/><div className="input-footer"><span>{resume ? "Resume ready · preview alongside" : "Waiting for ChatGPT JSON"}</span><button className="button primary" onClick={validateResume}>Generate resume</button>{resume && <a className="button primary" href="#resume-preview">Continue to preview ↓</a>}</div></section>

        </div>

        <aside className="workspace-column right-column">
          <section id="step-08" className="panel score-card"><div className="score-header"><div><span className="field-label">JD ALIGNMENT</span><h2>Evidence-based JD alignment</h2></div><div className="score-orb"><strong>{alignment?.score ?? "—"}</strong><span>/ 100</span></div></div><p className="helper">{alignment?.disclaimer ?? "This estimate compares JD requirements with your recorded work history and draft."}</p>{alignment && <><div className="alignment-summary"><span><b>{alignment.checks.filter((item) => item.status === "supported").length}</b> supported</span><span><b>{alignment.checks.filter((item) => item.status === "supported but missing from draft").length}</b> supported but missing</span><span><b>{alignment.checks.filter((item) => item.status === "not documented").length}</b> not documented</span><span><b>{alignment.checks.filter((item) => item.status === "unsupported draft claim").length}</b> unsupported</span><span><b>{alignment.checks.filter((item) => item.status === "unconfirmed draft claim").length}</b> unconfirmed</span></div><div className="alignment-breakdown"><span>Role / title <b>{alignment.breakdown.roleTitle}%</b></span><span>Skills <b>{alignment.breakdown.skills === null ? "No skills scored" : `${alignment.breakdown.skills}%`}</b></span><span>Responsibilities <b>{alignment.breakdown.responsibilities === null ? "No duties scored" : `${alignment.breakdown.responsibilities}%`}</b></span><span>Experience <b>{alignment.breakdown.experience === null ? "Not specified in JD" : `${alignment.breakdown.experience}%`}</b></span></div><div className="button-row score-actions"><button className="button secondary" onClick={downloadAlignmentReport}>Download evaluation</button><button className="button primary" disabled={!resume} onClick={() => void copyCorrectionPrompt()}>Optimize Resume</button></div><p className="score-refresh-help">Optimize Resume copies a revision prompt for ChatGPT. Paste it there, then import the revised JSON in Step 2. The ATS report updates from the newly loaded draft; unsupported skills remain gaps.</p><div className="quality-panel"><div className="quality-heading"><div><span className="field-label">RESUME STRENGTH · INTERNAL QUALITY ESTIMATE</span><h3>Technical depth and writing quality</h3></div><strong>{resumeStrength?.score ?? "—"}<small>/ 100</small></strong></div><p className="helper">{resumeStrength?.disclaimer ?? "Load a draft to assess technical detail, role relevance, and readability."}</p>{resumeStrength && <p className="achievement-score-note">Achievements: <b>{resumeStrength.achievementMetrics.evidencedClaims}</b> evidenced · <b>{resumeStrength.achievementMetrics.estimatedClaims}</b> estimated · <b>{resumeStrength.achievementMetrics.unsupportedClaims}</b> unsupported number claims</p>}{resumeStrength && <><div className="alignment-breakdown quality-breakdown">{resumeStrength.dimensions.map((dimension) => <span key={dimension.name}>{dimension.name} <b>{dimension.score}%</b></span>)}</div><div className="requirements-list">{resumeStrength.dimensions.map((dimension) => <div className="requirement" key={dimension.name}><div><strong>{dimension.name} · {dimension.weight}% weight</strong><small>{dimension.reason}</small></div><span className="status-label">{dimension.score}/100</span></div>)}{resumeStrength.findings.map((finding) => <div className="requirement quality-finding" key={finding}><span className="status-dot partial"/><div><strong>Suggestion</strong><small>{finding}</small></div></div>)}{resumeStrength.unsupportedSkills.slice(0, 12).map((item) => <div className="requirement quality-finding" key={`skill-${item.skill}`}><span className="status-dot missing"/><div><strong>Skill needs evidence · {item.skill}</strong><small>Listed in Technical Skills only. Add employer evidence, confirm the statement, or remove it.</small></div></div>)}{resumeStrength.bulletFindings.slice(0, 12).map((item) => <div className="requirement quality-finding" key={item.path}><span className="status-dot partial"/><div><strong>{item.employer} · Bullet needs refinement</strong><small>{item.issues.join(" ")}</small></div></div>)}</div></>}</div><div className="requirements-list">{alignment.checks.slice(0, 30).map((item, i) => { const stateClass = item.status === "unsupported draft claim" ? "unsupported" : item.status === "unconfirmed draft claim" ? "unconfirmed" : item.status === "supported but missing from draft" ? "partial" : item.status === "not documented" ? "missing" : "supported"; return <div className="requirement" key={`${item.text}-${i}`}><span className={`status-dot ${stateClass}`}/><div><strong>{item.text}</strong><small>{item.rationale}</small></div><span className={`status-label ${stateClass}`}>{item.status}</span></div>; })}</div></>}</section>
          <section id="resume-preview" className="panel preview-card"><div className="preview-top"><div><span className="field-label">STEP 2 · PREVIEW AND DOWNLOAD</span><h2>Preview and download</h2></div><div className="download-menu"><button className="button primary" disabled={!resume || Boolean(downloading)} onClick={() => void downloadDocx()}>{downloading === "docx" ? "Saving DOCX…" : "Download DOCX"}</button><button className="button primary" disabled={!resume || Boolean(downloading)} onClick={() => void downloadPDF()}>{downloading === "pdf" ? "Saving PDF…" : "Download PDF"}</button><button className="button secondary" disabled={!resume || Boolean(downloading)} onClick={() => void downloadJSON()}>{downloading === "json" ? "Saving JSON…" : "Download JSON"}</button></div></div>{resume && syntheticAchievementDraft && syntheticAchievementDraft.examples.length > 0 && <p className="helper">Selected quantified examples: {resume.experience.map((job) => `${job.company}: ${syntheticAchievementDraft.examples.filter((example) => example.employerId === job.id).length}`).join(" · ")}. Other paired bullets use qualitative wording. Generate again to choose another random mix.</p>}<div className="download-feedback" aria-live="polite"><p>Files save directly into your Downloads folder, inside today’s dated resume folder. Chrome’s download popup will not appear.</p>{downloadStatus && <p className={`notice ${downloadStatus.kind}`} role={downloadStatus.kind === "error" ? "alert" : "status"}>{downloadStatus.text}</p>}</div>{currentProfile.certifications.length > 0 && <details className="badge-picker"><summary>Choose and arrange header badges · {currentProfile.certifications.filter((item) => item.visible).length} selected</summary><p className="badge-picker-help">Select badges, adjust each size, or drag a badge directly on the resume preview. Changes save automatically.</p>{badgeRecommendations.length > 0 && <div className="badge-recommendations"><b>Suggested for this JD</b>{badgeRecommendations.map(({ certification, provider, reason }) => <button type="button" className="badge-recommendation" key={certification.id} disabled={Boolean(certification.visible)} onClick={() => updatePreviewBadge(certification.id, { visible: true })}><span>{certification.name}</span><small>{reason} · {provider}{certification.visible ? " · already selected" : " · add badge"}</small></button>)}<small className="badge-recommendation-note">Only display a certification badge if you hold that credential.</small></div>}<div className="badge-picker-list">{currentProfile.certifications.map((item) => <div className="badge-picker-item" key={item.id}><label className="badge-picker-select"><input type="checkbox" checked={Boolean(item.visible)} onChange={(event) => setBadgeVisible(item.id, event.target.checked)}/><span>{item.name || "Unnamed certification"}</span>{item.logo && <Image src={item.logo} alt="" width={30} height={30} unoptimized/>}</label>{item.visible && item.logo && <div className="badge-picker-adjust"><label>Size <input type="range" min="32" max="140" step="4" value={item.logoSize ?? 72} onChange={(event) => updatePreviewBadge(item.id, { logoSize: Number(event.target.value) })}/><output>{item.logoSize ?? 72}px</output></label><label>Horizontal <input type="number" value={item.logoPosition?.x ?? 0} onChange={(event) => updatePreviewBadge(item.id, { logoPosition: { x: Number(event.target.value) || 0, y: item.logoPosition?.y ?? 0 } })}/></label><label>Vertical <input type="number" value={item.logoPosition?.y ?? 0} onChange={(event) => updatePreviewBadge(item.id, { logoPosition: { x: item.logoPosition?.x ?? 0, y: Number(event.target.value) || 0 } })}/></label></div>}</div>)}</div></details>}{resume ? <OriginalResumeEditor resume={resume} profile={currentProfile} onChange={(updated) => { setResume(updated); setResumeText(JSON.stringify(updated, null, 2)); setClaims(claimsFromResume(updated, currentProfile, new Set(Object.keys(confirmedStatements[profileType])))); }} onPositionChange={(id, position) => updatePreviewBadge(id, { logoPosition: position })}/> : <div className="empty-preview"><span className="paper-icon">▤</span><strong>Your proposed resume will appear here</strong><p>Load imported JSON to review proposed claims before you download.</p></div>}</section>
        </aside>
      </div>
    </> : <section className="settings-layout">
      <div className="panel settings-intro"><span className="field-label">STEP 2 · CANDIDATE WORK HISTORY</span><h2>Company Settings</h2><p>Enter the work you actually performed at each employer. The JD is matched against these facts. Company names and industries alone do not verify work; missing details can still receive clearly labeled draft suggestions. Your settings stay in this browser.</p><div className="segmented"><button className={profileType === "full-time" ? "selected" : ""} onClick={() => setProfile("full-time")}>Full-Time profile</button><button className={profileType === "c2c" ? "selected" : ""} onClick={() => setProfile("c2c")}>C2C profile</button></div><div className="education-note"><b>Education selection</b><span>Full-Time includes the configured master’s education. C2C includes the configured bachelor’s education. Confirm dates, roles, and each work statement before exporting.</span></div><button className="button primary" onClick={() => { if (!validateSettings(true)) return; setActiveTab("builder"); requestAnimationFrame(() => document.getElementById("job-description")?.scrollIntoView({ behavior: "smooth", block: "start" })); }}>Save and continue to job description →</button></div>
      <div className="panel settings-editor">
        <div className="editor-toolbar"><div><span className="field-label">{profileType.toUpperCase()} PROFILE</span><h2>Candidate and employer facts</h2></div><div className="button-row"><label className="file-button">Import settings<input type="file" accept=".json,application/json" onChange={(e) => void importFile(e, "settings")}/></label><button className="button secondary" onClick={exportSettings}>Export settings</button></div></div>
        <p className="helper">Add optional work facts where available. Generation still works without them; unsupported suggestions remain unverified until you confirm them.</p>
        {settingsDraft.companies.length === 0 ? <p className="cert-empty">No employers yet. Add one to begin recording work history.</p> : <div className="company-editor-list">{settingsDraft.companies.map((company) => { const companyKey = companyId(company); return <article className="company-editor-card" key={companyKey}>
          <div className="company-editor-header"><div><span className="field-label">EMPLOYER SOURCE</span><h3>{company.companyName || "New employer"}</h3></div><button className="button secondary" onClick={() => removeCompany(companyKey)}>Remove employer</button></div>
          <div className="company-meta-grid">
            <label>Employer<input value={company.companyName} onChange={(event) => updateCompanyFields(companyKey, { companyName: event.target.value })}/></label>
            <label>Actual job title<input value={company.jobTitle} onChange={(event) => updateCompanyFields(companyKey, { jobTitle: event.target.value })} placeholder="Title held at this employer"/></label>
            <label>Client<input value={company.clientName} onChange={(event) => updateCompanyFields(companyKey, { clientName: event.target.value })}/></label>
            <label>Industry<input value={company.industry} onChange={(event) => updateCompanyFields(companyKey, { industry: event.target.value })}/></label>
            <label>Location<input value={company.location} onChange={(event) => updateCompanyFields(companyKey, { location: event.target.value })}/></label>
            <label>Actual start date<input value={company.startDate} onChange={(event) => updateCompanyFields(companyKey, { startDate: event.target.value })} placeholder="e.g. Mar 2021"/></label>
            <label>Actual end date<input value={company.endDate} disabled={company.isCurrent} onChange={(event) => updateCompanyFields(companyKey, { endDate: event.target.value })} placeholder="e.g. Oct 2023"/></label>
            <label className="current-role-check"><input type="checkbox" checked={company.isCurrent} onChange={(event) => updateCompanyFields(companyKey, { isCurrent: event.target.checked, endDate: event.target.checked ? "Present" : company.endDate === "Present" ? "" : company.endDate })}/> Current employer</label>
          </div>
          <div className="company-work-grid">
            <label>Responsibilities you actually performed<textarea value={company.responsibilities.join("\n")} onChange={(event) => updateCompanyLines(companyKey, "responsibilities", event.target.value)} placeholder="One real responsibility per line. Include what you personally did and the system or problem involved."/></label>
            <label>Technologies you personally used<textarea value={company.technologies.join("\n")} onChange={(event) => updateCompanyLines(companyKey, "technologies", event.target.value)} placeholder="One technology per line. Do not add tools you only saw in the JD."/></label>
          </div>
          <div className="project-editor-heading"><div><b>Projects at this employer</b><small>Keep each project&apos;s tools and responsibilities with that project.</small></div><button className="button quiet" onClick={() => addProject(companyKey)}>Add project</button></div>
          {company.projects.length === 0 ? <p className="cert-empty">No project facts added.</p> : <div className="project-editor-list">{company.projects.map((project, index) => <div className="project-editor-card" key={project.id ?? `${companyKey}-project-${index}`}>
            <div className="company-meta-grid project-meta-grid"><label>Project name<input value={project.name} onChange={(event) => updateProject(companyKey, index, { name: event.target.value })}/></label><label>Project industry<input value={project.industry} onChange={(event) => updateProject(companyKey, index, { industry: event.target.value })}/></label><label>Project client<input value={project.clientName} onChange={(event) => updateProject(companyKey, index, { clientName: event.target.value })}/></label></div>
            <label className="project-context-field">Project facts<textarea value={project.context} onChange={(event) => updateProject(companyKey, index, { context: event.target.value })} placeholder="What the project did, your contribution, and the real outcome, if known."/></label>
            <div className="company-work-grid"><label>Responsibilities<textarea value={project.responsibilities.join("\n")} onChange={(event) => updateProjectLines(companyKey, index, "responsibilities", event.target.value)} placeholder="One actual responsibility per line."/></label><label>Technologies<textarea value={project.technologies.join("\n")} onChange={(event) => updateProjectLines(companyKey, index, "technologies", event.target.value)} placeholder="One technology per line."/></label></div>
            <button className="button secondary" onClick={() => removeProject(companyKey, index)}>Remove project</button>
          </div>)}</div>}
        </article>; })}</div>}
        <div className="company-settings-actions"><button className="button secondary" onClick={addCompany}>Add employer</button><button className="button primary" onClick={() => validateSettings(true)}>Validate and save profile</button></div>
        <details className="advanced-json"><summary>Advanced: import or edit raw settings JSON</summary><textarea className="code-input settings-json" value={settingsText} onChange={(e) => setSettingsText(e.target.value)} spellCheck={false} aria-label={`${profileType} settings JSON`}/><div className="input-footer"><span>Use this when moving settings between browsers or editing advanced fields.</span><button className="button secondary" onClick={() => validateSettings(false)}>Validate JSON</button></div></details>
        <div className="cert-settings"><div className="editor-toolbar"><div><span className="field-label">CREDENTIALS · OPTIONAL BADGES</span><h3>Certification logos</h3></div><button className="button primary" onClick={addCertification}>Add certification</button></div><p className="helper">Add only credentials you hold. Select an official badge or import a PNG/JPEG image. Badges are hidden by default; turn on “Show badge” to display one on the resume.</p>
          {settingsDraft.certifications.length === 0 ? <p className="cert-empty">No certifications configured for this profile.</p> : <div className="cert-list">{settingsDraft.certifications.map((credential) => <article className="cert-row" key={credential.id}>
            <div className="cert-fields"><label>Certification name<input value={credential.name} onChange={(event) => updateCertification(credential.id, { name: event.target.value })} placeholder="Credential name"/></label><label>Issuer<input value={credential.issuer ?? ""} onChange={(event) => updateCertification(credential.id, { issuer: event.target.value })} placeholder="Issuer"/></label><label>Year<input value={credential.year ?? ""} onChange={(event) => updateCertification(credential.id, { year: event.target.value })} placeholder="Year"/></label></div>
            <div className="cert-badge-controls"><label>Official badge<select value={credential.badgeId ?? ""} onChange={(event) => void selectCertificationBadge(credential.id, event.target.value)}><option value="">Choose a badge…</option>{certificationBadges.map((badge) => <option key={badge.id} value={badge.id}>{badge.name}</option>)}</select></label><label className="file-button">Import image<input type="file" accept="image/png,image/jpeg" onChange={(event) => { void importCertificationLogo(credential.id, event.target.files?.[0]); event.target.value = ""; }}/></label>{credential.logo && <Image className="cert-badge-preview" src={credential.logo} alt={`${credential.name || "Certification"} badge preview`} width={54} height={54} unoptimized/>}<label className="cert-visible"><input type="checkbox" checked={Boolean(credential.visible)} onChange={(event) => updateCertification(credential.id, { visible: event.target.checked })}/> Show badge</label><label className="cert-size">Size <input type="number" min="24" max="140" value={credential.logoSize ?? 72} onChange={(event) => { const size = Math.max(24, Math.min(140, Number(event.target.value) || 72)); updateCertification(credential.id, { logoSize: size }); }}/></label><button className="button secondary" onClick={() => removeCertification(credential.id)}>Remove</button></div>
          </article>)}</div>}
        </div>
        <p className="helper settings-save-note">Profile edits are drafts until you choose <b>Validate and save profile</b>. Saved settings persist in this browser.</p>
        <details className="schema-help"><summary>Settings format guide</summary><p>Each company stores employer, client, actual title, location, actual dates, responsibilities, technologies, and project facts. Certification badge images are embedded in the profile JSON and remain hidden unless “Show badge” is selected.</p></details>
      </div>
    </section>}
    <footer className="footer"><span>Resume Studio v2</span><span>Evidence-based tailoring · No external API calls · Your profile data stays in this browser</span></footer>
  </main>;
}
