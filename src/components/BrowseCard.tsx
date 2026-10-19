import { Fragment } from 'react'
import type { Fact, FactImage } from '../facts'
import { topicLook } from '../topics'

type BrowseCardProps = {
  fact: Fact
  known: boolean
  onOpen: () => void
}

// The pictures at the top of the card.
// - Two photos side by side when the fact has them, so the card shows the two
//   things being compared.
// - Otherwise one picture. Maps and diagrams need the room to be read, so they
//   are never split or cropped.
// - No pictures: an empty list, and the card shows the topic's icon instead.
function coverImages(images: FactImage[] = []): FactImage[] {
  const notWide = images.filter((img) => !img.wide)
  const [first, second] = notWide.length > 0 ? notWide : images
  if (!first) return []
  if (second && !first.fit && !second.fit) return [first, second]
  return [first]
}

// "Raven vs. Crow", with each "vs." styled on its own. Each "vs. <thing>" is kept
// together on one line when it fits ("vs. Sea Lion" never splits after "Sea"),
// so a line never ends with "vs.". The text stays the same for screen readers
// and tests.
function VsTitle({ title }: { title: string }) {
  const [first, ...others] = title.split(' vs. ')
  return (
    <>
      {first}
      {others.map((part, i) => (
        <Fragment key={i}>
          {' '}
          <span className="vs-part">
            <span className="vs">vs.</span> {part}
          </span>
        </Fragment>
      ))}
    </>
  )
}

// One fact in the Browse grid: pictures, title and question. The whole card is
// a button that opens the fact. Its accessible name is its text: the title, the
// question, then "Known".
export function BrowseCard({ fact, known, onOpen }: BrowseCardProps) {
  const { slug, Icon } = topicLook(fact.category)
  const cover = coverImages(fact.images)

  return (
    <button type="button" className="fcard" data-topic={slug} onClick={onOpen}>
      <span className={`fcard-cover fcard-cover-${cover.length}`}>
        {cover.length === 0 ? (
          <span className="fcard-icon">
            <Icon aria-hidden="true" strokeWidth={1.5} />
          </span>
        ) : (
          cover.map((img) => (
            // The title already names the card, so the pictures are decorative here.
            <img
              key={img.src}
              src={img.src}
              alt=""
              loading="lazy"
              className={img.fit === 'contain' ? 'fcard-contain' : undefined}
            />
          ))
        )}
        {cover.length === 2 && (
          <span className="fcard-vs" aria-hidden="true">
            vs
          </span>
        )}
      </span>
      <span className="fcard-body">
        <span className="fcard-title">
          <VsTitle title={fact.title} />
        </span>
        <span className="fcard-question">{fact.question}</span>
      </span>
      {/* Last, so it is read after the title. CSS places it on the picture. */}
      {known && (
        <span className="fcard-known">
          <span aria-hidden="true">✓ </span>Known
        </span>
      )}
    </button>
  )
}
