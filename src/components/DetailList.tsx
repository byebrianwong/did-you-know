import type { Fact } from '../facts'

type DetailListProps = {
  details: Fact['details']
}

// One short paragraph per thing being compared, e.g. "Graveyard" and "Cemetery".
export function DetailList({ details }: DetailListProps) {
  return (
    <dl className="details">
      {details.map((d) => (
        <div className="detail" key={d.term}>
          <dt>{d.term}</dt>
          <dd>{d.text}</dd>
        </div>
      ))}
    </dl>
  )
}
