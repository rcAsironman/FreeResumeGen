export type Resume = {
  personalInfo: {
    fullName: string;
    professionalTitle: string;
    email: string;
    phone: string;
    location: string;
    portfolio?: string;
  };
  professionalSummary: { bullets: string[] };
  technicalSkills: { categories: { name: string; skills: string[] }[] };
  experience: {
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    description?: string;
    projectName?: string;
    responsibilityGroups?: { heading: string; startIndex: number }[];
    responsibilities: string[];
    environment: string[];
  }[];
  projects: { id: string; name: string; description: string; technologies: string[]; highlights: string[] }[];
  education: { id: string; institution: string; degree: string; location?: string; graduationDate?: string }[];
  certifications: { id: string; name: string; issuer?: string; year?: string }[];
};

export type ProfileSettings = {
  schemaVersion: 1;
  profileType: "full-time" | "c2c";
  personalInfo: { fullName: string; email: string; phone: string; location: string; portfolio?: string };
  education: { id: string; institution: string; degree: string; location?: string; graduationDate?: string }[];
  certifications: { id: string; name: string; issuer?: string; year?: string; credentialId?: string; verificationLink?: string; badgeId?: string; logo?: string; logoSize?: number; logoPosition?: { x: number; y: number }; visible?: boolean }[];
  companies: CompanySettings[];
  preferences: { maxExperienceYears: number; summaryBullets: number; latestCompanyBullets: number; otherCompanyBullets: number };
};

export type CompanySettings = {
  id?: string; companyName: string; clientName: string; industry: string; location: string; jobTitle: string;
  startDate: string; endDate: string; isCurrent: boolean;
  technologies: string[]; responsibilities: string[];
  projects: { id?: string; name: string; industry: string; clientName: string; context: string; technologies: string[]; responsibilities: string[] }[];
};

export type DraftClaim = { id: string; path: string; section: string; companyId?: string; text: string; status: "needs-confirmation" | "confirmed" | "rejected"; memoryKey: string };

export type JDRequirement = { text: string; kind: "required" | "preferred" | "responsibility"; keywords: string[] };
export type JDAnalysis = { targetRole: string; seniority: string; industry: string; requirements: JDRequirement[]; experienceYears: number | null };

export const emptyProfile = (profileType: "full-time" | "c2c"): ProfileSettings => ({
  schemaVersion: 1, profileType,
  personalInfo: { fullName: "", email: "", phone: "", location: "" },
  education: [], certifications: [], companies: [],
  preferences: { maxExperienceYears: profileType === "c2c" ? 13 : 8, summaryBullets: 8, latestCompanyBullets: 10, otherCompanyBullets: 7 },
});
