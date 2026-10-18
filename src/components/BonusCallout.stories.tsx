import type { Meta, StoryObj } from '@storybook/react-vite'
import { appColumn } from '../stories/decorators'
import { fact } from '../stories/fixtures'
import { BonusCallout } from './BonusCallout'

const meta = {
  title: 'Components/BonusCallout',
  component: BonusCallout,
  decorators: [appColumn],
  args: { children: fact('raven-crow').bonus },
} satisfies Meta<typeof BonusCallout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabel: Story = {
  args: { label: 'Did you know?' },
}
