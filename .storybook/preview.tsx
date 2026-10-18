import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import '../src/index.css'
import { themeModes } from './modes'

const preview: Preview = {
  // A toolbar switch for light and dark. It sets data-theme on <html>, which
  // index.css reads.
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    layout: 'padded',
    // The page colour comes from the theme, so Storybook's own backgrounds tool is off.
    backgrounds: { disable: true },
    viewport: {
      options: {
        mobile: { name: 'Phone', styles: { width: '375px', height: '812px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '900px' } },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Fail the test run on any accessibility violation.
      test: 'error',
    },
    chromatic: { modes: themeModes },
  },
}

export default preview
