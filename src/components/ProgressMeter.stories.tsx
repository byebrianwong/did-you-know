import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { appColumn } from '../stories/decorators'
import { ProgressMeter } from './ProgressMeter'

const meta = {
  title: 'Components/ProgressMeter',
  component: ProgressMeter,
  decorators: [appColumn],
  args: { known: 5, total: 12 },
} satisfies Meta<typeof ProgressMeter>

export default meta
type Story = StoryObj<typeof meta>

export const Partway: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Facts known' })
    await expect(bar).toHaveAttribute('aria-valuenow', '5')
    await expect(bar).toHaveAttribute('aria-valuetext', '5 of 12 known')
  },
}

export const NoneKnown: Story = {
  args: { known: 0 },
}

export const AllKnown: Story = {
  args: { known: 12 },
}

// A topic with no facts. The bar stays empty instead of dividing by zero.
export const NoFacts: Story = {
  args: { known: 0, total: 0 },
}

// Three-digit numbers, as in the full deck of 102.
export const FullDeck: Story = {
  args: { known: 87, total: 102 },
}
