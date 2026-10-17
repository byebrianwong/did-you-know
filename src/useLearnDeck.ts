import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Fact } from './facts'
import type { Progress, ProgressStore } from './progress'

// The state of the Learn deck: which facts are known, which topic is chosen, and
// which card is next. Components only display this; they never hold it.

export const ALL_TOPICS = 'All'
// A card marked "New to me" comes back after this many other cards.
export const RETRY_GAP = 4

function shuffleItems<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function inTopic(fact: Fact, topic: string) {
  return topic === ALL_TOPICS || fact.category === topic
}

// Unknown facts in the chosen topic. Never-seen ones go first.
function buildQueue(facts: Fact[], topic: string, progress: Progress, shuffle: boolean): string[] {
  const order = shuffle ? shuffleItems : <T>(items: T[]) => items
  const known = new Set(progress.known)
  const seen = new Set(progress.seen)
  const pool = facts.filter((f) => inTopic(f, topic) && !known.has(f.id))
  const fresh = pool.filter((f) => !seen.has(f.id)).map((f) => f.id)
  const again = pool.filter((f) => seen.has(f.id)).map((f) => f.id)
  return [...order(fresh), ...order(again)]
}

type Options = {
  facts: Fact[]
  store: ProgressStore
  // Set to false to keep the facts in the order given. Stories and tests do this
  // so every run shows the same cards.
  shuffle?: boolean
}

export function useLearnDeck({ facts, store, shuffle = true }: Options) {
  const [progress, setProgress] = useState<Progress>(() => store.load())
  const [topic, setTopicState] = useState(ALL_TOPICS)
  const [queue, setQueue] = useState<string[]>(() =>
    buildQueue(facts, ALL_TOPICS, store.load(), shuffle),
  )
  const [revealed, setRevealed] = useState(false)

  useEffect(() => store.save(progress), [store, progress])

  const factsById = useMemo(() => new Map(facts.map((f) => [f.id, f])), [facts])
  const topics = useMemo(() => [...new Set(facts.map((f) => f.category))].sort(), [facts])
  const knownIds = useMemo(() => new Set(progress.known), [progress.known])
  const visible = facts.filter((f) => inTopic(f, topic))
  const knownCount = visible.filter((f) => knownIds.has(f.id)).length
  const current = queue.length > 0 ? factsById.get(queue[0]) : undefined

  const setTopic = (next: string) => {
    setTopicState(next)
    setQueue(buildQueue(facts, next, progress, shuffle))
    setRevealed(false)
  }

  const reveal = useCallback(() => {
    if (!current) return
    setRevealed(true)
    setProgress((p) => (p.seen.includes(current.id) ? p : { ...p, seen: [...p.seen, current.id] }))
  }, [current])

  const knewIt = useCallback(() => {
    if (!current) return
    setProgress((p) => ({ ...p, known: [...new Set([...p.known, current.id])] }))
    setQueue((q) => q.slice(1))
    setRevealed(false)
  }, [current])

  const newToMe = useCallback(() => {
    setQueue((q) => {
      const [head, ...rest] = q
      if (!head) return q
      const at = Math.min(RETRY_GAP, rest.length)
      return [...rest.slice(0, at), head, ...rest.slice(at)]
    })
    setRevealed(false)
  }, [])

  // Forget "known" for every fact in the chosen topic, so they come back to Learn.
  const startOver = () => {
    const inThisTopic = new Set(visible.map((f) => f.id))
    const next = { ...progress, known: progress.known.filter((id) => !inThisTopic.has(id)) }
    setProgress(next)
    setQueue(buildQueue(facts, topic, next, shuffle))
    setRevealed(false)
  }

  // From Browse: mark a card known (drops it from the Learn queue) or put it back
  // (adds it to the end of the Learn queue).
  const setKnown = (id: string, known: boolean) => {
    setProgress((p) => ({
      known: known ? [...new Set([...p.known, id])] : p.known.filter((k) => k !== id),
      seen: p.seen.includes(id) ? p.seen : [...p.seen, id],
    }))
    setQueue((q) => (known ? q.filter((k) => k !== id) : q.includes(id) ? q : [...q, id]))
  }

  return {
    topics,
    topic,
    setTopic,
    visible,
    knownIds,
    knownCount,
    total: visible.length,
    current,
    revealed,
    reveal,
    knewIt,
    newToMe,
    startOver,
    setKnown,
    factById: (id: string) => factsById.get(id),
  }
}
