import type { CSSProperties } from 'react'
import type { Fact } from '../facts'
import { topicLook } from '../topics'
import { BrowseCard } from './BrowseCard'

type BrowseListProps = {
  facts: Fact[]
  knownIds: ReadonlySet<string>
  onOpen: (id: string) => void
}

// Facts grouped by topic. Topics are in alphabetical order, and so are the facts
// in each topic.
function groupByTopic(facts: Fact[]): [string, Fact[]][] {
  const groups = new Map<string, Fact[]>()
  for (const f of [...facts].sort((a, b) => a.title.localeCompare(b.title))) {
    groups.set(f.category, [...(groups.get(f.category) ?? []), f])
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b))
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

// Every fact in the chosen topic as a grid of picture cards, with a heading for
// each topic. Known facts are marked on their card.
export function BrowseList({ facts, knownIds, onOpen }: BrowseListProps) {
  return (
    <div className="browse">
      {groupByTopic(facts).map(([category, items]) => {
        const { slug, Icon } = topicLook(category)
        const known = items.filter((f) => knownIds.has(f.id)).length
        return (
          <section key={category} className="topic" data-topic={slug}>
            <div className="topic-head">
              <span className="topic-badge">
                <Icon aria-hidden="true" />
              </span>
              <h2 className="topic-name">{category}</h2>
              <span className="topic-count">
                {plural(items.length, 'fact')}
                {known > 0 && ` · ${known} known`}
              </span>
            </div>
            <ul className="cards">
              {items.map((f, i) => (
                // --i staggers the cards' entrance, one after another.
                <li key={f.id} style={{ '--i': i } as CSSProperties}>
                  <BrowseCard fact={f} known={knownIds.has(f.id)} onOpen={() => onOpen(f.id)} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
