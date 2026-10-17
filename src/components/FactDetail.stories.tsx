import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { appColumn } from '../stories/decorators'
import { facts } from '../stories/fixtures'
import { FactDetail } from './FactDetail'

const meta = {
  title: 'Components/FactDetail',
  component: FactDetail,
  decorators: [appColumn],
  args: {
    fact: facts.threeImages,
    known: false,
    backLabel: 'All facts',
    onBack: fn(),
    onKnownChange: fn(),
  },
  argTypes: { fact: { control: false } },
} satisfies Meta<typeof FactDetail>

export default meta
type Story = StoryObj<typeof meta>

export const InLearnDeck: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'I know this one' }))
    await expect(args.onKnownChange).toHaveBeenCalledWith(true)
  },
}

export const Known: Story = {
  args: { known: true },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Put back in Learn' }))
    await expect(args.onKnownChange).toHaveBeenCalledWith(false)
  },
}

// Opened while one topic is chosen, so the back link names it.
export const OpenedFromATopic: Story = {
  args: { backLabel: 'All Animals' },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '← All Animals' }))
    await expect(args.onBack).toHaveBeenCalledOnce()
  },
}
