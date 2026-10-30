import { chromium } from "playwright";
import { assertLocalResumeSave } from "@/lib/save-daily-resume";

export async function POST(request: Request) {
  let browser;
  try {
    assertLocalResumeSave(request);
    const { html } = await request.json();
    if (typeof html !== "string" || html.length > 20_000_000) return Response.json({ error: "Invalid document." }, { status: 400 });
    try { browser = await chromium.launch({ headless: true }); }
    catch { browser = await chromium.launch({ headless: true, channel: "msedge" }); }
    const context = await browser.newContext({ javaScriptEnabled: false });
    await context.route("**/*", (route) => route.abort());
    const page = await context.newPage();
    await page.setContent('<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data:; style-src \'unsafe-inline\'; font-src data:">' + html, { waitUntil: "load" });
    const pdf = await page.pdf({ format: "Letter", printBackground: true, margin: { top: "0.42in", bottom: "0.42in", left: "0.5in", right: "0.5in" } });
    return new Response(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Cache-Control": "no-store" } });
  } catch (error) { return Response.json({ error: (error as Error).message }, { status: 500 }); }
  finally { await browser?.close(); }
}
