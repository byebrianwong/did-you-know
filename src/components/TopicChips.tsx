import { topicLooks } from '../topics'

type TopicChipsProps = {
  options: string[]
  selected: string
  onSelect: (option: string) => void
}

// A row of chips. Exactly one is selected. On small screens the row scrolls sideways.
// Each topic shows its icon in the topic's colour. "All" has no icon.
export function TopicChips({ options, selected, onSelect }: TopicChipsProps) {
  return (
    <nav className="chips" aria-label="Topics">
      {options.map((option) => {
        const look = topicLooks[option]
        return (
          <button
            key={option}
            type="button"
            className={`chip ${selected === option ? 'chip-on' : ''}`}
            data-topic={look?.slug}
            aria-pressed={selected === option}
            onClick={() => onSelect(option)}
          >
            {look && <look.Icon aria-hidden="true" />}
            {option}
          </button>
        )
      })}
    </nav>
  )
}
