// A picture saved under public/images/<fact-id>/. Two kinds:
// - a real photo or map from Wikimedia Commons, added with scripts/fetch-image.mjs,
//   which also fills in the credit and license;
// - a diagram drawn from numbers by scripts/make-diagrams.mjs. These have no license
//   line, and the source link points to that script.
export type FactImage = {
  src: string
  label: string // what the picture shows, e.g. "Jaguar"
  note?: string // optional short pointer to what to look at, e.g. "Dots inside the rosettes"
  alt: string
  fit?: 'contain' // for maps and diagrams, so nothing is cropped off
  wide?: boolean // spans the full width under the other pictures, at its own shape
  credit: string
  license?: string
  licenseUrl?: string
  source: string // the Commons file page, or the diagram script
}

export type Fact = {
  id: string
  category: string
  title: string
  question: string
  answer: string
  details: { term: string; text: string }[]
  bonus: string
  sources: string[]
  images?: FactImage[]
}

// Every JSON file in src/data is one topic. Adding a new file adds its facts.
const modules = import.meta.glob<{ default: Fact[] }>('./data/*.json', { eager: true })

export const facts: Fact[] = Object.values(modules).flatMap((m) => m.default)

export const factsById = new Map(facts.map((f) => [f.id, f]))
