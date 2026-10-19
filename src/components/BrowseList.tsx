import type { Fact } from '../facts'

type BrowseListProps = {
  facts: Fact[]
  knownIds: ReadonlySet<string>
  // Split the list into one section per topic, each with a heading and its own
  // count of known facts. Useful when the list mixes topics.
  groupByTopic: boolean
  onOpen: (id: string) => void
}

type RowsProps = Pick<BrowseListProps, 'facts' | 'knownIds' | 'onOpen'>

function byTitle(a: Fact, b: Fact) {
  return a.title.localeCompare(b.title)
}

// One rounded card of rows, sorted by title. Known facts get a check mark.
function Rows({ facts, knownIds, onOpen }: RowsProps) {
  return (
    <ul className="list">
      {[...facts].sort(byTitle).map((f) => (
        <li key={f.id}>
          <button type="button" className="row" onClick={() => onOpen(f.id)}>
            <span className="row-title">{f.title}</span>
            {knownIds.has(f.id) && (
              <span className="row-known">
                <span aria-hidden="true">✓</span>
                <span className="visually-hidden">Known</span>
              </span>
            )}
            <svg className="row-chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M6 3.5 10.5 8 6 12.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  )
}

// Every fact in the chosen topic. With all topics shown, the facts are grouped by
// topic (topics in A–Z order), and each group says how many of its facts are known.
export function BrowseList({ facts, knownIds, groupByTopic, onOpen }: BrowseListProps) {
  if (!groupByTopic) return <Rows facts={facts} knownIds={knownIds} onOpen={onOpen} />

  const topics = [...new Set(facts.map((f) => f.category))].sort((a, b) => a.localeCompare(b))
  return (
    <div className="groups">
      {topics.map((topic) => {
        const inTopic = facts.filter((f) => f.category === topic)
        const known = inTopic.filter((f) => knownIds.has(f.id)).length
        const headingId = `topic-${topic.replace(/\W+/g, '-').toLowerCase()}`
        return (
          <section key={topic} className="group" aria-labelledby={headingId}>
            <div className="group-head">
              <h2 className="group-title" id={headingId}>
                {topic}
              </h2>
              <span className="group-count">
                {known} of {inTopic.length} known
              </span>
            </div>
            <Rows facts={inTopic} knownIds={knownIds} onOpen={onOpen} />
          </section>
        )
      })}
    </div>
  )
}
