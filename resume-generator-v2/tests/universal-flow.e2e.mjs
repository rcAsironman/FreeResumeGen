import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

let browser;
try { browser = await chromium.launch({ headless: true }); }
catch { browser = await chromium.launch({ headless: true, channel: 'msedge' }); }
try {
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.TEST_BASE_URL || 'http://127.0.0.1:3012/');
  await page.locator('.jd-input').fill('Role: Salesforce Developer\nRequired: Salesforce, Apex\nMinimum 5 years experience');
  await page.getByRole('button', { name: 'Show prompt here', exact: true }).click();
  const prompt = await page.getByRole('textbox', { name: 'Generated ChatGPT prompt' }).inputValue();
  assert.ok(prompt.includes('Salesforce'));
  assert.ok(!prompt.includes('proposedStartDate'));
  await page.getByRole('button', { name: 'Paste response & download' }).click();
  const resume = {
    personalInfo: { fullName: 'Universal QA', professionalTitle: 'Salesforce Developer', email: 'qa@example.com', phone: '555-0100', location: 'Remote' },
    professionalSummary: { bullets: ['Implemented Salesforce workflows.'] },
    technicalSkills: { categories: [{ name: 'CRM', skills: ['Salesforce', 'Apex'] }] },
    experience: [{ id: 'external', company: 'QA Employer', location: 'Remote', role: 'Engineer', startDate: 'Jan 2020', endDate: 'Dec 2022', responsibilities: ['[SYNTHETIC EXAMPLE] Reduced Salesforce processing time by 30%. [QUALITATIVE] Implemented Salesforce workflows.'], environment: ['Salesforce'] }],
    projects: [], education: [], certifications: [],
  };
  await page.getByRole('textbox', { name: 'Resume JSON editor' }).fill(JSON.stringify(resume));
  await page.getByRole('button', { name: 'Generate resume', exact: true }).click();
  await page.locator('.original-paper').waitFor();
  assert.ok(!(await page.locator('.original-paper').innerText()).includes('30%'));
  assert.ok((await page.locator('.original-paper').innerText()).includes('Jan 2020'));
  assert.equal(await page.getByRole('button', { name: 'Download DOCX', exact: true }).isEnabled(), false);
  let count = 0;
  while (await page.getByRole('button', { name: 'Confirm this statement', exact: true }).count()) {
    await page.getByRole('button', { name: 'Confirm this statement', exact: true }).first().click();
    assert.ok(++count < 60);
  }
  assert.ok(count > 0);
  assert.equal(await page.getByRole('button', { name: 'Download DOCX', exact: true }).isEnabled(), true);
  const saved = [];
  for (const format of ['DOCX', 'PDF', 'JSON']) {
    const response = page.waitForResponse(res => res.url().endsWith('/api/save-resume'));
    await page.getByRole('button', { name: `Download ${format}`, exact: true }).click();
    const result = await response;
    assert.equal(result.status(), 200);
    const { filePath } = await result.json();
    const bytes = await fs.readFile(filePath);
    assert.ok(bytes.length > 100);
    if (format === 'JSON') {
      assert.ok(!bytes.toString().includes('30%'));
      assert.equal(JSON.parse(bytes).experience[0].startDate, 'Jan 2020');
    }
    saved.push(filePath);
  }
  await page.reload();
  await page.locator('.original-paper').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Download DOCX', exact: true }).isEnabled(), true);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('resume-studio-v2-work-evidence-v3')));
  assert.ok(stored.every(record => record.candidateKey && record.source.originatingJD && record.source.confirmedAt));
  resume.experience[0].responsibilities = ['Reduced Salesforce processing time by 30%.'];
  await page.getByRole('textbox', { name: 'Resume JSON editor' }).fill(JSON.stringify(resume));
  await page.getByRole('button', { name: 'Generate resume', exact: true }).click();
  await page.getByText('Add measured evidence below or replace this with an accurate qualitative statement.').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Download PDF', exact: true }).isEnabled(), false);
  await page.locator('.metric-evidence-panel > summary').click();
  await page.locator('.achievement-opportunities > summary').click();
  const measurement = page.locator('.achievement-card').first();
  await measurement.getByLabel('Metric to measure', {exact:true}).fill('processing time');
  await measurement.getByLabel('Claimed value', {exact:true}).fill('30');
  await measurement.getByLabel('Result unit', {exact:true}).fill('%');
  await measurement.getByLabel('Metric period', {exact:true}).fill('Q1 2022');
  await measurement.getByLabel('Measurement source or basis', {exact:true}).fill('QA documented benchmark');
  await measurement.locator('select').selectOption('verified');
  await measurement.getByRole('button', {name:'Confirm numeric evidence for this bullet'}).click();
  await page.waitForFunction(() => ![...document.querySelectorAll('button')].find(button => button.textContent === 'Download JSON')?.disabled);
  const measuredResponse = page.waitForResponse(res => res.url().endsWith('/api/save-resume'));
  await page.getByRole('button', {name:'Download JSON',exact:true}).click();
  const measuredFile = (await (await measuredResponse).json()).filePath;
  assert.ok((await fs.readFile(measuredFile,'utf8')).includes('30%'));
  assert.deepEqual(errors, []);
  await fs.writeFile('review-output/universal-flow-results.json', JSON.stringify({ saved, confirmations: count, errors }, null, 2));
  console.log(JSON.stringify({ saved, confirmations: count, errors }));
} finally { await browser.close(); }
