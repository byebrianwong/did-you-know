import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
  framework: '@storybook/react-vite',
  // Serves public/ at the root, so fact pictures load at /images/... as in the app.
  staticDirs: ['../public'],
}

export default config
