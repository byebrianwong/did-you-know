import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { appColumn } from '../stories/decorators'
import { DoneState } from './DoneState'

const meta = {
  title: 'Components/DoneState',
  component: DoneState,
  decorators: [appColumn],
  args: { total: 102, topic: null, onBrowse: fn(), onStartOver: fn() },
} satisfies Meta<typeof DoneState>

export default meta
type Story = StoryObj<typeof meta>

export const WholeDeck: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole('heading')).toHaveTextContent('You know all 102.')
    await userEvent.click(canvas.getByRole('button', { name: 'Go through again' }))
    await expect(args.onStartOver).toHaveBeenCalledOnce()
  },
}

export const OneTopic: Story = {
  args: { total: 21, topic: 'Animals' },
}
