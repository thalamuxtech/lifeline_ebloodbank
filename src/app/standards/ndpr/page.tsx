import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NDPR Compliance — LifeLine",
  description:
    "How LifeLine handles donor and patient data under the Nigeria Data Protection Regulation and the Nigeria Data Protection Act 2023.",
};

export default function NDPRPage() {
  return (
    <>
      <span className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-primary-700">
        Privacy
      </span>
      <h1>NDPR &amp; NDPA</h1>
      <p className="lead text-lg">
        Blood-service data is health data, and health data is the most sensitive category
        of personal information under Nigerian law. LifeLine is built to comply with the
        Nigeria Data Protection Regulation 2019 (NDPR) and the Nigeria Data Protection Act
        2023 (NDPA), which strengthened and largely superseded it.
      </p>

      <h2>The principles we hold ourselves to</h2>
      <ol>
        <li>
          <strong>Lawful basis.</strong> Donor data is processed on the basis of explicit
          consent given at sign-up; patient-request data is processed under the legitimate
          interest of saving life, with consent backfilled where reachable.
        </li>
        <li>
          <strong>Purpose limitation.</strong> Phone numbers are used to alert donors when
          their blood type is needed nearby. They are not used for marketing, resale, or
          political messaging.
        </li>
        <li>
          <strong>Data minimisation.</strong> A donor record stores name, phone, city, blood
          group, and VNRD status — nothing more. We deliberately do not collect national
          identification numbers, addresses, or biometrics.
        </li>
        <li>
          <strong>Accuracy.</strong> Donors can correct or update their own record from{" "}
          <a href="/account">/account</a>.
        </li>
        <li>
          <strong>Storage limitation.</strong> The NBSA Act requires 30-year retention of
          unit lineage. Personally identifying fields are stripped after a donor exercises
          their right-to-erasure; the de-identified donation record is retained for
          haemovigilance.
        </li>
        <li>
          <strong>Integrity &amp; confidentiality.</strong> All traffic is HTTPS. Firestore
          security rules — not application code alone — gate read and write access by role.
        </li>
        <li>
          <strong>Accountability.</strong> Each admin action against a donor or unit record is
          attributable to a Firebase Auth UID and persisted in the audit log.
        </li>
      </ol>

      <h2>Your rights as a data subject</h2>
      <p>Under the NDPA you have the right to:</p>
      <ul>
        <li>Be informed about how your data is processed (this page is part of that).</li>
        <li>Access the data we hold about you.</li>
        <li>Rectify inaccurate data.</li>
        <li>Erase your data (subject to the 30-year unit-traceability requirement above).</li>
        <li>Restrict or object to processing for non-essential purposes.</li>
        <li>Port your data to another controller in a structured, machine-readable format.</li>
        <li>Lodge a complaint with the Nigeria Data Protection Commission (NDPC).</li>
      </ul>
      <p>
        To exercise any of these rights, email{" "}
        <a href="mailto:privacy@haleyouthfoundation.org">privacy@haleyouthfoundation.org</a>.
        We respond within 30 days as required by the NDPA.
      </p>

      <h2>What we share, and with whom</h2>
      <ul>
        <li>
          <strong>Hospitals</strong> see only the donors whose blood type matches an open
          request in their facility&apos;s city, and only the fields needed to make contact (name,
          phone, blood group, city). Address, donation history, and email are never shared.
        </li>
        <li>
          <strong>Processors.</strong> We rely on Google Firebase (Auth, Firestore, Hosting)
          and on SMS / voice gateway providers for the multilingual channels. Each is bound
          by a Data Processing Agreement that mirrors the NDPA controller-processor terms.
        </li>
        <li>
          <strong>Regulators.</strong> Aggregated, non-identifying statistics are shared with
          the NBSC. Identifiable data is shared only in response to a lawful order.
        </li>
      </ul>

      <h2>Security incidents</h2>
      <p>
        If we detect a personal-data breach, we notify the NDPC within 72 hours and any
        affected donors directly via SMS and email as soon as we can confirm the scope. We
        keep an internal incident log that NDPC auditors can review on request.
      </p>

      <p className="text-xs">
        Reference: Nigeria Data Protection Act 2023; Nigeria Data Protection Regulation 2019.
      </p>
    </>
  );
}
