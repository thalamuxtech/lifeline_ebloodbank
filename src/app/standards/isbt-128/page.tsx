import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ISBT-128 Traceability — LifeLine",
  description:
    "How LifeLine implements the ISBT-128 international standard for identification and labelling of blood, tissue, and cellular therapy products.",
};

export default function ISBT128Page() {
  return (
    <>
      <span className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-primary-700">
        Identification
      </span>
      <h1>ISBT-128</h1>
      <p className="lead text-lg">
        ISBT-128 is the global standard for identifying and labelling medical products of
        human origin — blood, tissue, cells, organs, and milk. It is published by the
        International Council for Commonality in Blood Banking Automation (ICCBBA) and is
        mandated by regulators on five continents. LifeLine treats it as the source of truth
        for every unit in inventory.
      </p>

      <h2>Why a global standard matters</h2>
      <p>
        A unit collected at LUTH in Lagos may be transferred to UCH Ibadan and ultimately
        transfused at a private clinic. Without a global identifier, the chain breaks at every
        boundary — and re-labelling introduces transcription errors that have caused
        documented fatalities elsewhere. ISBT-128 gives every unit a globally unique ID that
        any reader, in any facility, in any country can decode unambiguously.
      </p>

      <h2>Anatomy of an ISBT-128 Donation Identification Number (DIN)</h2>
      <p>A LifeLine barcode follows the standard 13-character DIN structure:</p>
      <pre>
        <code>{`= W 0001 24 123456 7
  │ │    │  │      └─ check digit
  │ │    │  └──────── 6-digit sequence (unit within the facility-year)
  │ │    └─────────── 2-digit year of collection
  │ └──────────────── 4-digit facility identifier (ICCBBA-assigned)
  └────────────────── flag character ("W" = whole-blood / RBC chain)`}</code>
      </pre>
      <p>
        The leading <code>=</code> is the data identifier that tells a scanner this is a
        DIN. The check digit is computed by ISO/IEC 7064 MOD 37,2 — a single transcription
        error anywhere in the DIN will fail verification.
      </p>

      <h2>What LifeLine does with it</h2>
      <ul>
        <li>
          <strong>Validated on entry.</strong> When a hospital adds a unit to inventory, the
          DIN is checked for length, character set, and check-digit correctness before the
          unit is persisted.
        </li>
        <li>
          <strong>Indexed for lookup.</strong> The full DIN is indexed in Firestore so any
          unit can be retrieved by scanning the barcode at any participating facility.
        </li>
        <li>
          <strong>Linked to product code.</strong> Each unit also stores its ISBT-128 Product
          Description Code — packed cells, fresh frozen plasma, apheresis platelets, and so on
          — so the clinical-use rules (storage temperature, expiry, irradiation requirements)
          are derivable without a free-text component field.
        </li>
        <li>
          <strong>Preserved across transfers.</strong> When a unit is transferred between
          hospitals, only the <code>hospital</code> ownership field changes. The DIN never
          changes, which is the entire point of the standard.
        </li>
      </ul>

      <h2>What ISBT-128 does <em>not</em> cover</h2>
      <p>
        The standard identifies a unit; it does not certify it. A correctly-formatted ISBT-128
        barcode tells you the unit exists in a registry — not that it is safe to transfuse.
        The screening status, expiry, and component-specific storage conditions are tracked
        separately in LifeLine&apos;s inventory record and must all be valid before a unit can
        move from <code>available</code> to <code>issued</code>.
      </p>

      <p className="text-xs">
        Reference:{" "}
        <a href="https://www.iccbba.org/" target="_blank" rel="noreferrer">
          ICCBBA — Standards for Medical Products of Human Origin
        </a>
        .
      </p>
    </>
  );
}
