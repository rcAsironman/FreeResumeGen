import type {EmploymentType} from '@/types/employment-type';
export function employmentTypePrompt(type:EmploymentType='full-time') {
 void type;
 return `EMPLOYMENT TYPE: FULL-TIME
- Use this candidate's JSON only. Preserve supplied employers, identity and education exactly. A master's degree is not required. Do not add graduate education, CPT restrictions, immigration assumptions or another person's information.
- Use source dates unless an explicitly selected proposed timeline is provided.
- Target a full-time position without inventing current employment status or availability.`;
}
