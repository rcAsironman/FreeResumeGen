import type { ReactNode } from "react";

interface BoldSkillsTextProps {
  text: string;
  skills: string[];
  additionalSkills?: string[];
  enabled?: boolean;
  maxExtraHighlights?: number;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function uniqueSkills(skills: string[]): string[] {
  return Array.from(
    new Map(
      skills
        .map((skill) => skill.trim())
        .filter(Boolean)
        .map((skill) => [normalize(skill), skill]),
    ).values(),
  ).sort((a, b) => b.length - a.length);
}

function deterministicScore(value: string): number {
  let score = 0;

  for (let index = 0; index < value.length; index++) {
    score = (score * 31 + value.charCodeAt(index)) >>> 0;
  }

  return score;
}

export function BoldSkillsText({
  text,
  skills,
  additionalSkills = [],
  enabled = true,
  maxExtraHighlights = 2,
}: BoldSkillsTextProps) {
  if (!enabled || !text) {
    return <>{text}</>;
  }

  const primarySkills = uniqueSkills(skills);

  const primarySet = new Set(
    primarySkills.map(normalize),
  );

  const availableExtraSkills = uniqueSkills(
    additionalSkills,
  )
    .filter(
      (skill) => !primarySet.has(normalize(skill)),
    )
    .filter((skill) => {
      const regex = new RegExp(
        `(?<![A-Za-z0-9])${escapeRegExp(skill)}(?![A-Za-z0-9])`,
        "i",
      );

      return regex.test(text);
    })
    .sort(
      (first, second) =>
        deterministicScore(`${text}-${first}`) -
        deterministicScore(`${text}-${second}`),
    )
    .slice(0, maxExtraHighlights);

  const skillsToHighlight = uniqueSkills([
    ...primarySkills,
    ...availableExtraSkills,
  ]);

  if (skillsToHighlight.length === 0) {
    return <>{text}</>;
  }

  const pattern = skillsToHighlight
    .map(escapeRegExp)
    .join("|");

  const regex = new RegExp(
  `(?<![A-Za-z0-9])(${pattern})(?:\\s+\\d+(?:\\.\\d+)*)?(?:/\\d+(?:\\.\\d+)*)*(?![A-Za-z0-9])`,
  "gi",
);

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        text.slice(lastIndex, match.index),
      );
    }

    nodes.push(
      <strong key={`${match.index}-${match[0]}`}>
        {match[0]}
      </strong>,
    );

    lastIndex =
      match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <>{nodes}</>;
}
