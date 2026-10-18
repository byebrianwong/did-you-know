type BonusCalloutProps = {
  children: string
  label?: string
}

// A highlighted box for one surprising extra fact.
export function BonusCallout({ children, label = 'Weird bonus' }: BonusCalloutProps) {
  return (
    <aside className="bonus">
      <span className="bonus-label">{label}</span>
      <p>{children}</p>
    </aside>
  )
}
