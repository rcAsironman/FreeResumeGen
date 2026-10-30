import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

(async () => {
  let browser;
  try { browser = await chromium.launch({ headless: true }); } catch { browser = await chromium.launch({ headless: true, channel: 'msedge' }); }
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
    const errors = []; page.on('pageerror', (error) => errors.push(error.message));
    const profile = JSON.parse(await fs.readFile('data/settings/full-time.json', 'utf8'));
    const resume = {
      personalInfo: { ...profile.personalInfo, professionalTitle: 'Java Backend Developer' },
      professionalSummary: { bullets: Array.from({length: 6}, (_, i) => `Developed Java backend services with Spring Boot, PostgreSQL and Kafka for financial workflows, covering requirements, implementation, testing and production support ${i + 1}.`) },
      technicalSkills: { categories: [{ name: 'Backend', skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka'] }] },
      experience: profile.companies.map((company) => ({ id: company.id, company: company.companyName, role: 'Java Backend Developer', location: company.location, startDate: company.startDate, endDate: company.isCurrent ? 'Present' : company.endDate, responsibilities: Array.from({length: 12}, (_, i) => `Developed Java and Spring Boot services for transaction processing, implementing request validation, PostgreSQL persistence, Kafka event handling, unit tests and diagnostic logging for production troubleshooting and release support ${i + 1}.`), environment: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka'] })),
      projects: [], education: profile.education, certifications: [],
    };
    await page.goto(process.env.TEST_BASE_URL || 'http://127.0.0.1:3001/');
    await page.locator('.jd-input').fill('Role: Java Backend Developer\nRequired: 4 years of experience. Java, Spring Boot, PostgreSQL, Kafka. Develop backend services for financial applications.');
    await page.getByRole('button', {name: 'Paste response & download'}).click();
    await page.getByRole('textbox', { name: 'Resume JSON editor' }).fill(JSON.stringify(resume));
    await page.getByRole('button', {name:'Generate resume',exact:true}).click();
    await page.locator('.original-paper').waitFor();
    await page.getByRole('button', {name:'Edit resume',exact:true}).click();
    const field = page.locator('[data-edit-path="professionalSummary.bullets.0"]');
    await field.fill('Edited Java backend achievement retained in preview, Word and PDF.');
    await field.selectText();
    await page.getByRole('button', {name:'B',exact:true}).click();
    await page.getByRole('button', {name:'Done editing · Preview'}).click();
    const json = JSON.parse(await page.getByRole('textbox', {name:'Resume JSON editor'}).inputValue());
    assert.equal(json.professionalSummary.bullets[0], 'Edited Java backend achievement retained in preview, Word and PDF.');
    await page.locator('.badge-picker summary').click();
    await page.locator('.badge-picker-select').first().locator('input').check();
    await page.locator('.badge-picker-adjust input[type=range]').first().fill('96');
    await page.locator('.badge-picker-adjust input[type=number]').nth(0).fill('-60');
    await page.locator('.badge-picker-adjust input[type=number]').nth(1).fill('-35');
    await page.locator('.credential-logo img').waitFor();
    const geometry = await page.locator('.original-paper').evaluate((root) => {
      const paper = root.getBoundingClientRect(); const img = root.querySelector('img').getBoundingClientRect();
      return { width: paper.width, imageWidth: img.width, x: img.left-paper.left, y: img.top-paper.top, font: getComputedStyle(root).fontFamily, logoBottom: img.bottom, summaryTop: root.querySelector('h2').getBoundingClientRect().top };
    });
    assert.equal(geometry.width,816); assert.equal(geometry.imageWidth,96); assert.match(geometry.font,/Times New Roman/);
    assert(geometry.logoBottom <= geometry.summaryTop, 'Header reserves enough room for the selected badge');
    const saved = [];
    for (const format of ['DOCX','PDF']) {
      const responsePromise = page.waitForResponse((response) => response.url().endsWith('/api/save-resume'));
      await page.getByRole('button', {name:`Download ${format}`,exact:true}).click();
      const response = await responsePromise; const result = await response.json();
      assert.equal(response.status(),200,JSON.stringify(result));
      saved.push(result.filePath);
      await page.locator(".download-feedback").getByRole("status").filter({hasText: result.filePath}).waitFor();
      const bytes = await fs.readFile(result.filePath); assert(bytes.length > 1000);
    }
    const finalJsonResponse = page.waitForResponse((response) => response.url().endsWith('/api/save-resume'));
    await page.getByRole('button', {name:'Download JSON',exact:true}).click();
    const finalJson = await (await finalJsonResponse).json();
    const exportedJson = JSON.parse(await fs.readFile(finalJson.filePath, 'utf8'));
    assert.equal(exportedJson.professionalSummary.bullets[0],json.professionalSummary.bullets[0]);
    assert(await page.locator('.side-toast').count() >= 3);
    const workBeforeReload = await page.getByRole('textbox', {name:'Resume JSON editor'}).inputValue();
    await page.reload();
    await page.locator('.original-paper').waitFor();
    assert.equal(await page.getByRole('textbox', {name:'Resume JSON editor'}).inputValue(), workBeforeReload);
    assert.equal(await page.locator('.credential-logo img').count(), 1);
    await fs.mkdir('review-output' , {recursive:true});
    await page.locator('.original-paper').screenshot({path:'review-output/original-layout-editor.png'});
    await fs.writeFile('review-output/editor-export-results.json', JSON.stringify({saved,geometry,errors},null,2));
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({saved,geometry,errors}));
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode=1; });
