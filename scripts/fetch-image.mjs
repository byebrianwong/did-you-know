#!/usr/bin/env node
// Downloads one photo from Wikimedia Commons into public/images/<fact-id>/ and
// prints the JSON entry to paste into the fact's "images" list.
//
// Usage:
//   node scripts/fetch-image.mjs <fact-id> <slug> "<Commons file name>" "<label>" "<alt text>"
//
// Example:
//   node scripts/fetch-image.mjs leopard-jaguar-cheetah jaguar \
//     "File:Jaguar (Panthera onca palustris) female Piquiri River 2.JPG" \
//     "Jaguar" "A jaguar crouching in grass, facing the camera"
//
// The script also adds the entry to the fact's "images" list in src/data/*.json
// (replacing an older entry with the same src, in the same place). It edits the text in place, so the
// file's existing formatting is kept. Pass --no-write to only print the entry.
//
// Options:
//   --note "<text>"  short pointer to what to look at, shown under the label
//   --contain        show the whole image uncropped (for maps and diagrams)
//
// The image is resized to 640px wide (sips, macOS) so the repo stays small.
// Only files with a free license (CC0, public domain, CC BY, CC BY-SA) are accepted.

import { execFileSync } from 'node:child_process'
import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { addToFact, root } from './add-to-fact.mjs'

const UA = 'did-you-know-app/0.1 (https://github.com/; image fetch script)'
const WIDTH = 640

const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args.splice(i, 1) && true
}
const option = (name) => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args.splice(i, 2)[1]
}
const noWrite = flag('--no-write')
const contain = flag('--contain')
const note = option('--note')
const [factId, slug, fileArg, label, alt] = args
if (!factId || !slug || !fileArg || !label || !alt) {
  console.error('Usage: node scripts/fetch-image.mjs <fact-id> <slug> "<File:...>" "<label>" "<alt>"')
  process.exit(1)
}
const title = fileArg.startsWith('File:') ? fileArg : `File:${fileArg}`

const stripHtml = (s = '') =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

// Commons author fields often carry wiki clutter. Keep just the name.
// Long or odd credits still need a look by hand.
const cleanCredit = (s) =>
  s
    .replace(/^No machine-readable author provided\. (.*) assumed \(based on copyright claims\)\.$/, '$1')
    .replace(/\s*\(talk\)/g, '')
    .replace(/\[\d+\]/g, '')
    .replace(/^(\w{2}:)?User:/, '')
    .trim()

const api = new URL('https://commons.wikimedia.org/w/api.php')
api.search = new URLSearchParams({
  action: 'query',
  titles: title,
  prop: 'imageinfo',
  iiprop: 'url|extmetadata|mime',
  iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl|ImageDescription',
  iiurlwidth: String(WIDTH * 2),
  format: 'json',
  formatversion: '2',
}).toString()

const res = await fetch(api, { headers: { 'User-Agent': UA } })
const page = (await res.json()).query?.pages?.[0]
const info = page?.imageinfo?.[0]
if (!info) {
  console.error(`Not found on Commons: ${title}`)
  process.exit(1)
}

const meta = info.extmetadata ?? {}
const license = stripHtml(meta.LicenseShortName?.value)
const free = /^(CC0|Public domain|PD|CC BY(-SA)? \d)/i.test(license)
if (!free) {
  console.error(`License not accepted: "${license}" (${title})`)
  process.exit(1)
}

// SVG and PNG thumbnails come back as PNG. Everything else is saved as JPEG.
const ext = /png|svg|gif/.test(info.mime) ? 'png' : 'jpg'
const rel = `images/${factId}/${slug}.${ext}`
const out = join(root, 'public', rel)
mkdirSync(dirname(out), { recursive: true })

const img = await fetch(info.thumburl, { headers: { 'User-Agent': UA } })
if (!img.ok) {
  console.error(`Download failed (${img.status}): ${info.thumburl}`)
  process.exit(1)
}
writeFileSync(out, Buffer.from(await img.arrayBuffer()))

const sipsArgs = ['--resampleWidth', String(WIDTH)]
if (ext === 'jpg') sipsArgs.push('-s', 'format', 'jpeg', '-s', 'formatOptions', '78')
execFileSync('sips', [...sipsArgs, out, '--out', out], { stdio: 'ignore' })

const entry = {
  src: `/${rel}`,
  label,
  ...(note ? { note } : {}),
  alt,
  ...(contain ? { fit: 'contain' } : {}),
  credit: cleanCredit(stripHtml(meta.Artist?.value)) || 'Unknown',
  license,
  ...(meta.LicenseUrl?.value ? { licenseUrl: meta.LicenseUrl.value } : {}),
  source: info.descriptionurl,
}

console.error(`Saved ${rel} (${Math.round(statSync(out).size / 1024)} KB)`)
console.error(`Commons description: ${stripHtml(meta.ImageDescription?.value).slice(0, 300)}`)
console.log(JSON.stringify(entry, null, 2))
if (!noWrite) addToFact(factId, entry)
