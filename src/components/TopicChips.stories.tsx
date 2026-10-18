import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { facts } from '../facts'
import { appColumn } from '../stories/decorators'
import { TopicChips } from './TopicChips'

const allTopics = ['All', ...new Set(facts.map((f) => f.category))].sort((a, b) =>
  a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b),
)

const meta = {
  title: 'Components/TopicChips',
  component: TopicChips,
  decorators: [appColumn],
  args: {
    options: ['All', 'Animals', 'Food & Drink', 'Weather & Space'],
    selected: 'All',
    onSelect: fn(),
  },
} satisfies Meta<typeof TopicChips>

export default meta
type Story = StoryObj<typeof meta>

export const AllSelected: Story = {}

export const OneSelected: Story = {
  args: { selected: 'Food & Drink' },
}

// Every topic in the real data. They wrap onto a second line at desktop width,
// and scroll sideways in one row on a phone.
export const EveryTopic: Story = {
  args: { options: allTopics },
}

export const SelectsATopic: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const chip = canvas.getByRole('button', { name: 'Animals' })
    await expect(chip).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(chip)
    await expect(args.onSelect).toHaveBeenCalledWith('Animals')
  },
}
