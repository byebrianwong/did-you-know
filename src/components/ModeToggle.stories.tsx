import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { ModeToggle } from './ModeToggle'

const meta = {
  title: 'Components/ModeToggle',
  component: ModeToggle,
  args: { mode: 'learn', onChange: fn() },
} satisfies Meta<typeof ModeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Learn: Story = {}

export const Browse: Story = {
  args: { mode: 'browse' },
}

export const SwitchesView: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole('button', { name: 'Learn' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Browse' }))
    await expect(args.onChange).toHaveBeenCalledWith('browse')
  },
}
