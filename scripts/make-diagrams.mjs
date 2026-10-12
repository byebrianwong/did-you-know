#!/usr/bin/env node
// Draws the diagrams in public/images/ as SVG files and adds them to their facts.
//
// Usage: node scripts/make-diagrams.mjs
//
// Every shape is computed from a number, so the pictures are to scale and can be
// checked against the fact text. Numbers that are not in the fact text are listed
// with their source next to them. Running the script again redraws every diagram
// and updates its entry in place.

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { addToFact, root } from './add-to-fact.mjs'

const SOURCE = 'https://github.com/byebrianwong/did-you-know/blob/main/scripts/make-diagrams.mjs'

const INK = '#221d18'
const MUTED = '#6f655a'
const LINE = '#d9cfc1'
const SOFT = '#f4ede3'
const ACCENT = '#e8553d'
const BLUE = '#3a78c2'
const TAN = '#c08a5b'
const FONT = "-apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

// Grid cells in the app are 4:3, so most diagrams use 400 x 300.
const W = 400
const H = 300

const r1 = (n) => Math.round(n * 10) / 10

function svg(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" font-family="${FONT}">
<rect width="${width}" height="${height}" fill="#fff"/>
${body}
</svg>
`
}

function text(x, y, content, { size = 24, fill = INK, anchor = 'start', weight = 400 } = {}) {
  return `<text x="${r1(x)}" y="${r1(y)}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${content}</text>`
}

function arrowHead(x, y, dir, size = 12, fill = INK) {
  // dir: 'down' or 'right'
  const pts =
    dir === 'down'
      ? [[x - size * 0.7, y - size], [x + size * 0.7, y - size], [x, y]]
      : [[x - size, y - size * 0.7], [x - size, y + size * 0.7], [x, y]]
  return `<polygon points="${pts.map((p) => p.map(r1).join(',')).join(' ')}" fill="${fill}"/>`
}

const diagrams = []

// ---------------------------------------------------------------------------
// Accuracy vs. precision: four targets. Dot positions are fixed, not random.

