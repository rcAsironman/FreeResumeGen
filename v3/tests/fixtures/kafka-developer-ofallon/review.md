# Kafka Developer prompt review

This is a manually authored, fictional before-and-after evaluation using the supplied O'Fallon Kafka Developer JD. It is not an independent model benchmark, ATS score, or recruiter hiring prediction. The application still uses the user's external ChatGPT workflow; no external model call was made.

## Initial review findings

The initial sample illustrates the previous prompt's administration-first bias: its headline changes Kafka Developer to Senior Kafka Administrator, the summary favors platform component lists, Ansible evidence is absent, and recent Java tooling evidence is omitted. These omissions are material because the JD specifically requests automation and Java platform enhancements.

## Refinement

The production Kafka prompt now classifies the actual role and orders responsibilities by this JD rather than a fixed administrator template. It explicitly preserves Java tooling when requested, requires employer-level evidence for Ansible, and distinguishes overall career length from messaging experience. Confluent remains the recent platform context; earlier Kafka work uses Apache Kafka. Location and onsite availability remain candidate facts, not assumptions copied from the JD.

The refined fictional sample has 15+ years of total engineering experience since July 2011 and approximately six years of Kafka work since July 2020 as of October 2026. It addresses the JD's 3–6 years of messaging experience without pretending the candidate has only six total career years. Its recent bullets demonstrate Ansible, scripting, CI/CD, incidents, RCA, capacity planning, operational readiness, Java tooling, and collaboration. It claims no invented performance percentages or onsite availability.

## Your actual source

Your current Kafka source supports 10+ total years, not this fictional 15-year history. It includes Python/Shell, CI/CD, SRE, monitoring, Kafka administration, production support and a Java background. It does not name Ansible, and Java-specific platform-tool implementation is not clearly documented. Those are evidence gaps: this test must not introduce either into your personal history. Confirm actual playbook work and Java tooling tasks before claiming them.

## Files

- source-fictional.json: isolated synthetic evidence fixture.
- resume-initial-review-sample.json: deliberately weaker manual review sample.
- resume-refined.json: refined sample in the application schema.
- resume-refined.md: readable version of the refined sample.
- job-description.txt: supplied JD.

All fixtures are outside data, so they do not appear as selectable personal master resumes. Deterministic validation checks structure, chronology, evidence retention, and JD coverage. A word match alone does not prove quality; the review above assesses whether the requirement is demonstrated in a responsibility.
