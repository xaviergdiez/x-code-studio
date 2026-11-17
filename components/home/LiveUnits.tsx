'use client';

import { useEffect, useRef, useState } from 'react';
import type { Banner } from '@/components/case/BannerWall';

/**
 * A few real ad units, running, at the size they shipped.
 *
 * This is the one claim on the site a competitor cannot copy and a
 * buyer cannot discount: the units are the actual builds, served
 * from where they live, not screenshots of them.
 *
 * ── Why three and not nineteen ───────────────────────────────────
 *
 * `BannerWall` already renders all nineteen BMW and MINI units, and
 * it stays on the case page where it belongs. Putting nineteen
 * cross-origin iframes on the homepage would make the site's most
 * important page its heaviest, on a site whose argument is weight
 * discipline. Three at real size makes the same point and costs
 * almost nothing.
 *
 * ── Two things this does not do ──────────────────────────────────
 *
 * It does not autoplay under reduced motion. These are animated ads
 * with no pause control of their own, and there is no honest way to
 * offer one: the frames are cross-origin, so their timelines cannot
 * be reached from here. Rather than ship a pause button that does
 * nothing, reduced motion gets a labelled still frame instead.
 *
 * It does not load until scrolled near. An iframe per unit is a
 * document per unit, and none of them are needed above the fold.
 */

/**
 * A rectangle, a square and a leaderboard: three shapes a buyer
 * recognises on sight, and no two the same proportion.
 *
 * The 300x600 half-page is the more impressive unit and it is
 * deliberately not here. At real size it makes the row 600px tall
 * and leaves a void above the shorter two, which reads as a layout
 * bug rather than as scale. It is on the case page with the other
 * eighteen, where it has the room.
 */
export const HOME_UNITS: Banner[] = [
  { name: 'F67', width: 300, height: 250, path: 'iframes/F67_300x250/index.html' },
  { name: 'J05', width: 320, height: 320, path: 'iframes/J05_320x320/index.html' },
  { name: 'F70', width: 728, height: 90, path: 'iframes/F70_728x90/index.html' },
];

export function LiveUnits({
  units = HOME_UNITS,
  baseUrl,
}: {
  units?: Banner[];
  baseUrl: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion never goes live, so the still frames stay.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLive(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {/* Horizontal scroll rather than scaling: these are shown at
          the size they shipped, and a 728x90 that has been shrunk to
          fit a phone is no longer evidence of anything.

          Three units at real size come to about 1,390px, which does
          not fit the 1,152px content column at any viewport, so the
          row always scrolls. Without the hint below, the leaderboard
          is simply cut off at the right edge and reads as a broken
          layout rather than as a wide format. */}
      <ul className="flex items-end gap-5 overflow-x-auto pb-4">
        {units.map((u) => (
          <li key={`${u.name}-${u.width}x${u.height}`} className="shrink-0">
            {/* The label sits behind the frame rather than instead
                of it. These units are served from another origin, so
                if that origin is slow or down the iframe renders
                empty, and three empty boxes on the homepage look like
                a broken build rather than a missing asset. This way
                the worst case is a labelled placeholder. */}
            <div
              className="relative overflow-hidden rounded-sm border border-line bg-ink-700"
              style={{ width: u.width, height: u.height }}
            >
              <span
                aria-hidden="true"
                className="terminal absolute inset-0 flex items-center justify-center text-label text-fg-subtle"
              >
                {u.width}×{u.height}
              </span>
              {live && (
                <iframe
                  src={`${baseUrl}/${u.path}`}
                  title={`${u.name}, a ${u.width} by ${u.height} display unit, running`}
                  loading="lazy"
                  scrolling="no"
                  className="relative block h-full w-full border-0"
                />
              )}
            </div>
            <p className="terminal mt-2 text-label text-fg-subtle">
              {u.width}×{u.height}
            </p>
          </li>
        ))}
      </ul>

      <p className="terminal mt-1 text-label uppercase tracking-label text-fg-subtle">
        Scroll for the wider formats →
      </p>
    </div>
  );
}