function target(dots) {
  const cx = W / 2
  const cy = H / 2
  const rings = [135, 100, 65, 30]
    .map((r, i) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${i === 3 ? ACCENT : i % 2 ? '#fff' : SOFT}" stroke="${LINE}" stroke-width="2"/>`)
    .join('\n')
  const marks = dots
    .map(([dx, dy]) => `<circle cx="${cx + dx}" cy="${cy + dy}" r="12" fill="${INK}" stroke="#fff" stroke-width="3"/>`)
    .join('\n')
  return svg(W, H, `${rings}\n${marks}`)
}

const tight = [[-12, -8], [11, -12], [-4, 13], [14, 7], [-15, 5]]
const shift = (pts, x, y) => pts.map(([a, b]) => [a + x, b + y])

diagrams.push(
  {
    factId: 'accuracy-precision',
    slug: 'accurate-and-precise',
    svg: target(tight),
    label: 'Accurate and precise',
    note: 'Close together, on the bullseye',
    alt: 'A target with five darts grouped tightly on the bullseye',
  },
  {
    factId: 'accuracy-precision',
    slug: 'precise-not-accurate',
    svg: target(shift(tight, 62, -58)),
    label: 'Precise, not accurate',
    note: 'Like a scale that always reads 2 kg heavy',
    alt: 'A target with five darts grouped tightly together, but up and to the right of the bullseye',
  },
  {
    factId: 'accuracy-precision',
    slug: 'accurate-not-precise',
    // These five average out exactly to the centre.
    svg: target([[-80, -30], [75, -45], [-40, 75], [70, 50], [-25, -50]]),
    label: 'Accurate, not precise',
    note: 'Scattered, but centred on the bullseye',
    alt: 'A target with five darts scattered all around, spread evenly around the bullseye',
  },
  {
    factId: 'accuracy-precision',
    slug: 'neither',
    svg: target([[-5, -95], [100, -60], [30, 45], [95, 15], [45, -100]]),
    label: 'Neither',
    note: 'Scattered and off to one side',
    alt: 'A target with five darts scattered over the upper right, away from the bullseye',
  },
)

// ---------------------------------------------------------------------------
// AC vs. DC: current over time. The AC window is 1/20 of a second at 60 Hz,
// which is exactly 3 full cycles.

function currentAxes(endLabel) {
  const x0 = 56
  const x1 = 380
  return [
    `<line x1="${x0}" y1="30" x2="${x0}" y2="262" stroke="${MUTED}" stroke-width="2"/>`,
    `<line x1="${x0}" y1="150" x2="${x1}" y2="150" stroke="${MUTED}" stroke-width="2"/>`,
    arrowHead(x1 + 10, 150, 'right', 12, MUTED),
    text(x0 - 14, 64, '+', { size: 30, anchor: 'end', fill: MUTED }),
    text(x0 - 14, 160, '0', { size: 24, anchor: 'end', fill: MUTED }),
    text(x0 - 14, 252, '−', { size: 30, anchor: 'end', fill: MUTED }),
    text(x1 + 10, 290, endLabel, { size: 22, anchor: 'end', fill: MUTED }),
    text(x0 - 30, 290, 'current over time', { size: 22, fill: MUTED }),
  ].join('\n')
}

const AMP = 90
diagrams.push({
  factId: 'ac-dc',
  slug: 'dc',
  svg: svg(W, H, `${currentAxes('time →')}\n<line x1="56" y1="${150 - AMP * 0.75}" x2="380" y2="${150 - AMP * 0.75}" stroke="${ACCENT}" stroke-width="6" stroke-linecap="round"/>`),
  label: 'DC (direct current)',
  note: 'Steady, always the same direction',
  alt: 'Graph of current over time: a flat line above zero, so the current never changes direction',
})

{
  const pts = []
  for (let i = 0; i <= 300; i++) {
    const t = i / 300 // fraction of 1/20 second
    pts.push([56 + t * 324, 150 - AMP * Math.sin(2 * Math.PI * 3 * t)])
  }
  const path = `<polyline points="${pts.map((p) => p.map(r1).join(',')).join(' ')}" fill="none" stroke="${ACCENT}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`
  diagrams.push({
    factId: 'ac-dc',
    slug: 'ac',
    svg: svg(W, H, `${currentAxes('1/20 second →')}\n${path}`),
    label: 'AC (alternating current)',
    note: 'At 60 Hz: 3 full cycles in 1/20 of a second',
    alt: 'Graph of current over 1/20 of a second: a wave that swings above and below zero three times, so the current keeps reversing',
  })
}

// ---------------------------------------------------------------------------
// Ton vs. tonne: bars to scale, starting from zero.
// 1 short ton = 2,000 lb = 907.18474 kg. 1 long ton = 2,240 lb = 1,016.0469 kg.
// 1 tonne = 1,000 kg = 2,204.62 lb. (Exact definitions; 1 lb = 0.45359237 kg.)

{
  const width = 570
  const height = 340
  const x0 = 20
  const scale = 0.52 // px per kg
  const tons = [
    { name: 'Short ton (US)', lb: '2,000 lb', kg: 907.18474 },
    { name: 'Tonne (metric)', lb: '2,205 lb', kg: 1000 },
    { name: 'Long ton (UK)', lb: '2,240 lb', kg: 1016.0469 },
  ]
  const fmtKg = (kg) => `${Math.round(kg).toLocaleString('en-US')} kg`
  const parts = []
  const tonneX = x0 + 1000 * scale
  parts.push(`<line x1="${r1(tonneX)}" y1="18" x2="${r1(tonneX)}" y2="326" stroke="${MUTED}" stroke-width="2" stroke-dasharray="6 6"/>`)
  tons.forEach((t, i) => {
    const y = 30 + i * 104
    parts.push(text(x0, y + 22, `<tspan font-weight="600">${t.name}</tspan>  ${t.lb} · ${fmtKg(t.kg)}`, { size: 26 }))
    parts.push(`<rect x="${x0}" y="${y + 34}" width="${r1(t.kg * scale)}" height="44" rx="6" fill="${t.kg === 1000 ? ACCENT : TAN}"/>`)
  })
  diagrams.push({
    factId: 'ton-tonne',
    slug: 'three-tons',
    width,
    height,
    wide: true,
    svg: svg(width, height, parts.join('\n')),
    label: 'The three tons, to scale',
    note: 'Bars start at zero; dashed line is 1,000 kg',
    alt: 'Three bars drawn to scale: short ton 2,000 lb or 907 kg, tonne 2,205 lb or 1,000 kg, long ton 2,240 lb or 1,016 kg. The tonne and long ton are almost the same length; the short ton is about 10% shorter.',
  })
}

// ---------------------------------------------------------------------------
// Weight vs. mass: the same 60 kg box on Earth and on the Moon.
// Gravity: Earth 9.81 m/s² (standard gravity 9.80665), Moon 1.62 m/s² (NASA
// lunar fact sheet, 1.622). Weight = mass × gravity: 60 × 9.81 = 589 N and
// 60 × 1.62 = 97 N.
// Both arrows use the same scale, so their lengths compare directly.

function weightPanel(place, g) {
  const mass = 60
  const newtons = mass * g
  const pxPerN = 0.23
  const len = newtons * pxPerN
  const cx = 130
  const top = 24
  const boxH = 84
  const y0 = top + boxH
  const y1 = y0 + len
  return svg(
    W,
    H,
    [
      `<rect x="${cx - 60}" y="${top}" width="120" height="${boxH}" rx="8" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>`,
      text(cx, top + 54, `${mass} kg`, { size: 28, anchor: 'middle', weight: 600 }),
      `<line x1="${cx}" y1="${y0}" x2="${cx}" y2="${r1(y1 - 12)}" stroke="${ACCENT}" stroke-width="7"/>`,
      arrowHead(cx, y1 + 4, 'down', 16, ACCENT),
      text(cx + 30, Math.max(y0 + 34, (y0 + y1) / 2 + 8), `weight ${Math.round(newtons)} N`, { size: 24, fill: ACCENT, weight: 600 }),
      text(20, 288, `${place} gravity: ${g} m/s²`, { size: 22, fill: MUTED }),
    ].join('\n'),
  )
}

diagrams.push(
  {
    factId: 'weight-mass',
    slug: 'earth',
    svg: weightPanel('Earth', 9.81),
    label: 'On Earth',
    note: 'Mass 60 kg, weight 589 newtons',
    alt: 'A box labelled 60 kg with a long arrow pointing down labelled weight 589 N. Earth gravity is 9.81 metres per second squared.',
  },
  {
    factId: 'weight-mass',
    slug: 'moon',
    svg: weightPanel('Moon', 1.62),
    label: 'On the Moon',
    note: 'Same mass, about one-sixth the weight',
    alt: 'The same 60 kg box with a short arrow pointing down labelled weight 97 N, about one-sixth as long as on Earth. Moon gravity is 1.62 metres per second squared.',
  },
)

// ---------------------------------------------------------------------------
// Earthquake magnitude vs. intensity.
// Energy grows by 10^1.5 ≈ 31.6 per whole magnitude step, so squares with area
// proportional to energy have sides in the ratio 1 : 5.62 : 31.6.

{
  const big = 200
  const base = 222
  const centers = [50, 128, 280]
  const multipliers = ['1×', '≈32×', '≈1,000×']
  const parts = []
  ;[5, 6, 7].forEach((m, i) => {
    const side = big / 10 ** (1.5 * (7 - m))
    const cx = centers[i]
    parts.push(`<rect x="${r1(cx - side / 2)}" y="${r1(base - side)}" width="${r1(side)}" height="${r1(side)}" fill="${ACCENT}"/>`)
    parts.push(text(cx, base + 32, `M${m}`, { size: 24, anchor: 'middle', weight: 600 }))
    parts.push(text(cx, base + 62, multipliers[i], { size: 22, anchor: 'middle', fill: MUTED }))
  })
  diagrams.push({
    factId: 'earthquake-magnitude-intensity',
    slug: 'magnitude-energy',
    svg: svg(W, H, parts.join('\n')),
    label: 'Magnitude: one number per quake',
    note: 'Square area shows energy: ≈32× per step',
    alt: 'Three squares whose areas show energy released: magnitude 5 is a tiny dot, magnitude 6 is about 32 times larger, magnitude 7 is about 1,000 times larger than magnitude 5.',
  })
}

{
  // A made-up example, labelled as such: intensity usually drops with distance.
  const ex = 52
  const ey = 150
  const towns = [
    { x: 140, y: 112, i: 'VIII' },
    { x: 238, y: 186, i: 'VI' },
    { x: 340, y: 120, i: 'IV' },
  ]
  const parts = []
  for (const r of [70, 150, 230, 310]) {
    parts.push(`<circle cx="${ex}" cy="${ey}" r="${r}" fill="none" stroke="${LINE}" stroke-width="2" stroke-dasharray="5 7"/>`)
  }
  const star = Array.from({ length: 10 }, (_, k) => {
    const a = (Math.PI / 5) * k - Math.PI / 2
    const rr = k % 2 ? 9 : 22
    return `${r1(ex + rr * Math.cos(a))},${r1(ey + rr * Math.sin(a))}`
  }).join(' ')
  parts.push(`<polygon points="${star}" fill="${ACCENT}"/>`)
  parts.push(text(ex, ey + 50, 'quake', { size: 20, anchor: 'middle', fill: MUTED }))
  for (const t of towns) {
    parts.push(`<circle cx="${t.x}" cy="${t.y}" r="30" fill="#fff" stroke="${INK}" stroke-width="3"/>`)
    parts.push(text(t.x, t.y + 9, t.i, { size: 24, anchor: 'middle', weight: 700 }))
  }
  parts.push(text(20, 292, 'example, not a real quake', { size: 20, fill: MUTED }))
  diagrams.push({
    factId: 'earthquake-magnitude-intensity',
    slug: 'intensity-example',
    svg: svg(W, H, parts.join('\n')),
    label: 'Intensity: one reading per place',
    note: 'Shaking usually weakens farther away',
    alt: 'An example map: a star marks an earthquake, and three towns at increasing distance show Modified Mercalli intensities VIII, VI and IV.',
  })
}

// ---------------------------------------------------------------------------
// Endemic vs. epidemic vs. pandemic: example case counts over time.
// These are shapes, not real data.

function casesChart(lines) {
  const x0 = 40
  const x1 = 384
  const expected = 196
  const parts = [
    `<line x1="${x0}" y1="24" x2="${x0}" y2="250" stroke="${MUTED}" stroke-width="2"/>`,
    `<line x1="${x0}" y1="250" x2="${x1}" y2="250" stroke="${MUTED}" stroke-width="2"/>`,
    `<line x1="${x0}" y1="${expected}" x2="${x1}" y2="${expected}" stroke="${MUTED}" stroke-width="2" stroke-dasharray="7 7"/>`,
    text(x1, expected + 30, 'expected level', { size: 20, anchor: 'end', fill: MUTED }),
    text(x0, 286, 'cases over time', { size: 22, fill: MUTED }),
  ]
  for (const { fn, color } of lines) {
    const pts = []
    for (let i = 0; i <= 200; i++) {
      const t = i / 200
      pts.push([x0 + t * (x1 - x0), expected - fn(t)])
    }
    parts.push(`<polyline points="${pts.map((p) => p.map(r1).join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`)
  }
  return svg(W, H, parts.join('\n'))
}

const bump = (t, at, height, width) => height * Math.exp(-(((t - at) / width) ** 2))

diagrams.push(
  {
    factId: 'endemic-epidemic-pandemic',
    slug: 'endemic',
    svg: casesChart([{ fn: (t) => 6 * Math.sin(2 * Math.PI * 3 * t), color: ACCENT }]),
    label: 'Endemic',
    note: 'Always there, at the expected level',
    alt: 'Example chart: cases stay close to a dashed expected level the whole time, rising and falling only slightly',
  },
  {
    factId: 'endemic-epidemic-pandemic',
    slug: 'epidemic',
    svg: casesChart([{ fn: (t) => bump(t, 0.5, 150, 0.12), color: ACCENT }]),
    label: 'Epidemic',
    note: 'Cases jump above the expected level',
    alt: 'Example chart: cases sit at the expected level, then rise sharply far above it and fall back',
  },
  {
    factId: 'endemic-epidemic-pandemic',
    slug: 'pandemic',
    svg: casesChart([
      { fn: (t) => bump(t, 0.36, 120, 0.11), color: TAN },
      { fn: (t) => bump(t, 0.52, 160, 0.12), color: ACCENT },
      { fn: (t) => bump(t, 0.68, 105, 0.11), color: BLUE },
    ]),
    label: 'Pandemic',
    note: 'Epidemics in many countries; each line is one',
    alt: 'Example chart: three lines, one per country, each rising far above the expected level one after another',
  },
)

// ---------------------------------------------------------------------------
// Planet vs. dwarf planet: sizes to scale, in km (English Wikipedia infoboxes,
// checked 2026-10-12): Earth 12,742 (mean), Mercury 4,879 (mean), Pluto 2,377,
// Eris 2,326, Haumea 2,122 x 1,036 (longest and shortest axes; it is
// egg-shaped), Makemake about 1,430, Ceres 939 (mean).

{
  const bodies = [
    { name: 'Earth', w: 12742, h: 12742, color: BLUE },
    { name: 'Mercury', w: 4879, h: 4879, color: BLUE },
    { name: 'Pluto', w: 2377, h: 2377, color: TAN },
    { name: 'Eris', w: 2326, h: 2326, color: TAN },
    { name: 'Haumea', w: 2122, h: 1036, color: TAN },
    { name: 'Makemake', w: 1430, h: 1430, color: TAN },
    { name: 'Ceres', w: 939, h: 939, color: TAN },
  ]
  const k = 0.019 // px per km
  const size = 26
  const gap = 22
  const labelW = (s) => s.length * size * 0.56
  let x = 20
  const cy = 130
  const parts = []
  for (const b of bodies) {
    const slot = Math.max(b.w * k, labelW(b.name))
    const cx = x + slot / 2
    parts.push(`<ellipse cx="${r1(cx)}" cy="${cy}" rx="${r1((b.w * k) / 2)}" ry="${r1((b.h * k) / 2)}" fill="${b.color}"/>`)
    parts.push(text(cx, 286, b.name, { size, anchor: 'middle', weight: b.color === BLUE ? 600 : 400 }))
    x += slot + gap
  }
  const width = Math.ceil(x - gap + 20)
  diagrams.push({
    factId: 'planet-dwarf-planet',
    slug: 'sizes-to-scale',
    width,
    height: 310,
    wide: true,
    svg: svg(width, 310, parts.join('\n')),
    label: 'Sizes to scale',
    note: 'Blue: planets. Tan: the five dwarf planets.',
    alt: 'Earth, Mercury and the five dwarf planets drawn to scale. Earth is by far the largest. Mercury, the smallest planet, is about twice as wide as Pluto. Pluto and Eris are nearly the same size, Haumea is egg-shaped, and Ceres is the smallest.',
  })
}

// ---------------------------------------------------------------------------
// Relative humidity vs. dew point: the National Weather Service example from the
// fact text. 50 °F air with a 50 °F dew point is 100% humidity. 90 °F air with a
// 69 °F dew point is 50%. (Checked with the Magnus formula: 50.2%.)
// Both panels use the same °F scale, so the gaps compare directly.

function humidityPanel(air, dew, rh) {
  const lo = 40
  const hi = 100
  const yTop = 30
  const yBot = 240
  const y = (f) => yBot - ((f - lo) / (hi - lo)) * (yBot - yTop)
  const x0 = 70
  const cx = 160
  const parts = [`<line x1="${x0}" y1="${yTop}" x2="${x0}" y2="${yBot}" stroke="${MUTED}" stroke-width="2"/>`]
  for (const f of [40, 60, 80, 100]) {
    parts.push(`<line x1="${x0 - 8}" y1="${r1(y(f))}" x2="${x0}" y2="${r1(y(f))}" stroke="${MUTED}" stroke-width="2"/>`)
    parts.push(text(x0 - 14, y(f) + 8, `${f}°`, { size: 22, anchor: 'end', fill: MUTED }))
  }
  if (air !== dew) {
    parts.push(`<rect x="${cx - 18}" y="${r1(y(air))}" width="36" height="${r1(y(dew) - y(air))}" fill="${SOFT}"/>`)
    parts.push(`<circle cx="${cx}" cy="${r1(y(air))}" r="14" fill="${ACCENT}"/>`)
    parts.push(`<circle cx="${cx}" cy="${r1(y(dew))}" r="14" fill="${BLUE}"/>`)
    parts.push(text(cx + 28, y(air) + 8, `air ${air} °F`, { size: 24, fill: ACCENT, weight: 600 }))
    parts.push(text(cx + 28, y(dew) + 8, `dew point ${dew} °F`, { size: 24, fill: BLUE, weight: 600 }))
  } else {
    parts.push(`<circle cx="${cx}" cy="${r1(y(air))}" r="14" fill="${ACCENT}"/>`)
    parts.push(`<circle cx="${cx}" cy="${r1(y(dew))}" r="9" fill="${BLUE}"/>`)
    parts.push(text(cx + 28, y(air) - 6, `air ${air} °F`, { size: 24, fill: ACCENT, weight: 600 }))
    parts.push(text(cx + 28, y(dew) + 22, `dew point ${dew} °F`, { size: 24, fill: BLUE, weight: 600 }))
  }
  parts.push(text(20, 288, `relative humidity ${rh}%`, { size: 24, weight: 600 }))
  return svg(W, H, parts.join('\n'))
}

diagrams.push(
  {
    factId: 'humidity-dew-point',
    slug: 'cool-day',
    svg: humidityPanel(50, 50, 100),
    label: '50 °F day: 100% humidity',
    note: 'Dew point 50 °F, so the air is full',
    alt: 'A temperature scale with the air temperature and the dew point both at 50 degrees Fahrenheit. Relative humidity is 100%.',
  },
  {
    factId: 'humidity-dew-point',
    slug: 'hot-day',
    svg: humidityPanel(90, 69, 50),
    label: '90 °F day: 50% humidity',
    note: 'Higher dew point, so it feels muggier',
    alt: 'The same temperature scale with the air at 90 degrees Fahrenheit and the dew point at 69. Relative humidity is only 50%, but the dew point is 19 degrees higher than on the 50-degree day.',
  },
)

// ---------------------------------------------------------------------------
// Felony vs. misdemeanor: the line is the longest sentence the law allows.
// Federal classes from 18 U.S.C. § 3559(a): Class E more than 1 year and less
// than 5; Class D 5 to less than 10; Class C 10 to less than 25; Class B 25 or
// more; Class A life or death. Misdemeanors are 1 year or less. The axis is
// linear and stops at 12 years; the arrow means the felony classes go on.

{
  const width = 570
  const height = 300
  const x0 = 24
  const px = 42 // px per year
  const x = (yr) => x0 + yr * px
  const parts = []
  // Misdemeanor row.
  parts.push(`<rect x="${x0}" y="40" width="${px}" height="44" rx="4" fill="${TAN}"/>`)
  parts.push(text(x(1) + 14, 71, '<tspan font-weight="600">Misdemeanor</tspan>  1 year or less', { size: 24 }))
  // Felony row, split into the federal classes.
  const y2 = 136
  const classes = [
    { from: 1, to: 5, name: 'Class E' },
    { from: 5, to: 10, name: 'Class D' },
    { from: 10, to: 12, name: 'C, B, A' },
  ]
  for (const c of classes) {
    parts.push(`<rect x="${r1(x(c.from))}" y="${y2}" width="${r1((c.to - c.from) * px - 3)}" height="44" fill="${ACCENT}"/>`)
    parts.push(text((x(c.from) + x(c.to)) / 2, y2 + 72, c.name, { size: 22, anchor: 'middle', fill: MUTED }))
  }
  parts.push(arrowHead(x(12) + 16, y2 + 22, 'right', 22, ACCENT))
  parts.push(text(x(1) + 14, y2 - 14, '<tspan font-weight="600">Felony</tspan>  more than 1 year', { size: 24 }))
  // The one-year line and the axis.
  const axisY = 240
  parts.push(`<line x1="${x(1)}" y1="28" x2="${x(1)}" y2="${axisY}" stroke="${INK}" stroke-width="2" stroke-dasharray="6 5"/>`)
  parts.push(`<line x1="${x0}" y1="${axisY}" x2="${x(12) + 16}" y2="${axisY}" stroke="${MUTED}" stroke-width="2"/>`)
  for (const yr of [0, 1, 5, 10]) {
    parts.push(`<line x1="${x(yr)}" y1="${axisY}" x2="${x(yr)}" y2="${axisY + 8}" stroke="${MUTED}" stroke-width="2"/>`)
    parts.push(text(x(yr), axisY + 32, String(yr), { size: 22, anchor: 'middle', fill: MUTED }))
  }
  parts.push(text(x0, 292, 'longest sentence the law allows, in years', { size: 22, fill: MUTED }))
  diagrams.push({
    factId: 'felony-misdemeanor',
    slug: 'one-year-line',
    width,
    height,
    wide: true,
    svg: svg(width, height, parts.join('\n')),
    label: 'The one-year line',
    note: 'US federal classes; each state sets its own',
    alt: 'A scale of the longest sentence the law allows, in years. Misdemeanors cover up to 1 year. Felonies start above 1 year: federal Class E runs to 5 years, Class D to 10, and Classes C, B and A go higher, up to life.',
  })
}

// ---------------------------------------------------------------------------
// Probation vs. parole: where a sentence is served. Shapes, not real lengths.

function sentencePanel(segments) {
  const x0 = 30
  const x1 = 370
  const parts = [text(x0, 60, 'one sentence, start to end', { size: 22, fill: MUTED })]
  for (const s of segments) {
    const a = x0 + s.from * (x1 - x0)
    const b = x0 + s.to * (x1 - x0)
    parts.push(`<rect x="${r1(a)}" y="80" width="${r1(b - a)}" height="64" fill="${s.color}"/>`)
    parts.push(text((a + b) / 2, 122, s.name, { size: 24, anchor: 'middle', fill: '#fff', weight: 600 }))
  }
  parts.push(arrowHead(x1 + 16, 112, 'right', 14, MUTED))
  parts.push(text(x0, 196, segments.length === 1 ? 'Ordered by a judge,' : 'Granted by a parole board', { size: 22 }))
  parts.push(text(x0, 226, segments.length === 1 ? 'usually instead of prison' : 'or by law, after prison time', { size: 22 }))
  parts.push(text(x0, 288, 'example, not to scale', { size: 20, fill: MUTED }))
  return svg(W, H, parts.join('\n'))
}

diagrams.push(
  {
    factId: 'parole-probation',
    slug: 'probation',
    svg: sentencePanel([{ from: 0, to: 1, name: 'in the community', color: BLUE }]),
    label: 'Probation',
    note: 'Served in the community, under supervision',
    alt: 'A bar for one sentence, filled entirely with "in the community". Probation is ordered by a judge, usually instead of prison.',
  },
  {
    factId: 'parole-probation',
    slug: 'parole',
    svg: sentencePanel([
      { from: 0, to: 0.55, name: 'prison', color: INK },
      { from: 0.55, to: 1, name: 'parole', color: BLUE },
    ]),
    label: 'Parole',
    note: 'Early release for the rest of the sentence',
    alt: 'A bar for one sentence: the first part is spent in prison, the rest on parole in the community. Parole is granted by a parole board or by law.',
  },
)

// ---------------------------------------------------------------------------
// Emigrate vs. immigrate: one move, named from each end. Uses the fact's own
// example countries.

{
  const width = 570
  const height = 260
  const box = (cx, name) =>
    `<rect x="${cx - 100}" y="40" width="200" height="90" rx="12" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>\n` +
    text(cx, 96, name, { size: 30, anchor: 'middle', weight: 600 })
  const left = 130
  const right = 440
  const parts = [
    box(left, 'Ireland'),
    box(right, 'Canada'),
    `<line x1="${left + 108}" y1="85" x2="${right - 124}" y2="85" stroke="${ACCENT}" stroke-width="6"/>`,
    arrowHead(right - 106, 85, 'right', 18, ACCENT),
    text(left, 178, '<tspan font-weight="600">emigrates from</tspan>', { size: 26, anchor: 'middle', fill: ACCENT }),
    text(left, 210, 'e- = out', { size: 22, anchor: 'middle', fill: MUTED }),
    text(right, 178, '<tspan font-weight="600">immigrates to</tspan>', { size: 26, anchor: 'middle', fill: ACCENT }),
    text(right, 210, 'im- = in', { size: 22, anchor: 'middle', fill: MUTED }),
  ]
  diagrams.push({
    factId: 'emigrate-immigrate-migrate',
    slug: 'one-move',
    width,
    height,
    wide: true,
    svg: svg(width, height, parts.join('\n')),
    label: 'One move, two words',
    note: 'Which word depends on which end you mean',
    alt: 'Two boxes, Ireland and Canada, with an arrow from Ireland to Canada. Under Ireland: emigrates from, e- means out. Under Canada: immigrates to, im- means in.',
  })
}

// ---------------------------------------------------------------------------

for (const d of diagrams) {
  const rel = `images/${d.factId}/${d.slug}.svg`
  const out = join(root, 'public', rel)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, d.svg)
  addToFact(d.factId, {
    src: `/${rel}`,
    label: d.label,
    ...(d.note ? { note: d.note } : {}),
    alt: d.alt,
    fit: 'contain',
    ...(d.wide ? { wide: true } : {}),
    credit: 'Diagram drawn for this app',
    source: SOURCE,
  })
}
console.error(`Drew ${diagrams.length} diagrams.`)
