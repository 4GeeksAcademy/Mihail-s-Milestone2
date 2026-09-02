"use client";

export default function CandidateDetailError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="page-shell detail-shell">
      <section className="page-header">
        <p className="eyebrow">Candidate detail</p>
        <h1>Candidate could not be loaded</h1>
        <p className="lede">The records API did not return this candidate successfully.</p>
      </section>
      <section className="list-panel detail-panel">
        <p className="error-state">Try loading the candidate again.</p>
        <div className="management-bar">
          <button type="button" onClick={reset}>
            Retry
          </button>
        </div>
      </section>
    </main>
  );
}