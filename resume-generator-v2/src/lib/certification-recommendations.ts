import type { ProfileSettings } from "@/types/resume";

type Certification = ProfileSettings["certifications"][number];

const providers = [
  { id: "aws", label: "AWS", jd: /\baws\b|amazon web services|amazon msk/i, credential: /\baws\b|amazon web services/i },
  { id: "azure", label: "Azure", jd: /\bazure\b|microsoft azure/i, credential: /\bazure\b|microsoft/i },
  { id: "gcp", label: "Google Cloud", jd: /\bgcp\b|google cloud/i, credential: /google cloud|\bgcp\b/i },
  { id: "kafka", label: "Kafka / Confluent", jd: /\bkafka\b|confluent/i, credential: /\bkafka\b|confluent/i },
];

export function recommendCertificationBadges(jd: string, certifications: Certification[]) {
  const normalizedJD = jd.toLowerCase();
  const focus = [
    { key: "devops", patterns: /devops|site reliability|\bsre\b|ci\/cd|platform operations/i },
    { key: "developer", patterns: /developer|software engineer|application engineer|programming|\bapi\b/i },
    { key: "administrator", patterns: /administrator|administration|operations|infrastructure|production support/i },
    { key: "architect", patterns: /architect|architecture|design|cloud solution/i },
  ].find((item) => item.patterns.test(normalizedJD))?.key;

  return certifications.flatMap((certification) => {
    if (!certification.logo) return [];
    const provider = providers.find((item) => item.jd.test(normalizedJD) && item.credential.test(certification.name));
    if (!provider) return [];
    const name = certification.name.toLowerCase();
    const focusMatch = focus && name.includes(focus);
    const rank = (focusMatch ? 5 : 0) + (certification.visible ? -1 : 0);
    return [{ certification, provider: provider.label, reason: focusMatch ? `Relevant to the JD’s ${focus} focus` : `The JD names ${provider.label}`, rank }];
  }).sort((a, b) => b.rank - a.rank || a.certification.name.localeCompare(b.certification.name)).slice(0, 3);
}
