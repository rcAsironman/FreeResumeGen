export function plainContactValue(value: string | undefined): string {
  if (!value) return "";

  return value
    .trim()
    .replace(/^\[([^\]]+)]\((?:mailto:)?[^)]+\)$/i, "$1")
    .replace(/^<mailto:([^>]+)>$/i, "$1")
    .replace(/^mailto:/i, "");
}

/** Remove link formatting and stray slash characters from email contact values. */
export function plainEmailValue(value: string | undefined): string {
  return plainContactValue(value)
    .replace(/[\\/]/g, "")
    .replace(/^mailto:/i, "")
    .trim();
}
