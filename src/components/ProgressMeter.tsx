type ProgressMeterProps = {
  known: number
  total: number
}

// How many facts in the chosen topic are marked as known. When all of them are,
// the text changes to "✓ All N known" in the accent colour.
export function ProgressMeter({ known, total }: ProgressMeterProps) {
  const percent = total ? (known / total) * 100 : 0
  const done = total > 0 && known === total
  return (
    <div className={`meter ${done ? 'meter-done' : ''}`}>
      <div
        className="meter-bar"
        role="progressbar"
        aria-label="Facts known"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={known}
        aria-valuetext={`${known} of ${total} known`}
      >
        <div className="meter-fill" style={{ width: `${percent}%` }} />
      </div>
      {/* Screen readers already hear this from the progress bar. */}
      <span className="meter-text" aria-hidden="true">
        {done ? `✓ All ${total} known` : `${known} / ${total} known`}
      </span>
    </div>
  )
}
