import type { TechnicalSkills } from "@/types/resume";

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[().,&]/g, " ")
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const dependencyMap: Record<string, string[]> = {
  java: [
    "Core Java",
    "J2EE",
    "JDBC",
    "JPA",
    "Hibernate ORM",
    "Maven",
    "Gradle",
    "JUnit 5",
    "Mockito",
  ],
  "spring boot": [
    "Spring Framework",
    "Spring MVC",
    "Spring Security",
    "Spring Data JPA",
    "Hibernate ORM",
    "JPA",
    "JDBC",
    "Maven",
    "RESTful APIs",
    "Microservices",
  ],
  microservices: [
    "Spring Boot",
    "RESTful APIs",
    "Docker",
    "Kubernetes",
    "AWS",
    "CI/CD Pipelines",
    "Distributed Systems",
  ],
  aws: [
    "Amazon EC2",
    "AWS Lambda",
    "Amazon S3",
    "Amazon RDS",
    "API Gateway",
    "IAM",
    "CloudWatch",
    "Docker",
    "Kubernetes",
  ],
  react: [
    "JavaScript",
    "HTML5",
    "CSS3",
    "RESTful APIs",
  ],
  postgresql: [
    "SQL",
    "SQL Query Optimization",
    "Data Modeling",
    "Stored Procedures",
    "Indexing",
    "Transaction Management",
  ],
  mysql: [
    "SQL",
    "SQL Query Optimization",
    "Data Modeling",
    "Stored Procedures",
    "Indexing",
    "Transaction Management",
  ],
  oracle: [
    "SQL",
    "PL/SQL",
    "Stored Procedures",
    "Indexing",
    "Transaction Management",
  ],
  docker: [
    "Kubernetes",
    "Jenkins",
    "CI/CD Pipelines",
    "AWS",
  ],
  kubernetes: [
    "Docker",
    "Jenkins",
    "CI/CD Pipelines",
    "AWS",
  ],
  rest: [
    "RESTful APIs",
    "JSON",
    "OpenAPI (Swagger)",
    "Swagger UI",
    "Postman",
  ],
  "restful apis": [
    "JSON",
    "OpenAPI (Swagger)",
    "Swagger UI",
    "Postman",
    "Spring Boot",
  ],
};

function buildPrioritySet(jdSkills: string[]): Set<string> {
  const priority = new Set<string>();

  for (const jdSkill of jdSkills) {
    const normalizedJdSkill = normalize(jdSkill);

    priority.add(normalizedJdSkill);

    for (const dependency of dependencyMap[normalizedJdSkill] ?? []) {
      priority.add(normalize(dependency));
    }
  }

  return priority;
}

function isRelatedSkill(
  resumeSkill: string,
  prioritySet: Set<string>,
): boolean {
  const normalizedResumeSkill = normalize(resumeSkill);

  if (prioritySet.has(normalizedResumeSkill)) {
    return true;
  }

  return Array.from(prioritySet).some((prioritySkill) => {
    return (
      prioritySkill.length >= 3 &&
      normalizedResumeSkill.length >= 3 &&
      (
        prioritySkill.includes(normalizedResumeSkill) ||
        normalizedResumeSkill.includes(prioritySkill)
      )
    );
  });
}

export function reorderTechnicalSkills(
  masterSkills: TechnicalSkills,
  jdSkills: string[],
): TechnicalSkills {
  const prioritySet = buildPrioritySet(jdSkills);

  return {
    categories: masterSkills.categories.map((category) => {
      const deduplicatedSkills = Array.from(
        new Map(
          category.skills.map((skill) => [
            normalize(skill),
            skill,
          ]),
        ).values(),
      );

      const prioritySkills = deduplicatedSkills.filter((skill) =>
        isRelatedSkill(skill, prioritySet),
      );

      const remainingSkills = deduplicatedSkills.filter(
        (skill) => !isRelatedSkill(skill, prioritySet),
      );

      return {
        name: category.name,
        skills: [
          ...prioritySkills,
          ...remainingSkills,
        ],
      };
    }),
  };
}