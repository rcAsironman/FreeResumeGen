export const certificationBadges = [
  { id: "aws-saa", name: "AWS Certified Solutions Architect – Associate", file: "aws-solutions-architect-associate.png" },
  { id: "aws-developer", name: "AWS Certified Developer – Associate", file: "aws-developer-associate.png" },
  { id: "aws-devops", name: "AWS Certified DevOps Engineer – Professional", file: "aws-devops-engineer-professional.png" },
  { id: "azure-admin", name: "Microsoft Certified: Azure Administrator Associate (AZ-104)", file: "azure-administrator-associate.png" },
  { id: "azure-devops", name: "Microsoft Certified: DevOps Engineer Expert (AZ-400)", file: "azure-devops-engineer-expert.png" },
  { id: "azure-architect", name: "Microsoft Certified: Azure Solutions Architect Expert (AZ-305)", file: "azure-solutions-architect-expert.png" },
  { id: "gcp-architect", name: "Google Cloud Professional Cloud Architect", file: "gcp-cloud-architect-professional.png" },
  { id: "gcp-developer", name: "Google Cloud Professional Cloud Developer", file: "gcp-cloud-developer-professional.png" },
  { id: "gcp-devops", name: "Google Cloud Professional Cloud DevOps Engineer", file: "gcp-cloud-devops-professional.png" },
  { id: "confluent-admin", name: "Confluent Certified Administrator for Apache Kafka (CCAAK)", file: "confluent-administrator-kafka.png" },
  { id: "confluent-developer", name: "Confluent Certified Developer for Apache Kafka (CCDAK)", file: "confluent-developer-kafka.png" },
  { id: "confluent-operator", name: "Confluent Cloud Certified Operator (CCAC)", file: "confluent-cloud-operator.png" },
] as const;

export async function loadBadgeDataUrl(badgeId: string) {
  const badge = certificationBadges.find((item) => item.id === badgeId);
  if (!badge) return "";
  const response = await fetch(`/certification-badges/${badge.file}`);
  if (!response.ok) throw new Error("Could not load the selected badge image.");
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read badge image."));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function resolveLogoDataUrl(source: string) {
  if (source.startsWith("data:image/")) return source;
  const response = await fetch(source);
  if (!response.ok) throw new Error("Could not load certification badge image.");
  const blob = await response.blob();
  if (blob.type !== "image/png" && blob.type !== "image/jpeg") throw new Error("Certification badges must be PNG or JPEG images.");
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read certification badge image."));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
