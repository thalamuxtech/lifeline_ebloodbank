import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WHO Blood Safety Standards — LifeLine",
  description:
    "How LifeLine aligns with World Health Organization guidance on safe blood, voluntary non-remunerated donation, and quality systems.",
};

export default function WHOPage() {
  return (
    <>
      <span className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-primary-700">
        Standard
      </span>
      <h1>WHO Blood Safety</h1>
      <p className="lead text-lg">
        The World Health Organization sets the international baseline for safe and sufficient
        blood supply. LifeLine is built around the four pillars WHO identifies as essential to
        a national blood system.
      </p>

      <h2>The four WHO pillars LifeLine implements</h2>
      <ol>
        <li>
          <strong>A nationally coordinated blood transfusion service.</strong> LifeLine acts as a
          shared, multilingual layer that any hospital, drive organiser, or donor can plug into
          — reducing the fragmentation that has historically led to localised shortages in
          Nigeria.
        </li>
        <li>
          <strong>Collection from voluntary non-remunerated blood donors (VNRD).</strong> The
          donor registry tags every donor as VNRD or not, prioritises VNRD in matches, and
          gently educates first-time donors during sign-up that paid donation increases risk
          to recipients.
        </li>
        <li>
          <strong>Quality-assured testing of all donated blood.</strong> While testing happens at
          the hospital, LifeLine&apos;s inventory module enforces that every unit moves through a
          status pipeline (<code>quarantine → available → reserved → issued → transfused</code>)
          and cannot be issued without completing quarantine.
        </li>
        <li>
          <strong>Rational clinical use of blood and blood products.</strong> The request flow
          asks for specific components (whole blood, packed cells, plasma, platelets) rather
          than defaulting to whole blood, which WHO has long flagged as over-prescribed.
        </li>
      </ol>

      <h2>What this means in practice</h2>
      <h3>Donor eligibility</h3>
      <p>
        Eligibility follows WHO&apos;s baseline: healthy adults 18–65, weighing at least 50 kg,
        with at least 90 days since their last whole-blood donation (or 14 days for plasma /
        platelet apheresis). The eligibility quiz on <a href="/eligibility">/eligibility</a>{" "}
        captures the WHO-recommended deferral questions before a donor commits to a drive.
      </p>

      <h3>Component traceability</h3>
      <p>
        Every inventory unit carries an ISBT-128 barcode (see <a href="/standards/isbt-128">ISBT-128</a>),
        a collected-at timestamp, a 42-day default expiry for packed cells (WHO standard for
        CPDA-1 anticoagulated whole blood), and a hospital owner. A unit that has expired is
        automatically prevented from being marked &ldquo;available&rdquo; in the UI.
      </p>

      <h3>Haemovigilance</h3>
      <p>
        Adverse events and near-misses can be recorded against a request after fulfilment.
        Aggregated trends are surfaced in the admin dashboard so quality teams can identify
        patterns across hospitals — the first step toward the national haemovigilance system
        WHO recommends.
      </p>

      <h2>What WHO does not (yet) require, but LifeLine adds</h2>
      <ul>
        <li>SMS and USSD fallback so unconnected donors can still respond to alerts.</li>
        <li>
          Real-time matching against the donor registry within an 8&nbsp;km radius, which
          shortens the time-to-transfuse for trauma and obstetric haemorrhage cases.
        </li>
        <li>Multilingual UX (English, Hausa, Yoruba, Igbo, Pidgin) to remove literacy barriers.</li>
      </ul>

      <p className="text-xs">
        Reference:{" "}
        <a
          href="https://www.who.int/health-topics/blood-transfusion-safety"
          target="_blank"
          rel="noreferrer"
        >
          WHO — Blood transfusion safety
        </a>
        .
      </p>
    </>
  );
}
