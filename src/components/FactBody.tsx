import type { Fact } from '../facts'
import { BonusCallout } from './BonusCallout'
import { DetailList } from './DetailList'
import { PhotoGrid } from './PhotoGrid'
import { SourceList } from './SourceList'

type FactBodyProps = {
  fact: Fact
}

// The full explanation shown after "Tell me", and when opening a card from Browse.
export function FactBody({ fact }: FactBodyProps) {
  return (
    <>
      <p className="answer">{fact.answer}</p>
      {fact.images && fact.images.length > 0 && <PhotoGrid images={fact.images} />}
      <DetailList details={fact.details} />
      {fact.bonus && <BonusCallout>{fact.bonus}</BonusCallout>}
      <SourceList sources={fact.sources} />
    </>
  )
}
