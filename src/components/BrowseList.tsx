import type { Fact } from '../facts'

type BrowseListProps = {
  facts: Fact[]
  knownIds: ReadonlySet<string>
  // Show each fact's topic under its title. Useful when the list mixes topics.
  showCategory: boolean
  onOpen: (id: string) => void
}

// Every fact in the chosen topic, sorted by title. Known facts get a check mark.
export function BrowseList({ facts, knownIds, showCategory, onOpen }: BrowseListProps) {
  const sorted = [...facts].sort((a, b) => a.title.localeCompare(b.title))
  return (
    <ul className="list">
      {sorted.map((f) => (
        <li key={f.id}>
          <button type="button" className="row" onClick={() => onOpen(f.id)}>
            <span className="row-main">
              <span className="row-title">{f.title}</span>
              {showCategory && <span className="row-cat">{f.category}</span>}
            </span>
            {knownIds.has(f.id) && (
              <span className="row-known">
                <span aria-hidden="true">✓</span>
                <span className="visually-hidden">Known</span>
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}
