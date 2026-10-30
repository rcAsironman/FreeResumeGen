import { mkdir, open, readdir, unlink } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export function dailyResumeFolder(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: string) => parts.find((entry) => entry.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}_resumes`;
}

export function resumeFileStem(fullName: string, index: number): string {
  const clean = (value: string) => value.normalize("NFKD").replace(/[^A-Za-z0-9]/g, "");
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = clean(parts[0] ?? "").toLowerCase() || "candidate";
  const family = clean(parts.length > 1 ? parts.at(-1)! : "") || "Resume";
  if (index === 0) return `${first}_resume`;
  if (index === 1) return `${first}-resume`;
  const length = index - 1;
  if (length <= family.length) {
    let prefix = family.slice(0, length).toLowerCase();
    if (length !== 2) prefix = prefix[0].toUpperCase() + prefix.slice(1);
    return `${first}_${prefix}_resume`;
  }
  return `${first}_${family[0].toUpperCase() + family.slice(1).toLowerCase()}_resume_${length - family.length + 1}`;
}

export function assertLocalResumeSave(request: Request): void {
  const url = new URL(request.url);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) throw new Error("Saving into Downloads is available when this app runs locally.");
  const origin = request.headers.get("origin");
  if (origin) {
    const originUrl = new URL(origin);
    // Next can normalize the request URL to localhost even when the browser uses 127.0.0.1.
    if (!["localhost", "127.0.0.1", "[::1]"].includes(originUrl.hostname) || originUrl.port !== url.port || originUrl.protocol !== url.protocol) throw new Error("Resume saving must be requested from this app.");
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") throw new Error("Resume saving must be requested from this app.");
}

/** Reserve names across both file types and concurrent exports; never overwrite. */
export async function saveDailyResume(bytes: Uint8Array, fullName: string, format: "pdf" | "docx" | "json", options: { now?: Date; downloadsRoot?: string } = {}) {
  const folderName = dailyResumeFolder(options.now);
  const directory = path.join(options.downloadsRoot ?? process.env.RESUME_DOWNLOAD_DIR ?? path.join(os.homedir(), "Downloads"), folderName);
  await mkdir(directory, { recursive: true });
  for (let index = 0; index < 10000; index++) {
    const stem = resumeFileStem(fullName, index);
    const reservation = path.join(directory, `.${stem}.reserve`);
    let reservationHandle;
    try { reservationHandle = await open(reservation, "wx"); }
    catch (error) { if (["EEXIST", ...(process.platform === "win32" ? ["EPERM"] : [])].includes((error as NodeJS.ErrnoException).code ?? "")) continue; throw error; }
    try {
      const existing = new Set((await readdir(directory)).map((name) => name.toLowerCase()));
      if (["pdf", "docx", "json"].some((extension) => existing.has(`${stem}.${extension}`.toLowerCase()))) continue;
      const filename = `${stem}.${format}`;
      const filePath = path.join(directory, filename);
      let file;
      try { file = await open(filePath, "wx"); }
      catch (error) { if (["EEXIST", ...(process.platform === "win32" ? ["EPERM"] : [])].includes((error as NodeJS.ErrnoException).code ?? "")) continue; throw error; }
      try { await file.writeFile(bytes); } catch (error) {
        await file.close(); file = undefined;
        await unlink(filePath).catch(() => undefined);
        throw error;
      } finally { if (file) await file.close(); }
      return { success: true, filename, folderName, directory, filePath };
    } finally {
      await reservationHandle.close();
      await unlink(reservation).catch(() => undefined);
    }
  }
  throw new Error("No unused resume filename is available in today's folder.");
}
