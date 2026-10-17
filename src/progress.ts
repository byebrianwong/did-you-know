// Saves which facts the reader already knows.
// The app reads and writes progress through a ProgressStore, so stories and tests
// can start from any state without touching the browser's storage.

const KEY = 'did-you-know:v1'

export type Progress = {
  known: string[] // facts marked "Knew it"
  seen: string[] // every fact revealed at least once
}

export type ProgressStore = {
  load: () => Progress
  save: (progress: Progress) => void
}

export const emptyProgress: Progress = { known: [], seen: [] }

// The real store: localStorage, in this browser only. Storage can be missing or
// blocked (private windows), so every access is guarded and the app still works.
export const browserStore: ProgressStore = {
  load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return emptyProgress
      const parsed = JSON.parse(raw)
      return {
        known: Array.isArray(parsed.known) ? parsed.known : [],
        seen: Array.isArray(parsed.seen) ? parsed.seen : [],
      }
    } catch {
      return emptyProgress
    }
  },
  save(progress) {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress))
    } catch {
      // Ignore: progress just won't survive a reload.
    }
  },
}

// A store that keeps progress in memory. Used by stories and tests.
export function memoryStore(initial: Progress = emptyProgress): ProgressStore {
  let current = initial
  return {
    load: () => current,
    save: (progress) => {
      current = progress
    },
  }
}
