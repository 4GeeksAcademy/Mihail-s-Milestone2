import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="eyebrow">Candidate not found</p>
        <h1>This record is unavailable</h1>
        <p className="lede">The candidate may have been removed or the link may be incorrect.</p>
        <Link className="button-link" href="/">
          Back to candidates
        </Link>
      </section>
    </main>
  );
}