'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import type { Banner } from '@/components/case/BannerWall';

/**
 * A few real ad units, running, scaled to fit but never cropped.
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
 * discipline. Four makes the same point and costs almost nothing.
 *
 * ── Why these are scaled, after two attempts that were not ───────
 *
 * The first version put all three formats in one row at native size.
 * That came to about 1,390px against a 1,152px column, so the row
 * scrolled everywhere and the leaderboard was cut off at the right.
 *
 * The second swapped the leaderboard for a 300x600 half-page and
 * moved the leaderboard underneath. The row then fitted the column,
 * but a 600px unit plus a leaderboard plus captions is roughly 750px
 * tall, so you still could not see the set at once on a laptop. The
 * point of this section is the whole set in one glance.
 *
 * So the frames are scaled to fit. Each unit still LOADS at its real
 * size, and the whole frame is transformed, so every unit shrinks by
 * the same factor and nothing is cropped or reflowed. The proportions
 * between formats, which is the thing actually worth showing, survive
 * exactly.
 *
 * The captions deliberately sit OUTSIDE the transform. They carry the
 * real pixel dimensions, which is the evidence the scaling would
 * otherwise undermine, and at a 0.7 factor a scaled 12px label would
 * render around 8px and be unreadable.
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

/** Gap between units, in unscaled page pixels. */
const GAP = 20;
/** Height a caption line occupies under each unit, margin included. */
const CAPTION = 26;
/** Gap between the row and the leaderboard below it. */
const ROW_GAP = 16;
/** Share of the viewport height the whole set is allowed to occupy. */
const VIEWPORT_SHARE = 0.62;

/**
 * Three shapes a buyer recognises on sight, no two the same
 * proportion, ordered short to tall so the row has a shape of its
 * own. Four different campaigns across the four units.
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
  scale,
}: {
  unit: Banner;
  baseUrl: string;
  live: boolean;
  scale: number;
}) {
  return (
    <div>
      {/* The box is the SCALED size, so it occupies the right space in
          the layout. The iframe inside keeps its real dimensions and
          is transformed, which is what stops anything being cropped:
          the document still renders at 300x600, it is simply drawn
          smaller.

          The label sits in the box rather than in the iframe, so it
          stays at readable size and survives the origin being slow or
          down. Three empty boxes would read as a broken build; three
          labelled ones read as a missing asset. */}
      <div
        className="relative overflow-hidden rounded-sm border border-line bg-ink-700"
        style={{ width: unit.width * scale, height: unit.height * scale }}
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
            className="absolute left-0 top-0 block border-0"
            style={{
              width: unit.width,
              height: unit.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        )}
      </div>
      {/* Outside the transform on purpose: these are the real numbers. */}
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
  const [scale, setScale] = useState(1);

  /**
   * Fit the set to whichever runs out first, the column's width or a
   * readable share of the viewport's height. Never scale up past 1:
   * these are real sizes, and a 300x250 blown up to 400 wide would be
   * a lie about the format.
   */
  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const availW = el.clientWidth;
    if (!availW) return;

    const sumW = units.reduce((a, u) => a + u.width, 0);
    const gaps = GAP * Math.max(units.length - 1, 0);
    const rowH = Math.max(...units.map((u) => u.height));

    const byRowWidth = (availW - gaps) / sumW;
    const byLeaderWidth = availW / leaderboard.width;
    const budgetH = window.innerHeight * VIEWPORT_SHARE - CAPTION * 2 - ROW_GAP;
    const byHeight = budgetH / (rowH + leaderboard.height);

    const next = Math.min(byRowWidth, byLeaderWidth, byHeight, 1);
    // A floor stops a very short window collapsing the units to specks.
    setScale(Math.max(Math.min(next, 1), 0.28));
  }, [units, leaderboard]);

  // Before paint, so the units never flash at full size and snap down.
  useIsomorphicLayoutEffect(() => {
    fit();
    const ro = new ResizeObserver(fit);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [fit]);

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
      <ul className="flex items-end" style={{ gap: GAP }}>
        {units.map((u) => (
          <li key={`${u.name}-${u.width}x${u.height}`}>
            <Unit unit={u} baseUrl={baseUrl} live={live} scale={scale} />
          </li>
        ))}
      </ul>

      {/* Flush left with the 300x250 above it, which is also how these
          two sit on a real page. */}
      <div style={{ marginTop: ROW_GAP }}>
        <Unit unit={leaderboard} baseUrl={baseUrl} live={live} scale={scale} />
      </div>

      <p className="terminal mt-4 text-label uppercase tracking-label text-fg-subtle">
        Shown at {Math.round(scale * 100)}% to fit. Real sizes labelled.
      </p>
    </div>
  );
}
