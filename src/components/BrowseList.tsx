import type { CSSProperties } from 'react'
import type { Fact } from '../facts'
import { topicLook } from '../topics'
import { BrowseCard } from './BrowseCard'

type BrowseListProps = {
  facts: Fact[]
  knownIds: ReadonlySet<string>
  // Split the grid into one section per topic, each with a heading and its own
  // count of known facts. Useful when the grid mixes topics.
  groupByTopic: boolean
  onOpen: (id: string) => void
}

type CardsProps = Pick<BrowseListProps, 'facts' | 'knownIds' | 'onOpen'>

function byTitle(a: Fact, b: Fact) {
  return a.title.localeCompare(b.title)
}

// A grid of picture cards, sorted by title. Known facts are marked on their card.
function Cards({ facts, knownIds, onOpen }: CardsProps) {
  return (
    <ul className="cards">
      {[...facts].sort(byTitle).map((f, i) => (
        // --i staggers the cards' entrance, one after another.
        <li key={f.id} style={{ '--i': i } as CSSProperties}>
          <BrowseCard fact={f} known={knownIds.has(f.id)} onOpen={() => onOpen(f.id)} />
        </li>
      ))}
    </ul>
  )
}

// Every fact in the chosen topic as picture cards. With all topics shown, the
// cards are grouped by topic (topics in A–Z order), and each group has the
// topic's icon and says how many of its facts are known.
export function BrowseList({ facts, knownIds, groupByTopic, onOpen }: BrowseListProps) {
  if (!groupByTopic) return <Cards facts={facts} knownIds={knownIds} onOpen={onOpen} />

  const topics = [...new Set(facts.map((f) => f.category))].sort((a, b) => a.localeCompare(b))
  return (
    <div className="browse">
      {topics.map((topic) => {
        const { slug, Icon } = topicLook(topic)
        const inTopic = facts.filter((f) => f.category === topic)
        const known = inTopic.filter((f) => knownIds.has(f.id)).length
        const headingId = `topic-${topic.replace(/\W+/g, '-').toLowerCase()}`
        return (
          <section key={topic} className="topic" data-topic={slug} aria-labelledby={headingId}>
            <div className="topic-head">
              <span className="topic-badge">
                <Icon aria-hidden="true" />
              </span>
              <h2 className="topic-name" id={headingId}>
                {topic}
              </h2>
              <span className="topic-count">
                {known} of {inTopic.length} known
              </span>
            </div>
            <Cards facts={inTopic} knownIds={knownIds} onOpen={onOpen} />
          </section>
        )
      })}
    </div>
  )
}
