import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading, Card } from '@/components/ui/Section';
import { Commitments } from '@/components/ui/Commitments';
import { PRICING, UPLIFTS, AUDIT_CREDIT_DAYS, DELIVERY } from '@/lib/pricing';

/**
 * Build sprint.
 *
 * Rewritten from the original page for the same reasons as the audit
 * page: raw hex throughout, `font-mono` as the chassis, UNDERSCORE_CASE
 * headings, and `text-gray-400` body copy at 3.88:1, which fails AA.
 *
 * ── Three content changes ────────────────────────────────────────
 *
 * 1. "Upgrade to a monthly retainer" is removed. It directly
 *    contradicted lib/pricing.ts, which records that there is no
 *    retainer anywhere on this site on purpose: every engagement is
 *    scoped as a result obligation to establish independence under
 *    Dutch contracting rules, and a monthly retainer is the clearest
 *    evidence against that. A sales page offering the one thing the
 *    pricing model deliberately excludes is worse than a styling bug.
 *
 * 2. The word "guarantee" is gone from three places. The old FAQ said
 *    "I guarantee delivery of the scope we defined Monday morning" and
 *    then, two sentences later, "if I underestimate, I continue until
 *    Friday EOD", which is a promise of effort wearing the clothes of
 *    a promise of completion. What is actually true is in the
 *    Commitments block: the scope is fixed Monday, the price is fixed,
 *    and an overrun is mine. That is a real commitment and it does not
 *    need the word.
 *
 * 3. "React component (300-500 lines)" is gone. Lines of code is not
 *    a unit the buyer here thinks in, and it invites the wrong
 *    conversation about scope.
 *
 * The protocol below assumes a Monday start. DELIVERY.sprint states
 * the window from the agreed start date, so the two stay consistent
 * for any start day; the weekday names are illustration.
 */

const BEST_FOR = [
  'The launch is next week and one piece of it is not built yet.',
  'Your lead developer has left and the build needs stabilising before anyone else touches it.',
  'A campaign goes live in days and needs a component and an integration that work.',
  'Animation performance has fallen over on the devices that matter.',
  'Feed automation broke and the pipeline needs rebuilding rather than patching.',
  'A platform changed its spec and a format has to be rebuilt and tested.',
];

const PROTOCOL = [
  {
    when: 'Monday, 09:00',
    what: 'Kickoff, 30 minutes',
    items: [
      'Name the one thing being built',
      'Agree the acceptance criteria in writing',
      'Confirm stack, repository and access',
      'Set the time for the daily written update',
    ],
  },
  {
    when: 'Monday to Thursday',
    what: 'The build',
    items: [
      'Full days on your thing, nothing else booked',
      'A written update each day, no standup to attend',
      'Pushed to your repository daily',
      'A preview link you can open each evening',
    ],
  },
  {
    when: 'Friday',
    what: 'Handover',
    items: [
      'Built and tested against Monday’s criteria',
      'Documented, with the decisions written down',
      'Handover call, 30 minutes',
      'Yours to deploy, on your own schedule',
    ],
  },
];

const FITS = [
  'One component, built properly and documented',
  'Animation work and the optimisation to make it hold',
  'A scripted step that removes a manual one',
  'An API or feed integration',
  'A performance problem with a known symptom',
  'A defined bug, and the refactor it needs',
];

const DOES_NOT_FIT = [
  'A rebuild of the whole application',
  'An architectural change across several features',
  'A large data migration',
  'A compliance or security audit',
  'Training your team, which is a workshop',
  'Design work. This is build only',
];

const FAQ = [
  {
    q: 'What if it is not finished by Friday?',
    a: 'The scope is fixed on Monday morning in writing, and so is the price. If I underestimated it, that is mine to carry: I do not come back for more money and I do not hand you something half-built and call it done. If the scope grows during the week, we agree in writing what comes out to make room, or it becomes a second sprint.',
  },
  {
    q: 'Do I get the source and the documentation?',
    a: 'Yes, and daily rather than at the end. Everything is pushed to your repository as it is written, commented where the reasoning is not obvious, with a written handover covering how it runs and what I would watch.',
  },
  {
    q: 'Can I add things mid-sprint?',
    a: 'Not without taking something out. A week that absorbs three new requests delivers none of them, and the fixed price only works because the scope is fixed too. Anything extra is the next sprint.',
  },
  {
    q: 'Can it start on a different day?',
    a: `The standard week is Monday to Friday. Wednesday to Sunday is ${UPLIFTS.sprintWeekend.label} and Thursday to Monday is ${UPLIFTS.sprintShoulder.label}, both because they take weekend days. Other start days are fine at the standard price if they do not.`,
  },
  {
    q: 'Can I book two in a row?',
    a: 'Yes, as two sprints: same fixed price, same fixed scope, scoped separately on each Monday. Deliberately not sold as a monthly arrangement, because each week has to stand on its own deliverable.',
  },
  {
    q: 'What if you are not sure a week is enough?',
    a: `Then I will say so before you book rather than after. If the shape of the problem is not clear enough to scope in a Monday meeting, the audit is the cheaper way to find out, and its fee comes off whatever gets built within ${AUDIT_CREDIT_DAYS} days.`,
  },
];

