import type { Fact } from '../facts'
import { Button } from './Button'
import { FactBody } from './FactBody'
import { FactHeading } from './FactHeading'

type FactDetailProps = {
  fact: Fact
  known: boolean
  // Text of the back link, e.g. "All facts" or "All Animals".
  backLabel: string
  onBack: () => void
  onKnownChange: (known: boolean) => void
}

// A card opened from the Browse list: the whole fact, plus a way to change
// whether it is known.
export function FactDetail({ fact, known, backLabel, onBack, onKnownChange }: FactDetailProps) {
  return (
    <article className="card">
      <button type="button" className="back" onClick={onBack}>
        ← {backLabel}
      </button>
      <FactHeading fact={fact} />
      <FactBody fact={fact} />
      <div className="status-row">
        <span className="status">{known ? '✓ You marked this as known' : 'In your Learn deck'}</span>
        <Button variant="quiet" onClick={() => onKnownChange(!known)}>
          {known ? 'Put back in Learn' : 'I know this one'}
        </Button>
      </div>
    </article>
  )
}
