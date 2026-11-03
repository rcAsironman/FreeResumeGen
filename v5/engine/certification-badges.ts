export const CERTIFICATION_BADGES = [
  { id: "aws-saa", label: "AWS Certified Solutions Architect – Associate", image: "aws-solutions-architect-associate.png" },
  { id: "aws-developer", label: "AWS Certified Developer – Associate", image: "aws-developer-associate.png" },
  { id: "aws-devops", label: "AWS Certified DevOps Engineer – Professional", image: "aws-devops-engineer-professional.png" },
  { id: "azure-admin", label: "Microsoft Certified: Azure Administrator Associate (AZ-104)", image: "azure-administrator-associate.png" },
  { id: "azure-devops", label: "Microsoft Certified: DevOps Engineer Expert (AZ-400)", image: "azure-devops-engineer-expert.png" },
  { id: "azure-architect", label: "Microsoft Certified: Azure Solutions Architect Expert (AZ-305)", image: "azure-solutions-architect-expert.png" },
  { id: "gcp-architect", label: "Google Cloud Professional Cloud Architect", image: "gcp-cloud-architect-professional.png" },
  { id: "gcp-developer", label: "Google Cloud Professional Cloud Developer", image: "gcp-cloud-developer-professional.png" },
  { id: "gcp-devops", label: "Google Cloud Professional Cloud DevOps Engineer", image: "gcp-cloud-devops-professional.png" },
  { id: "confluent-admin", label: "Confluent Certified Administrator for Apache Kafka (CCAAK)", image: "confluent-administrator-kafka.png" },
  { id: "confluent-developer", label: "Confluent Certified Developer for Apache Kafka (CCDAK)", image: "confluent-developer-kafka.png" },
  { id: "confluent-operator", label: "Confluent Cloud Certified Operator (CCAC)", image: "confluent-cloud-operator.png" },
] as const;

export type CertificationBadgeId = (typeof CERTIFICATION_BADGES)[number]["id"];

/** Related-role filters can overlap; selection always uses the stable badge ID. */
export const CERTIFICATION_BADGE_CATEGORIES: {id:string;label:string;description?:string;badges:readonly CertificationBadgeId[]}[] = [
  {id:"all",label:"All certifications",badges:CERTIFICATION_BADGES.map(b=>b.id)},
  {id:"kafka",label:"Kafka / Streaming",badges:["confluent-admin","confluent-developer","confluent-operator"]},
  {id:"java",label:"Java / Backend related",description:"Related cloud and streaming developer credentials. These are not Java language certifications; Oracle Java badges are not in the current library.",badges:["aws-developer","gcp-developer","confluent-developer"]},
  {id:"devops",label:"DevOps / SRE",badges:["aws-devops","azure-devops","gcp-devops","azure-admin","confluent-operator"]},
  {id:"architecture",label:"Cloud Architecture",badges:["aws-saa","azure-architect","gcp-architect"]},
  {id:"aws",label:"AWS",badges:["aws-saa","aws-developer","aws-devops"]},
  {id:"azure",label:"Azure",badges:["azure-admin","azure-devops","azure-architect"]},
  {id:"gcp",label:"Google Cloud",badges:["gcp-architect","gcp-developer","gcp-devops"]},
];

export interface CertificationBadgePosition {
  x: number;
  y: number;
}

export interface CertificationBadge {
  id: CertificationBadgeId;
  label: string;
  image: string;
}

/** Return certification artwork selected by the user. */
export function getCertificationBadgeMatches(selectedIds: CertificationBadgeId[] = []): CertificationBadge[] {
  const selected = new Set(selectedIds);
  return CERTIFICATION_BADGES.filter(({ id }) => selected.has(id));
}
