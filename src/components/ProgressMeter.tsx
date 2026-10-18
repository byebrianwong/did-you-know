type ProgressMeterProps = {
  known: number
  total: number
}

// How many facts in the chosen topic are marked as known.
export function ProgressMeter({ known, total }: ProgressMeterProps) {
  const percent = total ? (known / total) * 100 : 0
  return (
    <div className="meter">
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
        {known} / {total} known
      </span>
    </div>
  )
}
