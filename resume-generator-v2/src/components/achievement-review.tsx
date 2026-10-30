"use client";

import type { AchievementEvidence, SyntheticAchievementDraft } from "@/lib/achievements";
import { achievementCoverage, buildMetricOpportunities, composeAchievementBullet, evidenceForAchievement, isEvidenceReady } from "@/lib/achievements";
import type { JDAnalysis, Resume } from "@/types/resume";

export function AchievementReview({ resume, analysis, evidence, syntheticDraft, onChange, onApply }: {
  resume: Resume;
  analysis: JDAnalysis;
  evidence: AchievementEvidence[];
  syntheticDraft: SyntheticAchievementDraft | null;
  onChange: (item: AchievementEvidence) => void;
  onApply: (item: AchievementEvidence, statement: string) => void;
}) {
  const coverage = achievementCoverage(resume, evidence, analysis);
  const opportunities = buildMetricOpportunities(resume, analysis);
  return <section className="achievement-review" aria-label="Achievement evidence review">
    <div className="achievement-review-heading"><div><span className="field-label">ACHIEVEMENT EXAMPLES · AUTOMATIC</span><h3>Role-specific quantified examples</h3></div><div className="achievement-counts"><b>{coverage.totalExperienceBullets}</b> experience bullets <span>·</span> <b>{coverage.quantifiedAchievementCount}</b> quantified in resume <span>·</span> <b>{coverage.verifiedAchievementCount}</b> measured evidence</div></div>
    <div className="achievement-coverage" aria-live="polite"><span><b>{coverage.missingMetricOpportunities}</b> metric opportunities</span><span><b>{coverage.unsupportedNumericalClaims}</b> unsupported numerical claims</span>{coverage.estimatedAchievementCount > 0 && <span><b>{coverage.estimatedAchievementCount}</b> candidate estimates</span>}</div>
    <div className="achievement-employer-grid" aria-label="Achievement counts by employer">{coverage.employers.map((employer) => <article key={employer.employerId}><strong>{employer.employer}</strong><span><b>{employer.totalExperienceBullets}</b> bullets · <b>{employer.quantifiedAchievementCount}</b> quantified · <b>{employer.verifiedAchievementCount}</b> verified</span><small>{employer.missingMetricOpportunities} metric opportunities · {employer.unsupportedNumericalClaims} unsupported numbers</small></article>)}</div>
    <div className="synthetic-draft-panel">
      <div className="synthetic-draft-warning"><strong>SYNTHETIC EXAMPLES · UNVERIFIED · NEVER FOR APPLICATION</strong><p>Generated automatically by the resume prompt. The percentages below are fictional examples for testing and are kept separate from your resume and downloads.</p></div>
      {!syntheticDraft?.examples.length ? <p className="helper">No synthetic examples were included in the imported response. Generate a fresh prompt and import its complete JSON response to see them here.</p> : <div className="synthetic-employer-list">{coverage.employers.map((employer) => {
        const examples = syntheticDraft.examples.filter((item) => item.employerId === employer.employerId);
        return examples.length ? <article className="synthetic-employer" key={employer.employerId}><h4>{employer.employer} · {examples.length} illustrative example{examples.length === 1 ? "" : "s"}</h4>{examples.map((item, index) => <div className="synthetic-example" key={`${item.employerId}-${item.metricType}-${index}`}><span className="claim-status suggested">SYNTHETIC · {item.percentage}% {item.direction}</span><blockquote>{item.achievementExample}</blockquote><small>Based on this responsibility: {item.sourceResponsibility}</small></div>)}</article> : null;
      })}</div>}
    </div>
    <details className="achievement-opportunities">
      <summary>Optional: record actual measurements for application-ready bullets ({opportunities.length} opportunities)</summary>
      <p className="helper">You do not need to fill these fields to generate synthetic examples. Only measurements you can substantiate may be added to the application-ready resume.</p>
      <div className="achievement-opportunity-list">{opportunities.map((opportunity) => {
        const saved = evidence.find((item) => item.id === opportunity.id && item.originalBullet === opportunity.originalBullet);
        if (!saved) return null;
        const calculation = evidenceForAchievement(saved);
        const ready = isEvidenceReady(saved);
        const generated = ready ? (opportunity.hasExistingNumber ? opportunity.originalBullet : composeAchievementBullet(saved, calculation)) : "";
        const measurementError = calculation.error;
        const patch = (value: Partial<AchievementEvidence>) => onChange({ ...saved, ...value });
        return <article className="achievement-card" key={opportunity.id}>
          <div className="achievement-card-top"><span className="claim-section">{opportunity.employer} · {opportunity.metricType}</span><span className={`claim-status ${ready ? saved.status : opportunity.hasExistingNumber ? "needs-confirmation" : "suggested"}`}>{ready ? saved.status === "candidate-estimated" ? "Candidate estimate" : "Measured evidence" : opportunity.hasExistingNumber ? "Claim needs evidence" : "Optional suggestion"}</span></div>
          <blockquote>{opportunity.originalBullet}</blockquote>
          <p className="achievement-question">{opportunity.question}</p>
          <div className="achievement-form">
            <label>Metric to measure<input value={saved.metricType} onChange={(event) => patch({ metricType: event.target.value })} placeholder="e.g. API response time"/></label>
            {opportunity.hasExistingNumber ? <label>Claimed value<input inputMode="decimal" value={saved.resultValue} onChange={(event) => patch({ resultValue: event.target.value })} placeholder="e.g. 35"/></label> : <label>Result value (if measured directly)<input inputMode="decimal" value={saved.resultValue} onChange={(event) => patch({ resultValue: event.target.value })} placeholder="Use before/after below to calculate a percent"/></label>}
            <label>Result unit<input value={saved.resultUnit} onChange={(event) => patch({ resultUnit: event.target.value })} placeholder="%, ms, requests/sec"/></label>
            <label>Before<input inputMode="decimal" value={saved.beforeValue} onChange={(event) => patch({ beforeValue: event.target.value })} placeholder="Optional baseline"/></label>
            <label>After<input inputMode="decimal" value={saved.afterValue} onChange={(event) => patch({ afterValue: event.target.value })} placeholder="Optional result"/></label>
            <label>Baseline unit<input value={saved.measurementUnit} onChange={(event) => patch({ measurementUnit: event.target.value })} placeholder="Same unit before and after"/></label>
            <label>Metric period<input value={saved.measurementPeriod} onChange={(event) => patch({ measurementPeriod: event.target.value })} placeholder="e.g. Q2 2025"/></label>
            <label className="achievement-source-field">Measurement source or basis<input value={saved.source} onChange={(event) => patch({ source: event.target.value })} placeholder="e.g. Grafana dashboard, release records, test report"/></label>
            <label>Evidence type<select value={saved.status} onChange={(event) => patch({ status: event.target.value as AchievementEvidence["status"] })}><option value="suggested">Not provided</option><option value="verified">Measured result I can substantiate</option><option value="candidate-estimated">Candidate estimate with a clear basis</option><option value="rejected">Reject this metric suggestion</option></select></label>
          </div>
          {(saved.beforeValue || saved.afterValue) && <p className={measurementError ? "achievement-error" : "achievement-calculation"}>{measurementError ? calculationErrorText(measurementError) : `${calculation.resultValue}% ${saved.direction === "decrease" ? "reduction" : "increase"} calculated from ${saved.beforeValue} to ${saved.afterValue} ${saved.measurementUnit}.`}</p>}
          {ready && !opportunity.hasExistingNumber && <><label className="achievement-statement-label">Proposed resume bullet — review wording before applying<textarea value={saved.proposedStatement ?? generated} onChange={(event) => patch({ proposedStatement: event.target.value })}/></label><button className="button primary" disabled={!(saved.proposedStatement ?? generated).trim()} onClick={() => onApply(saved, (saved.proposedStatement ?? generated).trim())}>Apply and confirm this measured achievement</button></>}
          {ready && opportunity.hasExistingNumber && <div className="achievement-existing-claim"><p>The draft already states this number. Confirm the measurement basis to allow it in the final resume.</p><button className="button primary" onClick={() => onApply(saved, opportunity.originalBullet)}>Confirm numeric evidence for this bullet</button></div>}
          {!ready && opportunity.hasExistingNumber && <p className="achievement-error">This numerical result stays out of final downloads until the value, period, source, and evidence type are supplied. Or edit the resume bullet to remove the unsupported number.</p>}
        </article>;
      })}</div>
    </details>
  </section>;
}

function calculationErrorText(error: NonNullable<ReturnType<typeof evidenceForAchievement>["error"]>) {
  const messages = {
    "invalid-number": "Enter a valid before and after value. For a reduction, the after value must be lower; for an increase, it must be higher.",
    "zero-baseline": "A percentage cannot be calculated from a zero baseline. Record a substantiated absolute result instead.",
    "negative-value": "Before and after measurements cannot be negative.",
    "unit-mismatch": "Use the same unit for both baseline and result values; convert them first if needed.",
    "missing-unit": "Enter a measurement unit so the calculation remains interpretable.",
  } satisfies Record<typeof error, string>;
  return messages[error];
}
