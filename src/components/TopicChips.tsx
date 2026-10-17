type TopicChipsProps = {
  options: string[]
  selected: string
  onSelect: (option: string) => void
}

// A row of chips. Exactly one is selected. On small screens the row scrolls sideways.
export function TopicChips({ options, selected, onSelect }: TopicChipsProps) {
  return (
    <nav className="chips" aria-label="Topics">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`chip ${selected === option ? 'chip-on' : ''}`}
          aria-pressed={selected === option}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </nav>
  )
}
