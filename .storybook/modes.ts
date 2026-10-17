// Chromatic modes: each story is snapshotted once per mode.
// https://www.chromatic.com/docs/modes/

// Every component story: light and dark at desktop width.
export const themeModes = {
  light: { theme: 'light' },
  dark: { theme: 'dark' },
}

// Whole-page stories also get a phone width, where the layout changes (520px breakpoint).
export const pageModes = {
  ...themeModes,
  'light mobile': { theme: 'light', viewport: 'mobile' },
  'dark mobile': { theme: 'dark', viewport: 'mobile' },
}
