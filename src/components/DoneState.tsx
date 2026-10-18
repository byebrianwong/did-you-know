import { Button } from './Button'

type DoneStateProps = {
  total: number
  // The chosen topic, or null when all topics are shown.
  topic: string | null
  onBrowse: () => void
  onStartOver: () => void
}

// Shown in Learn mode when every fact in the chosen topic is known.
export function DoneState({ total, topic, onBrowse, onStartOver }: DoneStateProps) {
  return (
    <section className="card done">
      <h2 className="title">You know all {total}.</h2>
      <p className="question">{topic ? `Every fact in ${topic}` : 'Every fact in the deck'} is marked as known.</p>
      <div className="actions">
        <Button variant="quiet" onClick={onBrowse}>
          Browse them
        </Button>
        <Button onClick={onStartOver}>Go through again</Button>
      </div>
    </section>
  )
}