export default function SprintOffering() {
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
            offering / build sprint
          </Link>

          <h1 className="max-w-4xl text-h1 font-bold tracking-hero text-fg md:text-display">
            One week. One thing. Built and handed over.
          </h1>

          <p className="mt-6 max-w-2xl text-body text-fg-muted">
            The week is blocked for your build and nothing else is booked
            against it. Scope is agreed on Monday morning, the price is fixed
            before it starts, and it is in your repository on Friday.
          </p>

          <p className="mt-8 text-h3 font-bold text-neon">
            {PRICING.sprint.label} for the week
          </p>
          <p className="mt-1 text-small text-fg-subtle">
            Fixed before it starts, whatever the week turns out to hold.
          </p>
        </div>
      </section>

      {/* ─── WHAT YOU CAN HOLD ME TO ─── */}
      <Section tone="raised" width="prose">
        <Commitments delivery={DELIVERY.sprint} />
      </Section>

      {/* ─── WHEN IT IS THE RIGHT TOOL ─── */}
      <Section tone="raised">
        <SectionHeading
          eyebrow="When it fits"
          lede="A sprint is for a problem that is already understood and simply has to be built. If the problem itself is still vague, it is the wrong purchase, and the audit is the right one."
        >
          Six situations this is built for
        </SectionHeading>

        <ul className="grid gap-4 md:grid-cols-2">
          {BEST_FOR.map((item) => (
            <li
              key={item}
              className="border-l-2 border-neon pl-5 text-small text-fg-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* ─── HOW THE WEEK RUNS ─── */}
      <Section>
        <SectionHeading
          eyebrow="How the week runs"
          lede={`${DELIVERY.sprint.days} working days from ${DELIVERY.sprint.startsWhen}. An hour of your time in total: half at the start, half at the end.`}
        >
          Two calls, four build days
        </SectionHeading>

        <ol className="grid gap-4 md:grid-cols-3">
          {PROTOCOL.map((p) => (
            <li key={p.when}>
              <Card>
                <p className="terminal text-label uppercase tracking-label text-neon">
                  {p.when}
                </p>
                <h3 className="mt-2 text-h3 font-bold text-fg">{p.what}</h3>
                <ul className="mt-4 space-y-2">
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-2 text-small text-fg-muted">
                      <span className="text-accent" aria-hidden="true">
                        ▪
                      </span>
                      {i}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      {/* ─── SCOPE ─── */}
      <Section tone="raised">
        <SectionHeading
          eyebrow="Scope"
          lede="Said plainly so you can rule it out quickly. Booking a sprint for something on the right-hand list wastes your money and my week."
        >
          What a week holds, and what it does not
        </SectionHeading>

        <div className="grid gap-4 md:grid-cols-2">
          <Card highlighted>
            <h3 className="text-h3 font-bold text-neon">Fits in a week</h3>
            <ul className="mt-4 space-y-2">
              {FITS.map((f) => (
                <li key={f} className="flex gap-2 text-small text-fg-muted">
                  <span className="text-accent" aria-hidden="true">
                    ▪
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-h3 font-bold text-fg">Does not fit</h3>
            <ul className="mt-4 space-y-2">
              {DOES_NOT_FIT.map((f) => (
                <li key={f} className="flex gap-2 text-small text-fg-subtle">
                  <span aria-hidden="true">▪</span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-small text-fg-subtle">
              Most of these are real pieces of work. They are just not
              one-week pieces of work, and pretending otherwise is how a
              fixed price turns into a bad week for both of us.
            </p>
          </Card>
        </div>
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
        <SectionHeading>Know what needs building?</SectionHeading>
        <p className="mb-8 text-body text-fg-muted">
          Tell me what it is and when it has to be live. If a week is not
          enough for it, you will hear that before you book rather than on
          the Thursday.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href="/#contact">Book a sprint, {PRICING.sprint.label}</Button>
          <Button href="/offerings/audit" variant="secondary">
            Or scope it with an audit first
          </Button>
        </div>
        <Link
          href="/#live"
          className="mt-10 -mb-3 inline-flex items-center gap-2 py-3 text-small text-fg-subtle hover:text-neon"
        >
          See work that came out of weeks like this
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </Section>
    </main>
  );
}
