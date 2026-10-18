type SourceListProps = {
  sources: string[]
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// Links to where the fact came from, shown by site name.
export function SourceList({ sources }: SourceListProps) {
  if (sources.length === 0) return null
  return (
    <p className="sources">
      Sources:{' '}
      {sources.map((s, i) => (
        <span key={s}>
          {i > 0 && ' · '}
          <a href={s} target="_blank" rel="noreferrer">
            {hostname(s)}
          </a>
        </span>
      ))}
    </p>
  )
}
