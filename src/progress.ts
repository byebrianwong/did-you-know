// Saves which facts the reader already knows, in this browser only.
// Storage can be missing or blocked (private windows), so every access is guarded
// and the app still works without it.

const KEY = 'did-you-know:v1'

export type Progress = {
  known: string[] // facts marked "Knew it"
  seen: string[] // every fact revealed at least once
}

const empty: Progress = { known: [], seen: [] }

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw)
    return {
      known: Array.isArray(parsed.known) ? parsed.known : [],
      seen: Array.isArray(parsed.seen) ? parsed.seen : [],
    }
  } catch {
    return empty
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    // Ignore: progress just won't survive a reload.
  }
}
