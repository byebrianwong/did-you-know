import type { Decorator } from '@storybook/react-vite'

// Shows a component at the app's column width (the .page container), so cards,
// grids and chips wrap the way they do in the app.
export const appColumn: Decorator = (Story) => (
  <div style={{ maxWidth: 680, margin: '0 auto' }}>
    <Story />
  </div>
)

// Shows one Browse card at the width it has in the app's three-column grid.
export const cardWidth: Decorator = (Story) => (
  <div style={{ width: 210, display: 'flex' }}>
    <Story />
  </div>
)
