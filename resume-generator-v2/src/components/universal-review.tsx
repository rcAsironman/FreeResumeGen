"use client";
import type { analyzeCoverage } from "@/lib/jd-coverage";
import type { reviewResume, ReviewStatement } from "@/lib/resume-review";

export function UniversalReview({ review, coverage, onConfirm }: {
  review: ReturnType<typeof reviewResume>; coverage: ReturnType<typeof analyzeCoverage> | null;
  onConfirm: (statement: ReviewStatement) => void;
}) {
  return <div className="universal-review">
    <h3>Review before downloading</h3>
    <p role="status">{review.pending.length ? `${review.pending.length} statements need confirmation. Review each statement or edit it in the resume below.` : "All resume statements reviewed. Downloads are ready."}</p>
    <p className="helper">Confirmation records the exact statement, candidate, employer, date, and originating JD. Edited text needs a new review. Numerical results need measurement evidence separately.</p>
    <details open={review.pending.length > 0}><summary>Review statements · {review.pending.length} pending</summary>
      <div className="statement-review-list">{review.pending.map(statement => <article key={statement.path}>
        <small>{statement.employerId === "global" ? "Candidate" : statement.employerId} · {statement.section}</small>
        <p>{statement.text}</p>
        {statement.conflict ? <p className="achievement-error">{statement.conflict}</p> : statement.numeric ? <p className="achievement-error">Add measured evidence below or replace this with an accurate qualitative statement.</p> : <button type="button" className="button secondary" onClick={() => onConfirm(statement)}>Confirm this statement</button>}
      </article>)}</div>
    </details>
    {coverage && <details className="coverage-review"><summary>JD coverage and evidence</summary>
      <div className="alignment-breakdown"><span>JD terminology coverage <b>{coverage.keywordCoverage ?? "—"}%</b></span><span>Verified experience coverage <b>{coverage.verifiedCoverage ?? "—"}%</b></span></div>
      <p className="helper">{coverage.disclaimer}</p>
      <p>Headline: {coverage.titleAligned ? "aligned" : "different from JD"}. Summary: {coverage.summaryRelevance} requirements represented. Experience: {coverage.experienceRelevance} requirements represented. Detailed responsibilities: {coverage.technicalDepth}.</p>
      {coverage.experienceGapYears !== null && <p>Actual employment gap against JD requirement: {coverage.experienceGapYears.toFixed(1)} years. Employment dates are not rewritten.</p>}
      <ul>{coverage.checks.map((check, i) => <li key={i}><b>{check.kind} · {check.text}</b> — {check.verified ? `evidence: ${check.supportedBy.join(", ") || "candidate qualifications"}` : "not established by verified evidence"}{check.missingTerms.length > 0 && `; missing terms: ${check.missingTerms.join(", ")}`}</li>)}</ul>
      {coverage.employerEvidence.map(item => <p key={item.employerId}><b>{item.company}</b>: {item.relevantRequirements.length} supported requirements; {item.unsupportedResponsibilities.length} responsibilities without an exact saved evidence match.</p>)}
      {coverage.projectEvidence.map((item, i) => <p key={i}>Project {item.name}: {item.supported ? "source match" : "requires project evidence"}</p>)}
    </details>}
  </div>;
}
