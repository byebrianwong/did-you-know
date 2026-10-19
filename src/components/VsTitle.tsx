import { Fragment } from 'react'

// "Raven vs. Crow", with each "vs." styled on its own (in the topic's colour,
// from the nearest data-topic). Each "vs. <thing>" is kept together on one line
// when it fits ("vs. Sea Lion" never splits after "Sea"), so a line never ends
// with "vs.". The text stays the same for screen readers and tests.
export function VsTitle({ title }: { title: string }) {
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
