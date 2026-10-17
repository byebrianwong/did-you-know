export type Mode = 'learn' | 'browse'

const labels: Record<Mode, string> = { learn: 'Learn', browse: 'Browse' }

type ModeToggleProps = {
  mode: Mode
  onChange: (mode: Mode) => void
}

// Two toggle buttons that switch the view. They are plain buttons with
// aria-pressed, not tabs: tabs would also need tab panels and arrow-key movement.
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="modes" role="group" aria-label="View">
      {(Object.keys(labels) as Mode[]).map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          className={`mode ${mode === m ? 'mode-on' : ''}`}
          onClick={() => onChange(m)}
        >
          {labels[m]}
        </button>
      ))}
    </div>
  )
}
