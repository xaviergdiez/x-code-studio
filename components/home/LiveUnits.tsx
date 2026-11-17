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
 * ── Why four and not nineteen ────────────────────────────────────
 *
 * `BannerWall` already renders all nineteen BMW and MINI units, and
 * it stays on the case page where it belongs. Putting nineteen
 * cross-origin iframes on the homepage would make the site's most
 * important page its heaviest, on a site whose argument is weight
 * discipline. Four at real size makes the same point and costs
 * almost nothing.
 *
 * ── The layout, and why it changed ───────────────────────────────
 *
 * The first version put the 728x90 leaderboard in the single row
 * alongside the rectangle and the square. That came to about 1,390px
 * against a 1,152px column, so the row scrolled at every viewport
 * and the leaderboard was cut off at the right edge on a desktop
 * screen, which reads as a broken layout rather than a wide format.
 *
 * Now the top row is the three portrait-ish formats in ascending
 * height (250, 320, 600), bottom-aligned so they sit on a shared
 * baseline and the half-page's extra height reads as scale rather
 * than as a gap. That comes to 960px including gaps and fits the
 * column outright.
 *
 * The leaderboard moves underneath, flush with the left edge of the
 * 300x250 above it. That is also how these two actually appear on a
 * real page, so the arrangement is doing double duty.
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
 * Three shapes a buyer recognises on sight, no two the same
 * proportion, ordered short to tall so the row has a shape of its
 * own. Four different campaigns across the four units, which is the
 * breadth claim rather than the depth one.
 */
export const HOME_UNITS: Banner[] = [
  { name: 'F67', width: 300, height: 250, path: 'iframes/F67_300x250/index.html' },
  { name: 'J05', width: 320, height: 320, path: 'iframes/J05_320x320/index.html' },
  { name: 'F66', width: 300, height: 600, path: 'iframes/F66_300x600/index.html' },
];

/** Sits under the row, flush left with the 300x250. */
export const HOME_LEADERBOARD: Banner = {
  name: 'F70',
  width: 728,
  height: 90,
  path: 'iframes/F70_728x90/index.html',
};

function Unit({
  unit,
  baseUrl,
  live,
}: {
  unit: Banner;
  baseUrl: string;
  live: boolean;
}) {
  return (
    <div className="shrink-0">
      {/* The label sits behind the frame rather than instead of it.
          These units are served from another origin, so if that
          origin is slow or down the iframe renders empty, and empty
          boxes on the homepage look like a broken build rather than
          a missing asset. This way the worst case is a labelled
          placeholder. */}
      <div
        className="relative overflow-hidden rounded-sm border border-line bg-ink-700"
        style={{ width: unit.width, height: unit.height }}
      >
        <span
          aria-hidden="true"
          className="terminal absolute inset-0 flex items-center justify-center text-label text-fg-subtle"
        >
          {unit.width}×{unit.height}
        </span>
        {live && (
          <iframe
            src={`${baseUrl}/${unit.path}`}
            title={`${unit.name}, a ${unit.width} by ${unit.height} display unit, running`}
            loading="lazy"
            scrolling="no"
            className="relative block h-full w-full border-0"
          />
        )}
      </div>
      <p className="terminal mt-2 text-label text-fg-subtle">
        {unit.width}×{unit.height}
      </p>
    </div>
  );
}

export function LiveUnits({
  units = HOME_UNITS,
  leaderboard = HOME_LEADERBOARD,
  baseUrl,
}: {
  units?: Banner[];
  leaderboard?: Banner;
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
          the size they shipped, and a 728x90 shrunk to fit a phone
          is no longer evidence of anything. The row fits the column
          on a desktop screen and only scrolls on narrow ones, which
          is what the hint below is gated on. */}
      <ul className="flex items-end gap-5 overflow-x-auto pb-2">
        {units.map((u) => (
          <li key={`${u.name}-${u.width}x${u.height}`}>
            <Unit unit={u} baseUrl={baseUrl} live={live} />
          </li>
        ))}
      </ul>

      {/* Flush left with the 300x250 above it, in its own scroll
          context so a 728 that overflows a phone does not drag the
          taller row sideways with it. */}
      <div className="mt-4 overflow-x-auto pb-4">
        <Unit unit={leaderboard} baseUrl={baseUrl} live={live} />
      </div>

      <p className="terminal mt-1 text-label uppercase tracking-label text-fg-subtle lg:hidden">
        Scroll a row sideways to see a format in full →
      </p>
    </div>
  );
}
