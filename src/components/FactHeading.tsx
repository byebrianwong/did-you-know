import type { Fact } from '../facts'
import { topicLook } from '../topics'
import { VsTitle } from './VsTitle'

type FactHeadingProps = {
  fact: Fact
}

// Topic tag, title and question: the top of every card. The tag shows the
// topic's icon, and the tag and each "vs." in the title use the topic's colour,
// the same as the topic's cards in Browse.
export function FactHeading({ fact }: FactHeadingProps) {
  const { slug, Icon } = topicLook(fact.category)
  return (
    <>
      <span className="tag" data-topic={slug}>
        <Icon aria-hidden="true" />
        {fact.category}
      </span>
      <h2 className="title" data-topic={slug}>
        <VsTitle title={fact.title} />
      </h2>
      <p className="question">{fact.question}</p>
    </>
  )
}
