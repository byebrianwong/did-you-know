import type { Fact } from '../facts'
import { Button } from './Button'
import { FactBody } from './FactBody'
import { FactHeading } from './FactHeading'

type LearnCardProps = {
  fact: Fact
  // false: only the question and "Tell me". true: the answer and the two choices.
  revealed: boolean
  onReveal: () => void
  onKnewIt: () => void
  onNewToMe: () => void
}

// The card shown in Learn mode.
export function LearnCard({ fact, revealed, onReveal, onKnewIt, onNewToMe }: LearnCardProps) {
  return (
    <article className="card">
      <FactHeading fact={fact} />
      {!revealed ? (
        <Button wide shortcut="Space" onClick={onReveal}>
          Tell me
        </Button>
      ) : (
        <div className="reveal">
          <FactBody fact={fact} />
          <div className="actions">
            <Button variant="quiet" shortcut="K" onClick={onKnewIt}>
              I knew that
            </Button>
            <Button shortcut="N" onClick={onNewToMe}>
              New to me · next
            </Button>
          </div>
          <p className="hint">"I knew that" takes the card out of Learn. You can still read it in Browse.</p>
        </div>
      )}
    </article>
  )
}
