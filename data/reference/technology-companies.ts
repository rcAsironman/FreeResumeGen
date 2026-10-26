/** Public technology references, NOT the candidate's employment history. */
export const TECHNOLOGY_COMPANY_REFERENCES = [
  {
    technology: "Kofax / Tungsten TotalAgility",
    jdPattern: /\b(?:kofax|tungsten|totalagility|total\s+agility)\b/i,
    companies: [
      { name: "Marginalen Bank", source: "https://www.tungstenautomation.com/products/totalagility" },
      { name: "Safe-Guard Products", source: "https://www.tungstenautomation.com/-/media/files/case-studies/en/cs_safeguard_en.pdf" },
      { name: "UNIQA", source: "https://www.tungstenautomation.com/solutions/insurance" },
      { name: "Tetrosyl", source: "https://www.cobwebb.com/tungsten-totalagility-tetrosyl-case-study/" },
      { name: "Aviva", source: "https://www.tungstenautomation.de/learn/case-studies/2025/aviva-transforms-claims-processing-with-tungsten" },
      { name: "Acrisure", source: "https://www.tungstenautomation.de/case-studies/global-fintech-leader-acrisure-leverages-tungsten-automations-generative-ai" },
      { name: "DACHSER", source: "https://www.tungstenautomation.com/case-studies/dachser-boosts-logistics-efficiency-with-tungsten-automation" },
      { name: "Region Stockholm", source: "https://www.tungstenautomation.com/case-studies/region-stockholms-digital-transformation-with-totalagility" },
      { name: "Deutsche Rentenversicherung, Rhineland-Palatinate", source: "https://www.tungstenautomation.com/industries/insurance" },
    ],
    provenance: "Public vendor or implementation-partner examples checked October 21, 2026. No candidate employment or product-specific duration is established.",
  },
];

export function technologyReferencePolicy(jd: string): string {
  const matched = TECHNOLOGY_COMPANY_REFERENCES.filter((entry) => entry.jdPattern.test(jd));
  if (!matched.length) return "";
  // Reference customer names stay out of the generation input to avoid employer leakage.
  return `TECHNOLOGY REFERENCE BOUNDARY
- Public customer research exists for: ${matched.map((entry) => entry.technology).join(", ")}.
- Those organizations are technology examples, not candidate employers. Use only companies already in candidate employment evidence. Never select a vendor customer to construct a career or assign product-use dates to the candidate.
- A vendor customer using one product does not prove use of every related product or a particular version, deployment model or year range.
`;
}
