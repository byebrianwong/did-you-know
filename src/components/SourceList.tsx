import { useId } from 'react'

type SourceListProps = {
  sources: string[]
}

// The site name of a URL, or null when the source is not a URL (a book, say).
function hostname(source: string) {
  try {
    return new URL(source).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

// Where the fact came from: one pill per source, showing the site name. A source
// that is not a URL is shown as plain text instead of a link that goes nowhere.
export function SourceList({ sources }: SourceListProps) {
  const labelId = useId()
  if (sources.length === 0) return null
  return (
    <div className="sources">
      <span className="sources-label" id={labelId}>
        Sources
      </span>
      <ul className="source-list" aria-labelledby={labelId}>
        {sources.map((s) => {
          const host = hostname(s)
          return (
            <li key={s}>
              {host ? (
                <a className="source" href={s} target="_blank" rel="noreferrer">
                  {host}
                  <svg className="source-arrow" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path
                      d="M3 7 7 3M3.5 3H7v3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ) : (
                <span className="source">{s}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
