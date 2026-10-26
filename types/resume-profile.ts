export type ResumeProfile = "java" | "kafka" | "general";

export const PROFILE_LABELS: Record<ResumeProfile, string> = { java: "Java", kafka: "Kafka", general: "Any role from JD" };

export const PROFILE_DEFAULT_FILES: Record<ResumeProfile, string> = {
  general: "master-resume-general.json",
  java: "master-resume-java.json",
  kafka: "master-resume-kafka.json",
};
