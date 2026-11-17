import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading, Card } from '@/components/ui/Section';
import { Commitments } from '@/components/ui/Commitments';
import {
  PRICING,
  UPLIFTS,
  AUDIT_CREDIT_DAYS,
  DELIVERY,
  priceLabel,
} from '@/lib/pricing';

/**
 * Workflow audit.
 *
 * Rewritten from the original page, which was built before the design
 * system existed and had drifted a long way from it: raw hex for every
 * colour, `font-mono` as the page chassis rather than an accent,
 * UNDERSCORE_CASE headings, and `text-gray-400` for all body copy,
 * which measures 3.88:1 and fails WCAG AA. The case studies on this
 * same site sell AA compliance as a delivered outcome, so the site
 * failing it on a sales page is the kind of gap a buyer notices.
 *
 * ── Three content changes, not just a restyle ────────────────────
 *
 * 1. The accordion is gone. Each "what you get" card was a plain div
 *    with an onClick: no keyboard handler, no aria-expanded, no role,
 *    so the detail was unreachable without a mouse. The details are
 *    short enough to show outright, which removes the bug rather than
 *    fixing it.
 *
 * 2. "Money-back guarantee if not satisfied" is removed. It sat in
 *    small text under the CTA and was never scoped: no definition of
 *    "satisfied", no window, no statement of what gets refunded. That
 *    is a larger commitment than anything in DELIVERY, and it was
 *    never signed off. Flagged to Xavi rather than quietly reworded;
 *    if he wants it back it needs terms, not a sentence.
 *
 * 3. "ROI impact projections" is now "what the lost time is worth".
 *    A five-day audit can do arithmetic on a team's own hours, which
 *    is defensible. It cannot project return on investment, and the
 *    house rule is that every number has to survive "how would you
 *    know that".
 *
 * The timeline below must stay in step with DELIVERY.audit.days.
 */

const COVERS = [
  {
    title: 'The codebase',
    body: 'Repository structure, build pipeline and dependency health, read against how your team actually works in it.',
    details: [
      'Build and bundling pipeline',
      'Dependency and security state',
      'Where the repeated work is encoded',
      'Technical debt, ranked by what it costs you',
    ],
  },
  {
    title: 'The variant path',
    body: 'The route from one master to every size, market and language, put under enough load to find where it breaks.',
    details: [
      'Feed parsing and validation',
      'Variant generation at campaign scale',
      'Localisation accuracy',
      'Asset delivery under load',
    ],
  },
  {
    title: 'Performance in the wild',
    body: 'What your live units weigh and how they behave on the connections and devices your campaigns actually reach.',
    details: [
      'Core Web Vitals on live placements',
      'Network waterfall per unit',
      'Asset and payload optimisation',
      'Browser and platform support matrix',
    ],
  },
  {
    title: 'The written report',
    body: 'An executive summary your director can read in five minutes, and the technical detail underneath it for the people who will act on it.',
    details: [
      'Findings ranked by cost to you',
      'A 30, 60 and 90 day sequence',
      'What the lost time is worth',
      'Vendor and tooling evaluation',
    ],
  },
];

const WEEK = [
  {
    when: 'Day 1',
    what: 'Kickoff call, 30 minutes',
    body: 'Walk the stack together and agree what is in scope. This is what starts the clock.',
  },
  {
    when: 'Days 2 to 4',
    what: 'Inside the process',
    body: 'Repository, feeds and live performance. Read-only access to your repository and staging, nothing in production.',
  },
  {
    when: 'Day 5',
    what: 'Report and walkthrough',
    body: 'The written report, plus an hour going through it with whoever has to act on it.',
  },
];

const FAQ = [
  {
    q: 'How long is the report?',
    a: 'Between 15 and 25 pages: executive summary, findings ranked by what they cost you, a 30, 60 and 90 day sequence, and specific tooling recommendations. Length follows what is in your pipeline rather than a target.',
  },
  {
    q: 'Do you need access to production?',
    a: 'No. Read-only access to your repository and your staging environment is enough. Live placements are measured from the outside, the same way anyone can.',
  },
  {
    q: 'Can I get it faster?',
    a: `Yes. ${UPLIFTS.auditExpress.label} brings it to three working days. ${UPLIFTS.auditRush.label} brings it to two, starting Monday and delivered Wednesday. Both are the same scope, compressed.`,
  },
  {
    q: 'What if I want help doing the work?',
    a: `The report is written to be handed to your own team. If you would rather I executed part of it, the audit fee comes off a build sprint (${PRICING.sprint.label}) or an ad system build (${priceLabel(PRICING.designSystem)}) booked within ${AUDIT_CREDIT_DAYS} days. A team workshop (${PRICING.workshop.label}) is the other route, and it is the cheaper one if the knowledge is the gap rather than the hours.`,
  },
];

