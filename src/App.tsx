import { useEffect, useState } from 'react'
import { BrowseList } from './components/BrowseList'
import { DoneState } from './components/DoneState'
import { FactDetail } from './components/FactDetail'
import { Header } from './components/Header'
import { LearnCard } from './components/LearnCard'
import type { Mode } from './components/ModeToggle'
import type { Fact } from './facts'
import type { ProgressStore } from './progress'
import { ALL_TOPICS, useLearnDeck } from './useLearnDeck'

type AppProps = {
  facts: Fact[]
  store: ProgressStore
  // Set to false to keep the facts in the order given (stories and tests).
  shuffle?: boolean
  initialMode?: Mode
}

function blurFocus() {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
}

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// The whole app. It holds the screen state (Learn or Browse, which card is open)
// and passes the deck state from useLearnDeck down to the components.
export default function App({ facts, store, shuffle = true, initialMode = 'learn' }: AppProps) {
  const deck = useLearnDeck({ facts, store, shuffle })
  const [mode, setMode] = useState<Mode>(initialMode)
  const [openId, setOpenId] = useState<string | null>(null) // card opened from Browse
  const { current, revealed, reveal, knewIt, newToMe } = deck
  const opened = openId ? deck.factById(openId) : undefined

  const changeTopic = (next: string) => {
    deck.setTopic(next)
    setOpenId(null)
    // Let Space reveal the card instead of pressing the chip again.
    blurFocus()
  }

  const changeMode = (next: Mode) => {
    setMode(next)
    setOpenId(null)
    blurFocus()
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
        toTop()
      } else if (revealed && (e.key.toLowerCase() === 'n' || e.key === 'ArrowRight')) {
        newToMe()
        toTop()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, revealed, reveal, knewIt, newToMe])

  const topicName = deck.topic === ALL_TOPICS ? null : deck.topic

  return (
    <div className="page">
      <Header
        mode={mode}
        onModeChange={changeMode}
        knownCount={deck.knownCount}
        total={deck.total}
        topicOptions={[ALL_TOPICS, ...deck.topics]}
        topic={deck.topic}
        onTopicChange={changeTopic}
      />

      <main>
        {mode === 'browse' && opened ? (
          <FactDetail
            key={opened.id}
            fact={opened}
            known={deck.knownIds.has(opened.id)}
            backLabel={`All ${topicName ?? 'facts'}`}
            onBack={() => setOpenId(null)}
            onKnownChange={(known) => deck.setKnown(opened.id, known)}
          />
        ) : mode === 'browse' ? (
          <BrowseList
            facts={deck.visible}
            knownIds={deck.knownIds}
            showCategory={topicName === null}
            onOpen={openCard}
          />
        ) : current ? (
          <LearnCard
            // A new key replays the card's entrance animation.
            key={current.id + (revealed ? '-open' : '')}
            fact={current}
            revealed={revealed}
            onReveal={reveal}
            onKnewIt={() => {
              knewIt()
              toTop()
            }}
            onNewToMe={() => {
              newToMe()
              toTop()
            }}
          />
        ) : (
          <DoneState
            total={deck.total}
            topic={topicName}
            onBrowse={() => changeMode('browse')}
            onStartOver={deck.startOver}
          />
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
