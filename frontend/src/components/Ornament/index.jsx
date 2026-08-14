/**
 * Architectural line-art ornaments.
 *
 * The decorative counterpart to the palette: thin drafting-line figures that
 * sit in section corners and margins so no section is a bare rectangle of
 * colour. Every variant is a single-stroke figure on a 100x100 viewBox,
 * drawn in `currentColor` with no fill, so the caller controls hue, size and
 * opacity entirely from CSS:
 *
 *   .cornerPiece { width: clamp(64px, 8vw, 130px); color: var(--accent-sec); opacity: 0.4; }
 *
 * `vectorEffect="non-scaling-stroke"` keeps the line weight at the authored
 * hairline no matter how large the ornament is scaled. Without it a 130px
 * ornament renders a 1.3px line and a 48px one renders 0.48px, so the same
 * figure would look like two different weights across the page.
 *
 * These are decoration and carry no information, so the wrapper is always
 * aria-hidden and focusable={false} - a screen reader announcing "compass
 * rose" between two headings is noise, not context.
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
}

/* A round arch on piers, with the construction circle it was struck from. */
function Arch() {
  return (
    <>
      <path d="M18 96 V50 A32 32 0 0 1 82 50 V96" {...STROKE} />
      <path d="M30 96 V50 A20 20 0 0 1 70 50 V96" {...STROKE} strokeDasharray="3 4" />
      <circle cx="50" cy="50" r="32" {...STROKE} strokeDasharray="2 5" opacity="0.55" />
      <line x1="8" y1="96" x2="92" y2="96" {...STROKE} />
      <line x1="50" y1="18" x2="50" y2="96" {...STROKE} strokeDasharray="2 6" opacity="0.5" />
    </>
  )
}

/* A colonnade in elevation: four columns under an entablature. */
function Colonnade() {
  return (
    <>
      <line x1="6" y1="20" x2="94" y2="20" {...STROKE} />
      <line x1="6" y1="26" x2="94" y2="26" {...STROKE} opacity="0.6" />
      {[18, 39, 61, 82].map((x) => (
        <g key={x}>
          <line x1={x} y1="26" x2={x} y2="88" {...STROKE} />
          <line x1={x - 6} y1="88" x2={x + 6} y2="88" {...STROKE} />
          <line x1={x - 5} y1="26" x2={x + 5} y2="26" {...STROKE} />
        </g>
      ))}
      <line x1="6" y1="94" x2="94" y2="94" {...STROKE} />
    </>
  )
}

/* A floor-plan fragment: two rooms, a wall poche, and a door swing. */
function Plan() {
  return (
    <>
      <rect x="10" y="14" width="80" height="72" {...STROKE} />
      <line x1="52" y1="14" x2="52" y2="52" {...STROKE} />
      <line x1="52" y1="68" x2="52" y2="86" {...STROKE} />
      {/* Door swing off the opening in the party wall. */}
      <path d="M52 68 A16 16 0 0 0 68 52" {...STROKE} strokeDasharray="3 3" />
      <line x1="52" y1="68" x2="68" y2="68" {...STROKE} />
      {/* Window reveals. */}
      <line x1="10" y1="38" x2="10" y2="58" {...STROKE} strokeWidth="3" />
      <line x1="90" y1="30" x2="90" y2="46" {...STROKE} strokeWidth="3" />
      <line x1="24" y1="86" x2="42" y2="86" {...STROKE} strokeWidth="3" />
    </>
  )
}

/* A stepped elevation with a pitched roof and a datum line. */
function Elevation() {
  return (
    <>
      <path d="M8 90 V54 L30 54 V38 L52 22 L74 38 V54 L92 54 V90" {...STROKE} />
      <line x1="4" y1="90" x2="96" y2="90" {...STROKE} />
      <line x1="4" y1="94" x2="96" y2="94" {...STROKE} strokeDasharray="6 4" opacity="0.5" />
      <rect x="38" y="62" width="12" height="28" {...STROKE} opacity="0.75" />
      <rect x="58" y="62" width="10" height="10" {...STROKE} opacity="0.75" />
      <rect x="15" y="62" width="10" height="10" {...STROKE} opacity="0.75" />
    </>
  )
}

/* A north arrow in a bezel - the drawing-sheet compass. */
function Compass() {
  return (
    <>
      <circle cx="50" cy="50" r="38" {...STROKE} />
      <circle cx="50" cy="50" r="30" {...STROKE} strokeDasharray="2 5" opacity="0.6" />
      <path d="M50 14 L62 62 L50 54 L38 62 Z" {...STROKE} />
      <line x1="50" y1="88" x2="50" y2="78" {...STROKE} />
      <line x1="12" y1="50" x2="22" y2="50" {...STROKE} />
      <line x1="88" y1="50" x2="78" y2="50" {...STROKE} />
    </>
  )
}

/* A stair in section, with the going/rise dimension line. */
function Stair() {
  return (
    <>
      <path d="M8 92 H26 V78 H44 V64 H62 V50 H80 V36 H96" {...STROKE} />
      <line x1="8" y1="92" x2="96" y2="36" {...STROKE} strokeDasharray="4 4" opacity="0.55" />
      <line x1="8" y1="96" x2="96" y2="96" {...STROKE} />
      <line x1="4" y1="92" x2="4" y2="36" {...STROKE} strokeDasharray="3 3" opacity="0.5" />
    </>
  )
}

/* A sweeping construction arc with its radius and tangent - the drafting
   gesture, useful where a figurative ornament would be too literal. */
function Arc() {
  return (
    <>
      <path d="M6 94 A88 88 0 0 1 94 6" {...STROKE} />
      <path d="M6 94 A64 64 0 0 1 70 30" {...STROKE} strokeDasharray="3 5" opacity="0.6" />
      <line x1="6" y1="94" x2="94" y2="6" {...STROKE} strokeDasharray="2 6" opacity="0.45" />
      <circle cx="6" cy="94" r="3" {...STROKE} />
    </>
  )
}

const VARIANTS = {
  arch: Arch,
  colonnade: Colonnade,
  plan: Plan,
  elevation: Elevation,
  compass: Compass,
  stair: Stair,
  arc: Arc,
}

export default function Ornament({ variant = 'arch', className }) {
  const Figure = VARIANTS[variant] || Arch

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <Figure />
    </svg>
  )
}

export const ORNAMENT_VARIANTS = Object.keys(VARIANTS)
