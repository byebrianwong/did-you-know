import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // primary: the main action on a card. quiet: the secondary one.
  variant?: 'primary' | 'quiet'
  // Fill the width of the card.
  wide?: boolean
  // The key that also does this, e.g. "K". It shows as a key cap after the label
  // (hidden on phones and touch screens) and is announced by screen readers through
  // aria-keyshortcuts. The button does not listen for the key itself; App.tsx does.
  shortcut?: string
}

export function Button({
  variant = 'primary',
  wide = false,
  shortcut,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, wide && 'btn-wide', className].filter(Boolean).join(' ')
  return (
    <button type={type} className={classes} aria-keyshortcuts={shortcut} {...rest}>
      {children}
      {shortcut && (
        // aria-hidden keeps the key out of the button's name: it stays "I knew that".
        <kbd className="key" aria-hidden="true">
          {shortcut}
        </kbd>
      )}
    </button>
  )
}
