import type { Fact } from '../facts'

type FactHeadingProps = {
  fact: Fact
}

// Topic tag, title and question: the top of every card.
export function FactHeading({ fact }: FactHeadingProps) {
  return (
    <>
      <span className="tag">{fact.category}</span>
      <h2 className="title">{fact.title}</h2>
      <p className="question">{fact.question}</p>
    </>
  )
}
