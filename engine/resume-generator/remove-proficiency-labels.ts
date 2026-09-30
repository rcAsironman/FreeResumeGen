const PROFICIENCY_LABEL = /\s*[\[(](?:exposure|familiar|familiarity|basic|basic knowledge|beginner|working knowledge)[\])]/gi;

export function removeProficiencyLabels(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replace(PROFICIENCY_LABEL, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(removeProficiencyLabels);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, removeProficiencyLabels(item)]),
    );
  }

  return value;
}
