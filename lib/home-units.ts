/**
 * The pool of real ad units the homepage deals from.
 *
 * Two hosts, deliberately:
 *
 *  - `portfolio` units are served from whoisxavier.com, which is where
 *    the nineteen BMW and MINI builds already live. Nothing is copied,
 *    so the case page and the homepage cannot drift apart.
 *  - `local` units ship from this repo's `public/ads`. The older work
 *    was never published: those files sit in the portfolio repo under
 *    `intro/whoisxavier_old` but the live host is a plain Apache box
 *    that only ever received a manual upload of `iframes/`, so the
 *    paths 404. Rather than depend on an FTP upload to an ageing host,
 *    the four selected units are served from here, where they deploy
 *    with every push.
 *
 * ── Why a pool and not a fixed set ───────────────────────────────
 *
 * Four units at a time is all that fits at a readable size, but the
 * archive is much deeper than four, and a visitor who returns sees the
 * same four forever. Dealing from a pool shows the range without
 * making the page heavier: still four iframes on screen, whichever
 * four they are.
 *
 * ── Why `group` exists ───────────────────────────────────────────
 *
 * Without it, most deals come out all BMW, because that campaign has
 * the most units. The group is what lets a deal guarantee more than
 * one campaign on screen, which is the entire point of adding the
 * older work.
 *
 * ── What is deliberately not here ────────────────────────────────
 *
 * No client or agency label on any unit. Credit on this site is per
 * client and lives on the case pages, and labelling a mixed set from
 * folder names would be guessing at which are client names and which
 * are campaign names. The variety is visible in the creative itself
 * and does not need asserting in a caption.
 */

export type HomeUnit = {
  /** `local` resolves under this site, `portfolio` under BANNER_ORIGIN. */
  hosted: 'local' | 'portfolio';
  /** Path relative to whichever host. */
  path: string;
  width: number;
  height: number;
  /** Campaign grouping, used to force variety into a deal. */
  group: string;
};

/**
 * Uprights: the row. Nothing wider than it is tall, so three sit side
 * by side in the content column at a readable size.
 */
export const UPRIGHT_POOL: HomeUnit[] = [
  // Older work, served from this repo.
  { hosted: 'local', path: 'ads/gits/300x250/index.html', width: 300, height: 250, group: 'gits' },
  { hosted: 'local', path: 'ads/gits/300x600/index.html', width: 300, height: 600, group: 'gits' },
  { hosted: 'local', path: 'ads/split/300x250/index.html', width: 300, height: 250, group: 'split' },
  { hosted: 'local', path: 'ads/split/320x480/index.html', width: 320, height: 480, group: 'split' },

  // BMW and MINI, served from whoisxavier.com.
  { hosted: 'portfolio', path: 'iframes/F67_300x250/index.html', width: 300, height: 250, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/F70_300x250/index.html', width: 300, height: 250, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/J01_300x250/index.html', width: 300, height: 250, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/J05_320x320/index.html', width: 320, height: 320, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/F67_320x480/index.html', width: 320, height: 480, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/F65_300x600/index.html', width: 300, height: 600, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/F66_300x600/index.html', width: 300, height: 600, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/F70_300x600/index.html', width: 300, height: 600, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/F70_160x600/index.html', width: 160, height: 600, group: 'bmw-mini' },
];

/**
 * Wides: the one underneath, flush left with the row.
 *
 * All BMW and MINI, because the older selection has no wide formats.
 * That is a fact about the archive rather than a choice.
 */
export const WIDE_POOL: HomeUnit[] = [
  { hosted: 'portfolio', path: 'iframes/F70_728x90/index.html', width: 728, height: 90, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/J05_728x90/index.html', width: 728, height: 90, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/F66_800x250/index.html', width: 800, height: 250, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/F67_970x250/index.html', width: 970, height: 250, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/F70_970x250/index.html', width: 970, height: 250, group: 'bmw-mini' },
  { hosted: 'portfolio', path: 'iframes/J01_970x250/index.html', width: 970, height: 250, group: 'bmw-mini' },
];

/**
 * The opening hand, fixed rather than random.
 *
 * The server and the first client render have to agree or React
 * throws a hydration mismatch, so the shuffle only ever runs from a
 * click. This hand is also chosen rather than arbitrary: three
 * campaigns, three different proportions, ascending in height.
 */
export const OPENING_ROW: HomeUnit[] = [
  UPRIGHT_POOL[0], // gits 300x250
  UPRIGHT_POOL[3], // split 320x480
  UPRIGHT_POOL[10], // F66 300x600
];
export const OPENING_WIDE: HomeUnit = WIDE_POOL[0]; // F70 728x90

/** Absolute src for a unit, given where the portfolio units live. */
export function unitSrc(unit: HomeUnit, baseUrl: string): string {
  return unit.hosted === 'local' ? `/${unit.path}` : `${baseUrl}/${unit.path}`;
}

/**
 * Deal three uprights and a wide.
 *
 * The row is guaranteed at least two campaigns and no repeated unit,
 * then sorted short to tall so the row keeps its staircase shape
 * whatever comes out.
 */
export function deal(
  uprights: HomeUnit[] = UPRIGHT_POOL,
  wides: HomeUnit[] = WIDE_POOL,
  random: () => number = Math.random,
): { row: HomeUnit[]; wide: HomeUnit } {
  const pick = <T,>(xs: T[]) => xs[Math.floor(random() * xs.length)];

  const shuffled = [...uprights];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const row = shuffled.slice(0, 3);
  // If the draw came out single-campaign, swap the last one for a unit
  // from a different group. With a pool this BMW-heavy that happens
  // often, and an all-BMW deal defeats the reason the pool exists.
  if (new Set(row.map((u) => u.group)).size === 1) {
    const other = shuffled.find((u) => u.group !== row[0].group);
    if (other) row[2] = other;
  }

  row.sort((a, b) => a.height - b.height);
  return { row, wide: pick(wides) };
}
