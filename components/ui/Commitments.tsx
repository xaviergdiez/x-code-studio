import { Clock, RefreshCw, FileCheck } from 'lucide-react';
import { type Delivery, deliveryLabel } from '@/lib/pricing';

/**
 * The three things a buyer wants to know before they email, and that
 * the site used to answer on none of its pages: when it lands, how
 * many rounds they get, and what happens if it slips.
 *
 * Deliberately plain. This is the one block on an offering page that
 * should read like a contract clause rather than like marketing,
 * because that is what makes it worth anything: a turnaround stated
 * in a sentence of sales copy is a claim, the same turnaround in a
 * labelled box next to a revision count is a commitment.
 *
 * The overrun line is the part most studios leave out, which is
 * exactly why stating it is worth more than the other two combined.
 * It also costs nothing here: fixed-price delivery already carries
 * the overrun risk by design, so saying so out loud only describes
 * the deal that was always on offer.
 */
export function Commitments({
  delivery,
  className = '',
}: {
  delivery: Delivery;
  className?: string;
}) {
  const items = [
    {
      Icon: Clock,
      label: 'Delivery',
      body: deliveryLabel(delivery),
    },
    {
      Icon: RefreshCw,
      label: 'Revisions',
      body: delivery.revisions,
    },
    {
      Icon: FileCheck,
      label: 'If it runs late',
      body: 'The price does not move. Fixed price means I carry the overrun, not you.',
    },
  ];

  return (
    <dl
      className={`grid gap-4 rounded-card border border-line-strong bg-ink-600 p-6 sm:grid-cols-3 ${className}`}
    >
      {items.map(({ Icon, label, body }) => (
        <div key={label}>
          <dt className="flex items-center gap-2 text-label uppercase tracking-label text-fg-subtle">
            <Icon size={13} aria-hidden="true" />
            {label}
          </dt>
          <dd className="mt-2 text-small text-fg">{body}</dd>
        </div>
      ))}
    </dl>
  );
}
