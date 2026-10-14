/** Remove invalid punctuation escapes introduced by copied model responses.
 * Valid JSON escapes and literal backslash pairs are preserved exactly.
 */
function removePunctuationEscapes(text: string): string {
  let result = "";
  let inString = false;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (character === '"') inString = !inString;
    if (inString && character === "\\") {
      const next = text[index + 1];
      if (next !== undefined && /[@&_%#*`~!$^()+={}:;,<>?'.|\[\]\-]/.test(next)) {
        result += next;
        index++;
        continue;
      }
      // Skip the escaped character so escaped quotes cannot change string state.
      result += character;
      if (next !== undefined) {
        result += next;
        index++;
      }
      continue;
    }
    result += character;
  }
  return result;
}

/** Parse pasted JSON, tolerating unnecessary punctuation escapes only. */
export function parsePastedJson(text: string): unknown {
  text = removePunctuationEscapes(text);
  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    let inString = false;
    for (let index = 0; index < text.length; index++) {
      const character = text[index];
      if (character === '"') inString = !inString;
      if (!inString || character !== "\\") continue;

      const escaped = text[index + 1];
      const validUnicode = escaped === "u" && /^[0-9a-fA-F]{4}$/.test(text.slice(index + 2, index + 6));
      if (escaped === undefined || (!'"\\/bfnrt'.includes(escaped) && !validUnicode)) {
        const before = text.slice(0, index);
        const line = before.split("\n").length;
        const column = index - before.lastIndexOf("\n");
        const sequence = JSON.stringify(text.slice(index, index + (escaped === "u" ? 6 : 2)));
        throw new Error(`Invalid JSON escape ${sequence} at line ${line}, column ${column}. Remove the backslash if it was added before punctuation (such as \\& or \\_), or use two backslashes for a literal backslash. Paste the corrected JSON and validate again.`);
      }
      index += escaped === "u" ? 5 : 1;
    }
    throw error;
  }
}
