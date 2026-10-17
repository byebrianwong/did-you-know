import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { pageModes } from '../../.storybook/modes'
import { appColumn } from '../stories/decorators'
import { Header } from './Header'

const meta = {
  title: 'Components/Header',
  component: Header,
  decorators: [appColumn],
  args: {
    mode: 'learn',
    onModeChange: fn(),
    knownCount: 4,
    total: 102,
    topicOptions: ['All', 'Animals', 'Body & Health', 'Death & Burial', 'Food & Drink', 'Law & Crime'],
    topic: 'All',
    onTopicChange: fn(),
  },
  // The header changes most on a phone: smaller logo, chips in one scrolling row.
  parameters: { chromatic: { modes: pageModes } },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Learn: Story = {}

export const BrowseOneTopic: Story = {
  args: { mode: 'browse', topic: 'Animals', knownCount: 9, total: 21 },
}