export default function AuditOffering() {
  return (
    <main className="bg-ink-800">
      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[56vh] items-end overflow-hidden border-b border-line bg-ink-900">
        <div className="absolute inset-0 grid-bg-dense opacity-40" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
          <Link
            href="/"
            className="terminal mb-8 -my-3.5 inline-flex items-center gap-2 py-3.5 text-label uppercase tracking-label text-fg-subtle hover:text-neon"
          >
            <ArrowLeft size={12} aria-hidden="true" />
            offering / workflow audit
          </Link>

          <h1 className="max-w-4xl text-h1 font-bold tracking-hero text-fg md:text-display">
            Find out where the week actually goes.
          </h1>

          <p className="mt-6 max-w-2xl text-body text-fg-muted">
            Five days inside your ad production process, and a written report
            naming the bottlenecks, what each one costs you and which to fix
            first. No tooling to buy at the end of it.
          </p>

          <p className="mt-8 text-h3 font-bold text-neon">
            {priceLabel(PRICING.audit)}
          </p>
          <p className="mt-1 text-small text-fg-subtle">
            One engagement, one report, no retainer attached.
          </p>
        </div>
      </section>

      {/* ─── WHAT YOU CAN HOLD ME TO ─── */}
      <Section tone="raised" width="prose">
        <Commitments delivery={DELIVERY.audit} />
      </Section>

      {/* ─── WHY AN AUDIT FIRST ─── */}
      <Section tone="raised" width="prose">
        <SectionHeading eyebrow="Why start here">
          Nobody should sell you a system before reading yours
        </SectionHeading>
        <div className="space-y-5 text-body text-fg-muted">
          <p>
            Most production bottlenecks are not where the team thinks they are.
            The expensive one is usually a step so normal that nobody counts it
            any more: a naming convention enforced by hand, an export that has
            to be redone per channel, an approval that sends a set back to the
            start.
          </p>
          <p>
            So the audit comes first, and it is deliberately buyable on its own.
            You end up with a document your team can act on without me, which is
            the point. If you then want the work done, the fee comes off it.
          </p>
        </div>
      </Section>

      {/* ─── WHAT IT COVERS ─── */}
      <Section>
        <SectionHeading
          eyebrow="What it covers"
          lede="Four passes over the pipeline, from the repository to what a real placement weighs on a real phone."
        >
          Four things get read
        </SectionHeading>

        <ul className="grid gap-4 md:grid-cols-2">
          {COVERS.map((c) => (
            <li key={c.title}>
              <Card>
                <h3 className="text-h3 font-bold text-fg">{c.title}</h3>
                <p className="mt-2 text-small text-fg-muted">{c.body}</p>
                <ul className="mt-4 space-y-2 border-t border-line pt-4">
                  {c.details.map((d) => (
                    <li
                      key={d}
                      className="flex gap-2 text-small text-fg-subtle"
                    >
                      <span className="text-accent" aria-hidden="true">
                        ▪
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* ─── HOW THE WEEK RUNS ─── */}
      <Section tone="raised">
        <SectionHeading
          eyebrow="How the week runs"
          lede={`${DELIVERY.audit.days} working days from ${DELIVERY.audit.startsWhen}. Half an hour of your time at the start, an hour at the end.`}
        >
          Two meetings, and the rest is reading
        </SectionHeading>

        <ol className="space-y-8">
          {WEEK.map((p) => (
            <li key={p.when} className="flex flex-col gap-2 sm:flex-row sm:gap-8">
              <p className="terminal shrink-0 text-label uppercase tracking-label text-neon sm:w-32">
                {p.when}
              </p>
              <div>
                <h3 className="text-body font-bold text-fg">{p.what}</h3>
                <p className="mt-1 text-small text-fg-muted">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ─── FAQ ─── */}
      <Section width="prose">
        <SectionHeading eyebrow="Before you book">
          The questions people actually ask
        </SectionHeading>

        <dl className="space-y-6">
          {FAQ.map((item) => (
            <div key={item.q}>
              <dt className="text-body font-bold text-fg">{item.q}</dt>
              <dd className="mt-2 text-small text-fg-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ─── NEXT ─── */}
      <Section tone="raised" width="prose">
        <SectionHeading>Ready to have it read?</SectionHeading>
        <p className="mb-8 text-body text-fg-muted">
          Tell me what the slow part feels like from where you sit. If an audit
          is the wrong tool for it, I will say so and point at the right one.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href="/#contact">Book the audit, {PRICING.audit.label}</Button>
          <Button href="/offerings/sprint" variant="secondary">
            Or look at the build sprint
          </Button>
        </div>
        <Link
          href="/#live"
          className="mt-10 -mb-3 inline-flex items-center gap-2 py-3 text-small text-fg-subtle hover:text-neon"
        >
          See the kind of work this comes out of
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </Section>
    </main>
  );
}
