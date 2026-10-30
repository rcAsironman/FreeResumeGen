import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const input = process.env.RESUME_FIXTURE
  ? JSON.parse(await fs.readFile(process.env.RESUME_FIXTURE, 'utf8'))
  : {
    personalInfo: { fullName: 'Independent Candidate', professionalTitle: 'Salesforce Developer', email: 'candidate@example.com', phone: '555-0100', location: 'Remote' },
    professionalSummary: { bullets: ['Developed Salesforce integrations.'] },
    technicalSkills: { categories: [{ name: 'CRM', skills: ['Salesforce'] }] },
    experience: [{ id: 'external-company', company: 'Independent Employer', role: 'Salesforce Developer', location: 'Remote', startDate: 'Jan 2021', endDate: 'Dec 2023', responsibilities: ['Implemented Salesforce integrations for customer workflows.'], environment: ['Salesforce'] }],
    projects: [], education: [{ id: 'external-degree', institution: 'Independent College', degree: 'Bachelor of Science' }], certifications: [],
  };
let browser;
try { browser = await chromium.launch({ headless: true }); }
catch { browser = await chromium.launch({ headless: true, channel: 'msedge' }); }
try {
  const page = await browser.newPage();
  await page.goto(process.env.TEST_BASE_URL || 'http://127.0.0.1:3000/');
  await page.getByRole('button', { name: 'Paste response & download' }).click();
  await page.getByRole('textbox', { name: 'Resume JSON editor' }).fill(JSON.stringify(input));
  await page.getByRole('button', { name: 'Generate resume', exact: true }).click();
  await page.locator('.original-paper').waitFor();
  const preview = await page.locator('.original-paper').innerText();
  assert.ok(preview.includes(input.personalInfo.fullName));
  assert.ok(preview.includes(input.personalInfo.email));
  for (const job of input.experience) {
    assert.ok(preview.includes(job.company));
    assert.ok(preview.includes(job.startDate));
    assert.ok(preview.includes(job.endDate));
  }
  assert.equal(await page.getByRole('button', { name: 'Download DOCX', exact: true }).isEnabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Download PDF', exact: true }).isEnabled(), true);
  await page.reload();
  await page.locator('.original-paper').waitFor();
  assert.ok((await page.locator('.original-paper').innerText()).includes(input.personalInfo.fullName));
  console.log('Independent import passed: no JD, different candidate/employers/education, dates preserved, downloads enabled, refresh retained.');
} finally { await browser.close(); }
