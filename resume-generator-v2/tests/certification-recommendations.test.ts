import test from "node:test";
import assert from "node:assert/strict";
import { recommendCertificationBadges } from "@/lib/certification-recommendations";

const certifications = [
  { id: "aws-saa", name: "AWS Certified Solutions Architect – Associate", logo: "/aws.png" },
  { id: "aws-devops", name: "AWS Certified DevOps Engineer – Professional", logo: "/aws-devops.png" },
  { id: "azure-devops", name: "Microsoft Certified: DevOps Engineer Expert (AZ-400)", logo: "/azure.png" },
  { id: "confluent", name: "Confluent Certified Administrator for Apache Kafka", logo: "/kafka.png" },
];

test("badge recommendations follow JD vendors and role focus without auto-selecting a badge", () => {
  const suggestions = recommendCertificationBadges("Senior Kafka Platform Engineer; Confluent operations and SRE/DevOps", certifications);
  assert.deepEqual(suggestions.map((item) => item.certification.id), ["confluent"]);
  assert.equal(suggestions[0].certification.visible, undefined);
  assert.match(suggestions[0].reason, /Kafka \/ Confluent/);
});

test("AWS recommendations are scoped to configured AWS credentials", () => {
  const suggestions = recommendCertificationBadges("AWS DevOps Engineer building CI/CD automation", certifications);
  assert.equal(suggestions[0].certification.id, "aws-devops");
  assert.ok(suggestions.every((item) => item.provider === "AWS"));
});
