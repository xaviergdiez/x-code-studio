'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import {
  type HomeUnit,
  UPRIGHT_POOL,
  WIDE_POOL,
  OPENING_ROW,
  OPENING_WIDE,
  deal,
  unitSrc,
} from '@/lib/home-units';

/**
 * Real ad units, running, scaled to fit but never cropped.
 *
 * This is the one claim on the site a competitor cannot copy and a
 * buyer cannot discount: the units are the actual builds, served from
 * where they live, not screenshots of them.
 *
 * ── Four on screen, dealt from a deeper pool ─────────────────────
 *
 * Four at a readable size is all the room there is, but the archive is
 * much deeper, and a visitor who returns would otherwise see the same
 * four forever. The set is dealt from `lib/home-units`, which also
 * guarantees more than one campaign per deal. Weight does not change:
 * four iframes either way.
 *
 * ── Why these are scaled, after two attempts that were not ───────
 *
 * The first version put every format in one row at native size: about
 * 1,390px against a 1,152px column, so it scrolled everywhere and the
 * leaderboard was cut off at the right.
 *
 * The second moved the leaderboard underneath. The row then fitted,
 * but a 600px unit plus a leaderboard plus captions is roughly 750px
 * tall, so the set still could not be taken in at once on a laptop.
 *
 * So the frames are scaled to fit. Each unit still LOADS at its real
 * size and the whole frame is transformed, so every unit shrinks by
 * one shared factor and nothing is cropped or reflowed. The
 * proportions between formats, which is the thing worth showing,
 * survive exactly.
 *
 * Captions sit OUTSIDE the transform on purpose. They carry the real
 * pixel dimensions, which is the evidence the scaling would otherwise
 * undermine, and at 0.7 a scaled 12px label renders around 8px.
 *
 * ── Two things this does not do ──────────────────────────────────
 *
 * It does not autoplay under reduced motion. These are animated ads
 * with no pause control of their own, and there is no honest way to
 * offer one: the frames are cross-origin, so their timelines cannot be
 * reached from here. Reduced motion gets a labelled still frame.
 *
 * It does not load until scrolled near. An iframe per unit is a
 * document per unit, and none of them are needed above the fold.
 */

/** Gap between units, in unscaled page pixels. */
const GAP = 20;
/** Height a caption line occupies under each unit, margin included. */
const CAPTION = 26;
/** Gap between the row and the wide unit below it. */
const ROW_GAP = 16;
/** The site header is sticky, so it covers this much of the viewport. */
const HEADER = 72;
/**
 * Share of the remaining viewport the set may occupy.
 *
 * This was 0.62, chosen so the heading, the lede and the units were on
 * screen together. That is a stricter requirement than the one that
 * matters, and it cost a third of the size: on a 789px window it came
 * out at 61%, too small to read, with a quarter of the column empty
 * beside it. What has to be true is that the four units are visible at
 * once; the heading may scroll away.
 */
const VIEWPORT_SHARE = 0.95;

function Unit({
  unit,
  baseUrl,
  live,
  scale,
}: {
  unit: HomeUnit;
  baseUrl: string;
  live: boolean;
  scale: number;
}) {
  const src = unitSrc(unit, baseUrl);
  return (
    <div>
      {/* The box is the SCALED size, so it takes the right space in the
          layout. The iframe inside keeps its real dimensions and is
          transformed, which is what stops anything being cropped: the
          document still renders at 300x600, it is just drawn smaller.

          The label sits in the box rather than in the iframe, so it
          stays readable and survives a host being slow or down. Empty
          boxes read as a broken build; labelled ones read as a missing
          asset. */}
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
            key={src}
            src={src}
            title={`A ${unit.width} by ${unit.height} display unit, running`}
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

export function LiveUnits({ baseUrl }: { baseUrl: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [scale, setScale] = useState(1);
  // Fixed opening hand: the server and first client render must agree,
  // so the shuffle only ever runs from a click.
  const [row, setRow] = useState<HomeUnit[]>(OPENING_ROW);
  const [wide, setWide] = useState<HomeUnit>(OPENING_WIDE);

  const reshuffle = useCallback(() => {
    const next = deal(UPRIGHT_POOL, WIDE_POOL);
    setRow(next.row);
    setWide(next.wide);
  }, []);

  /**
   * Fit the set to whichever runs out first, the column's width or the
   * viewport's height. Never scale up past 1: these are real sizes,
   * and a 300x250 blown up would misstate the format.
   */
  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const availW = el.clientWidth;
    if (!availW) return;

    const sumW = row.reduce((a, u) => a + u.width, 0);
    const gaps = GAP * Math.max(row.length - 1, 0);
    const rowH = Math.max(...row.map((u) => u.height));

    const byRowWidth = (availW - gaps) / sumW;
    const byWideWidth = availW / wide.width;
    const budgetH =
      (window.innerHeight - HEADER) * VIEWPORT_SHARE - CAPTION * 2 - ROW_GAP;
    const byHeight = budgetH / (rowH + wide.height);

    const next = Math.min(byRowWidth, byWideWidth, byHeight, 1);
    // A floor stops a very short window collapsing the units to specks.
    setScale(Math.max(Math.min(next, 1), 0.28));
  }, [row, wide]);

  // Before paint, so the units never flash at full size and snap down.
  // Re-runs on every deal, since a new set has new proportions.
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
        {row.map((u) => (
          <li key={unitSrc(u, baseUrl)}>
            <Unit unit={u} baseUrl={baseUrl} live={live} scale={scale} />
          </li>
        ))}
      </ul>

      {/* Flush left with the first unit above it, which is also how
          these two sit on a real page. */}
      <div style={{ marginTop: ROW_GAP }}>
        <Unit unit={wide} baseUrl={baseUrl} live={live} scale={scale} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button variant="secondary" size="md" onClick={reshuffle}>
          <RefreshCw size={14} aria-hidden="true" />
          Deal another four
        </Button>
        {/* Only a disclosure when there is something to disclose. At a
            full 1 the units are at their real size, and saying "shown
            at 100%" invites the reader to look for a catch. */}
        {scale < 1 && (
          <p className="terminal text-label uppercase tracking-label text-fg-subtle">
            Shown at {Math.round(scale * 100)}% to fit. Real sizes labelled.
          </p>
        )}
      </div>

      {/* The set changes without a page load, so a screen reader is
          told what happened rather than left behind. */}
      <p aria-live="polite" className="sr-only">
        Showing {row.length + 1} units: {row.map((u) => `${u.width} by ${u.height}`).join(', ')} and{' '}
        {wide.width} by {wide.height}.
      </p>
    </div>
  );
}
