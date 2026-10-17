import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { appColumn } from '../stories/decorators'
import { facts } from '../stories/fixtures'
import { LearnCard } from './LearnCard'

const meta = {
  title: 'Components/LearnCard',
  component: LearnCard,
  decorators: [appColumn],
  args: {
    fact: facts.twoImages,
    revealed: false,
    onReveal: fn(),
    onKnewIt: fn(),
    onNewToMe: fn(),
  },
  argTypes: { fact: { control: false } },
} satisfies Meta<typeof LearnCard>

export default meta
type Story = StoryObj<typeof meta>

// Before "Tell me": only the question.
export const Question: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Tell me' }))
    await expect(args.onReveal).toHaveBeenCalledOnce()
  },
}

// After "Tell me": the answer, pictures, details and the two choices.
export const Revealed: Story = {
  args: { revealed: true },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'I knew that' }))
    await expect(args.onKnewIt).toHaveBeenCalledOnce()
    await userEvent.click(canvas.getByRole('button', { name: 'New to me · next' }))
    await expect(args.onNewToMe).toHaveBeenCalledOnce()
  },
}

export const RevealedWithoutPhotos: Story = {
  args: { revealed: true, fact: facts.noImages },
}

// The longest title in the data (62 characters) wraps onto several lines.
export const LongTitle: Story = {
  args: { fact: facts.longTitle },
}
