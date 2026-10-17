import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // primary: the main action on a card. quiet: the secondary one.
  variant?: 'primary' | 'quiet'
  // Fill the width of the card.
  wide?: boolean
}

export function Button({ variant = 'primary', wide = false, className, type = 'button', ...rest }: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, wide && 'btn-wide', className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...rest} />
}
