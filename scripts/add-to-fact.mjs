// Shared by fetch-image.mjs and make-diagrams.mjs.
// Puts an image entry in a fact's "images" list in src/data/*.json. It edits the
// text in place, so the file's existing formatting is kept.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = join(dirname(fileURLToPath(import.meta.url)), '..')

export function addToFact(factId, entry) {
  const dataDir = join(root, 'src', 'data')
  for (const name of readdirSync(dataDir).filter((n) => n.endsWith('.json'))) {
    const path = join(dataDir, name)
    const facts = JSON.parse(readFileSync(path, 'utf8'))
    const fact = facts.find((f) => f.id === factId)
    if (!fact) continue
    // Re-running for the same image keeps its place in the list. A new image goes last.
    const images = [...(fact.images ?? [])]
    const at = images.findIndex((i) => i.src === entry.src)
    if (at === -1) images.push(entry)
    else images[at] = entry

    const text = readFileSync(path, 'utf8')
    const start = text.indexOf(`"id": ${JSON.stringify(factId)}`)
    // The fact object ends at the first line that is just "  }" or "  }," after its id.
    const endMatch = /\n  \},?\n|\n  \}\n?$/.exec(text.slice(start))
    const end = start + endMatch.index
    let body = text.slice(start, end).replace(/,\n    "images": \[[\s\S]*\]$/, '')
    const block = JSON.stringify(images, null, 2).replace(/\n/g, '\n    ')
    body += `,\n    "images": ${block}`
    const next = text.slice(0, start) + body + text.slice(end)
    JSON.parse(next) // throws if the edit broke the file
    writeFileSync(path, next)
    console.error(`Added to ${name} (${images.length} image${images.length === 1 ? '' : 's'} on this fact)`)
    return
  }
  throw new Error(`No fact with id "${factId}" found. Entry was not added.`)
}
