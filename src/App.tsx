import { useCallback, useEffect, useState } from 'react'
import { categories, facts, factsById, type Fact, type FactImage } from './facts'
import { loadProgress, saveProgress, type Progress } from './progress'

const ALL = 'All'
// A card marked "New to me" comes back after this many other cards.
const RETRY_GAP = 4

function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function inFilter(fact: Fact, filter: string) {
  return filter === ALL || fact.category === filter
}

// Unknown facts in the current filter. Never-seen ones go first.
function buildQueue(filter: string, progress: Progress): string[] {
  const known = new Set(progress.known)
  const seen = new Set(progress.seen)
  const pool = facts.filter((f) => inFilter(f, filter) && !known.has(f.id))
  const fresh = pool.filter((f) => !seen.has(f.id)).map((f) => f.id)
  const again = pool.filter((f) => seen.has(f.id)).map((f) => f.id)
  return [...shuffle(fresh), ...shuffle(again)]
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function Photos({ images }: { images: FactImage[] }) {
  // Wide pictures take a whole row, so only the others decide the column count.
  const inGrid = images.filter((img) => !img.wide).length
  return (
    <div className={`photos photos-${inGrid}`}>
      {images.map((img) => (
        <figure className={`photo ${img.wide ? 'photo-wide' : ''}`} key={img.src}>
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            className={img.fit === 'contain' ? 'photo-contain' : undefined}
          />
          <figcaption>
            <span className="photo-label">{img.label}</span>
            {img.note && <span className="photo-note">{img.note}</span>}
            <span className="photo-credit">
              <a href={img.source} target="_blank" rel="noreferrer">
                {img.credit}
              </a>
              {img.license && ' · '}
              {img.license && img.licenseUrl ? (
                <a href={img.licenseUrl} target="_blank" rel="noreferrer">
                  {img.license}
                </a>
              ) : (
                img.license
              )}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

// The full explanation shown after "Tell me", and when opening a card from Browse.
function FactBody({ fact }: { fact: Fact }) {
  return (
    <>
      <p className="answer">{fact.answer}</p>
      {fact.images && fact.images.length > 0 && <Photos images={fact.images} />}
      <dl className="details">
        {fact.details.map((d) => (
          <div className="detail" key={d.term}>
            <dt>{d.term}</dt>
            <dd>{d.text}</dd>
          </div>
        ))}
      </dl>
      {fact.bonus && (
        <aside className="bonus">
          <span className="bonus-label">Weird bonus</span>
          <p>{fact.bonus}</p>
        </aside>
      )}
      {fact.sources.length > 0 && (
        <p className="sources">
          Sources:{' '}
          {fact.sources.map((s, i) => (
            <span key={s}>
              {i > 0 && ' · '}
              <a href={s} target="_blank" rel="noreferrer">
                {hostname(s)}
              </a>
            </span>
          ))}
        </p>
      )}
    </>
  )
}

type Mode = 'learn' | 'browse'

export default function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [filter, setFilter] = useState(ALL)
  const [mode, setMode] = useState<Mode>('learn')
  const [queue, setQueue] = useState<string[]>(() => buildQueue(ALL, loadProgress()))
  const [revealed, setRevealed] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null) // card opened from Browse

  useEffect(() => saveProgress(progress), [progress])

  const current = queue.length > 0 ? factsById.get(queue[0]) : undefined
  const opened = openId ? factsById.get(openId) : undefined
  const knownSet = new Set(progress.known)
  const visible = facts.filter((f) => inFilter(f, filter))
  const total = visible.length
  const knownCount = visible.filter((f) => knownSet.has(f.id)).length

  const blurFocus = () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  }

  const changeFilter = (next: string) => {
    setFilter(next)
    setQueue(buildQueue(next, progress))
    setRevealed(false)
    setOpenId(null)
    // Let Space reveal the card instead of pressing the chip again.
    blurFocus()
  }

  const changeMode = (next: Mode) => {
    setMode(next)
    setOpenId(null)
    blurFocus()
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [current])

  const newToMe = useCallback(() => {
    setQueue((q) => {
      const [head, ...rest] = q
      if (!head) return q
      const at = Math.min(RETRY_GAP, rest.length)
      return [...rest.slice(0, at), head, ...rest.slice(at)]
    })
    setRevealed(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const startOver = () => {
    const inThisFilter = new Set(visible.map((f) => f.id))
    const next = { ...progress, known: progress.known.filter((id) => !inThisFilter.has(id)) }
    setProgress(next)
    setQueue(buildQueue(filter, next))
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

  const openCard = (id: string) => {
    setOpenId(id)
    window.scrollTo({ top: 0 })
  }

  // Keyboard, Learn mode only: Space or Enter reveals. After that, K = knew it, N = new to me.
  useEffect(() => {
    if (mode !== 'learn') return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target instanceof HTMLElement && e.target.closest('button, a, input')) {
        if (e.key === ' ' || e.key === 'Enter') return
      }
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        reveal()
      } else if (revealed && e.key.toLowerCase() === 'k') {
        knewIt()
      } else if (revealed && (e.key.toLowerCase() === 'n' || e.key === 'ArrowRight')) {
        newToMe()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, revealed, reveal, knewIt, newToMe])

  return (
    <div className="page">
      <header className="top">
        <div className="top-row">
          <h1 className="logo">
            Did you <em>know?</em>
          </h1>
          <div className="modes" role="tablist" aria-label="View">
            {(['learn', 'browse'] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                className={`mode ${mode === m ? 'mode-on' : ''}`}
                onClick={() => changeMode(m)}
              >
                {m === 'learn' ? 'Learn' : 'Browse'}
              </button>
            ))}
          </div>
        </div>
        <p className="tagline">The real differences between things everyone mixes up.</p>
        <div className="meter" aria-label={`${knownCount} of ${total} known`}>
          <div className="meter-bar">
            <div className="meter-fill" style={{ width: `${total ? (knownCount / total) * 100 : 0}%` }} />
          </div>
          <span className="meter-text">
            {knownCount} / {total} known
          </span>
        </div>
        <nav className="chips" aria-label="Topics">
          {[ALL, ...categories].map((c) => (
            <button
              key={c}
              className={`chip ${filter === c ? 'chip-on' : ''}`}
              aria-pressed={filter === c}
              onClick={() => changeFilter(c)}
            >
              {c}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {mode === 'browse' && opened ? (
          <article className="card" key={opened.id}>
            <button className="back" onClick={() => setOpenId(null)}>
              ← All {filter === ALL ? 'facts' : filter}
            </button>
            <span className="tag">{opened.category}</span>
            <h2 className="title">{opened.title}</h2>
            <p className="question">{opened.question}</p>
            <FactBody fact={opened} />
            {knownSet.has(opened.id) ? (
              <div className="status-row">
                <span className="status">✓ You marked this as known</span>
                <button className="btn btn-quiet" onClick={() => setKnown(opened.id, false)}>
                  Put back in Learn
                </button>
              </div>
            ) : (
              <div className="status-row">
                <span className="status">In your Learn deck</span>
                <button className="btn btn-quiet" onClick={() => setKnown(opened.id, true)}>
                  I know this one
                </button>
              </div>
            )}
          </article>
        ) : mode === 'browse' ? (
          <ul className="list">
            {visible
              .slice()
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((f) => (
                <li key={f.id}>
                  <button className="row" onClick={() => openCard(f.id)}>
                    <span className="row-main">
                      <span className="row-title">{f.title}</span>
                      {filter === ALL && <span className="row-cat">{f.category}</span>}
                    </span>
                    {knownSet.has(f.id) && (
                      <span className="row-known" aria-label="Known">
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        ) : current ? (
          <article className="card" key={current.id + (revealed ? '-open' : '')}>
            <span className="tag">{current.category}</span>
            <h2 className="title">{current.title}</h2>
            <p className="question">{current.question}</p>

            {!revealed ? (
              <button className="btn btn-primary btn-wide" onClick={reveal}>
                Tell me
              </button>
            ) : (
              <div className="reveal">
                <FactBody fact={current} />
                <div className="actions">
                  <button className="btn btn-quiet" onClick={knewIt}>
                    I knew that
                  </button>
                  <button className="btn btn-primary" onClick={newToMe}>
                    New to me · next
                  </button>
                </div>
                <p className="hint">
                  "I knew that" takes the card out of Learn. You can still read it in Browse.
                </p>
              </div>
            )}
          </article>
        ) : (
          <section className="card done">
            <h2 className="title">You know all {total}.</h2>
            <p className="question">
              {filter === ALL ? 'Every fact in the deck' : `Every fact in ${filter}`} is marked as known.
            </p>
            <div className="actions">
              <button className="btn btn-quiet" onClick={() => changeMode('browse')}>
                Browse them
              </button>
              <button className="btn btn-primary" onClick={startOver}>
                Go through again
              </button>
            </div>
          </section>
        )}
      </main>

      {mode === 'learn' && (
        <footer className="foot">
          <span className="keys">Space to reveal · K knew it · N next</span>
        </footer>
      )}
    </div>
  )
}
