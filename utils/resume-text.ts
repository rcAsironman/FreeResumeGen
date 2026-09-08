export function plainContactValue(value: string | undefined): string {
  if (!value) return "";

  return value
    .trim()
    .replace(/^\[([^\]]+)]\((?:mailto:)?[^)]+\)$/i, "$1")
    .replace(/^<mailto:([^>]+)>$/i, "$1")
    .replace(/^mailto:/i, "");
}
