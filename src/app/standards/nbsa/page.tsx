import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NBSA Act 2021 — LifeLine",
  description:
    "How LifeLine complies with the National Blood Service Commission Act 2021 — Nigeria&apos;s primary legislation governing blood collection, testing, storage, and transfusion.",
};

export default function NBSAPage() {
  return (
    <>
      <span className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-primary-700">
        Legislation
      </span>
      <h1>NBSA Act 2021</h1>
      <p className="lead text-lg">
        The National Blood Service Commission Act 2021 — commonly called the NBSA Act —
        replaced the older National Blood Transfusion Service framework and established the
        National Blood Service Commission (NBSC) as the regulator of all blood-service
        activity in Nigeria. LifeLine is built to operate inside that framework, not around it.
      </p>

      <h2>What the Act requires</h2>
      <ul>
        <li>
          <strong>Licensing.</strong> Every blood-service facility — public or private — must
          be licensed by the NBSC before collecting, testing, processing, storing, or issuing
          blood.
        </li>
        <li>
          <strong>Voluntary, non-remunerated donation.</strong> The Act criminalises paid
          donation and the sale of blood, with limited exceptions for cost-recovery
          processing fees set by the Commission.
        </li>
        <li>
          <strong>Traceability.</strong> Each unit must be traceable from donor → component →
          recipient, with records retained for a minimum of 30 years.
        </li>
        <li>
          <strong>Mandatory screening.</strong> All donated blood must be screened for HIV-1/2,
          Hepatitis B, Hepatitis C, syphilis, and any additional pathogen the Commission
          designates.
        </li>
        <li>
          <strong>Adverse-event reporting.</strong> Transfusion reactions and near-misses must
          be reported to the Commission within statutory timeframes.
        </li>
      </ul>

      <h2>How LifeLine maps to the Act</h2>
      <table>
        <thead>
          <tr>
            <th>NBSA requirement</th>
            <th>LifeLine implementation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Licensed facility identifier on every unit</td>
            <td>
              The <code>hospital</code> field on each inventory unit is the licensed
              facility name; rules block writes by unlinked accounts.
            </td>
          </tr>
          <tr>
            <td>VNRD-only policy</td>
            <td>
              Donors carry a <code>vnrd: boolean</code> flag. The matching engine ranks
              VNRD donors first and never surfaces paid donors to hospitals.
            </td>
          </tr>
          <tr>
            <td>30-year retention</td>
            <td>
              Records are not deleted on donor account removal — they are anonymised
              (PII stripped) while the donation history and unit lineage are retained.
            </td>
          </tr>
          <tr>
            <td>Screening pipeline</td>
            <td>
              The <code>quarantine</code> status holds units until the facility lab
              records a negative result for the NBSC&apos;s mandatory panel.
            </td>
          </tr>
          <tr>
            <td>Adverse-event reporting</td>
            <td>
              Hospital users can attach an adverse-event note to any fulfilled request;
              admins aggregate and export the report monthly.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>What facilities should still do themselves</h2>
      <p>
        LifeLine is a coordination and traceability layer, not a regulatory substitute. Each
        participating facility remains responsible for:
      </p>
      <ul>
        <li>Maintaining a current NBSC operating licence.</li>
        <li>
          Running the physical lab screening (LifeLine records the result; it does not
          perform the test).
        </li>
        <li>
          Notifying the NBSC of incidents within the timelines specified in the Commission&apos;s
          regulations.
        </li>
      </ul>

      <p className="text-xs">
        Reference: National Blood Service Commission Act, 2021 — Federal Republic of Nigeria.
      </p>
    </>
  );
}
