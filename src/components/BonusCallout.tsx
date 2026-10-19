type BonusCalloutProps = {
  children: string
  label?: string
}

// A highlighted box for one surprising extra fact, with a lightbulb by its label.
export function BonusCallout({ children, label = 'Weird bonus' }: BonusCalloutProps) {
  return (
    <aside className="bonus">
      <span className="bonus-label">
        <svg className="bonus-icon" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 1.5a4.5 4.5 0 0 0-2.6 8.2c.4.3.6.7.6 1.1v.7h4v-.7c0-.4.2-.8.6-1.1A4.5 4.5 0 0 0 8 1.5ZM6 13.5h4M6.8 15h2.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </span>
      <p>{children}</p>
    </aside>
  )
}
