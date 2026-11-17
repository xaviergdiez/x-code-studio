/**
 * Pricing, in one place.
 *
 * Prices were previously hardcoded across five files and had already
 * drifted: the homepage sold a "build sprint" at €2,950 while the
 * design system page sold a 6 to 8 week engagement for €4,500. Any
 * price shown anywhere now comes from here.
 *
 * ── How these numbers were set ────────────────────────────────────
 *
 * Anchor: roughly €1,200 per working day.
 *
 * That sits in the Technical Director / Architect band (€120 to €160
 * per hour) rather than the Senior Creative Developer band (€85 to
 * €110), which is the whole point of the positioning: the site sells
 * architecture and judgement, not execution capacity. An Amsterdam
 * senior contractor day rate benchmarks around €650 for defined-scope
 * engineering work, and fixed-price delivery carries the overrun risk
 * that a day rate hands to the client, so it prices above that.
 *
 * The old prices were not merely low, they contradicted the site.
 * The audit was €995 for a week of work producing a 15 to 25 page
 * report, which implies about €31 per hour. The Dutch legal
 * presumption of employment (VBAR) is indexed at roughly €36 per hour
 * for 2026, and a rate below it is evidence *for* an employment
 * relationship. Every engagement on this site is scoped as a result
 * obligation specifically to establish independence, so pricing under
 * that threshold undermined the compliance argument the site makes.
 *
 * Every price below clears that threshold with room to spare.
 *
 * Changing a price: edit it here. Implied day and hour rates are
 * derived, so the comments stay honest.
 */

export type Price = {
  /** Shown to the reader, e.g. "€3,500". */
  label: string;
  /** Numeric value in euros, for deriving implied rates. */
  amount: number;
  /** Typical working days, used to sanity-check the implied rate. */
  days: number;
  /** "fixed" → "€3,500 fixed"; "from" → "from €14,500"; "annual" → "€4,800 a year". */
  basis: 'fixed' | 'from' | 'annual';
};

const euro = (n: number) => `€${n.toLocaleString('en-GB')}`;

function price(amount: number, days: number, basis: Price['basis'] = 'fixed'): Price {
  return { label: euro(amount), amount, days, basis };
}

export const PRICING = {
  /** 4 days → ~€109/hr */
  audit: price(3500, 4),
  /** 5 days → ~€149/hr */
  sprint: price(5950, 5),
  /** 6 to 8 weeks elapsed, ~18 billable days → ~€100/hr */
  designSystem: price(14500, 18, 'from'),
  /** 2 days delivery plus preparation → ~€280/hr on delivery days */
  workshop: price(4500, 2),
  /**
   * A bespoke tool: a Figma plugin, a build and preview pipeline, an
   * automated delivery step. Roughly 6 days → ~€156/hr.
   */
  tooling: price(7500, 6, 'from'),
  /**
   * Keeping a delivered tool working. Ad platform specs, the Figma
   * plugin API and the Node ecosystem all move, so a tool built this
   * year breaks next year. Priced at about a quarter of a build per
   * year, which is the usual band for software maintenance.
   *
   * This is deliberately not a retainer. It buys a working tool, not
   * availability: a result obligation, renewable and cancellable,
   * with no commitment to be on call. That distinction is what keeps
   * it clean under Dutch contracting rules, and it is the reason the
   * site has no monthly retainer anywhere.
   */
  toolCare: price(4800, 0, 'annual'),
} as const;

/** Rush and out-of-hours uplifts, kept proportional to the base. */
export const UPLIFTS = {
  /** Audit delivered in 3 working days rather than the standard 5. */
  auditExpress: price(875, 0),
  /** Audit delivered in 2 days, starting Monday, delivered Wednesday. */
  auditRush: price(1750, 0),
  /** Sprint running Wed to Sun. */
  sprintWeekend: price(7450, 5),
  /** Sprint running Thu to Mon. */
  sprintShoulder: price(6950, 5),
  /** Engineering the system into a codebase, quoted separately. */
  implementation: price(7500, 0, 'from'),
} as const;

/**
 * The audit fee comes off a sprint or system build booked within this
 * window, which turns the audit from a cost into a deposit and keeps
 * it working as the entry to the ladder rather than a barrier.
 */
export const AUDIT_CREDIT_DAYS = 60;

/** "€3,500 fixed", "from €14,500" or "€4,800 a year". */
export function priceLabel(p: Price): string {
  if (p.basis === 'from') return `from ${p.label}`;
  if (p.basis === 'annual') return `${p.label} a year`;
  return `${p.label} fixed`;
}

/** Implied hourly rate at 8h days, for internal sanity checks. */
export function impliedHourly(p: Price): number | null {
  return p.days > 0 ? Math.round(p.amount / (p.days * 8)) : null;
}

/**
 * ── What the buyer can hold me to ────────────────────────────────
 *
 * Every engagement on this site was fixed-price with no stated
 * turnaround and no revision policy anywhere. In a fixed-price model
 * an unstated revision policy is an open risk on both sides, and the
 * buyer carries it first: they cannot tell whether "fixed" means two
 * rounds or twenty, so they assume the worst and ask for a call.
 *
 * Competitors state this plainly. BannerBazen publishes a standard
 * set of up to ten formats in three working days after master
 * approval, two revisions on the master and one on the set. That is
 * the single most confidence-building thing on their site and it
 * costs them nothing.
 *
 * `Price.days` above is BILLABLE days, used to derive the implied
 * rate. `Delivery.days` below is ELAPSED working days from kickoff
 * to delivery, which is the number a buyer actually plans around.
 * They are not the same and were quietly contradicting each other:
 * the audit carried `days: 4`, the homepage tier said "one week",
 * and the express uplift described "the standard 5". Elapsed is five.
 *
 * These are commitments, not marketing. Xavi confirmed all four
 * windows and revision counts below as keepable, as written, on 17
 * November 2026. They become contractual the moment they are on a
 * page, so change them here rather than in a page, and re-confirm
 * before shortening a window or cutting a revision round.
 */
export type Delivery = {
  /** Elapsed working days from kickoff to first delivery. */
  days: number;
  /** What starts the clock. Vague starts make the window meaningless. */
  startsWhen: string;
  /** Included revision rounds, in the buyer's terms. */
  revisions: string;
};

export const DELIVERY = {
  audit: {
    days: 5,
    startsWhen: 'the kickoff call',
    revisions: 'One round of corrections on the written report.',
  },
  sprint: {
    days: 5,
    startsWhen: 'the agreed start date',
    revisions: 'Two rounds on the deliverable inside the sprint week.',
  },
  tooling: {
    days: 6,
    startsWhen: 'the spec is signed off',
    revisions:
      'Two rounds on the build, plus 30 days of fixes after handover at no charge.',
  },
  designSystem: {
    days: 18,
    startsWhen: 'the audit is delivered',
    revisions:
      'Two rounds on the core library, one on each template family.',
  },
} as const satisfies Record<string, Delivery>;

/** "5 working days from the kickoff call". */
export function deliveryLabel(d: Delivery): string {
  return `${d.days} working days from ${d.startsWhen}`;
}
