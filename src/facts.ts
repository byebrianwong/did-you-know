export type Fact = {
  id: string
  category: string
  title: string
  question: string
  answer: string
  details: { term: string; text: string }[]
  bonus: string
  sources: string[]
}

// Every JSON file in src/data is one topic. Adding a new file adds its facts.
const modules = import.meta.glob<{ default: Fact[] }>('./data/*.json', { eager: true })

export const facts: Fact[] = Object.values(modules).flatMap((m) => m.default)

export const categories: string[] = [...new Set(facts.map((f) => f.category))].sort()

export const factsById = new Map(facts.map((f) => [f.id, f]))
