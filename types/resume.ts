export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
}

export interface ProfessionalSummary {
  bullets: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface TechnicalSkills {
  categories: SkillCategory[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  environment: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  location?: string;
  graduationDate?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer?: string;
  year?: string;
}

export interface MasterResume {
  personalInfo: PersonalInfo;
  professionalSummary: ProfessionalSummary;
  technicalSkills: TechnicalSkills;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}