import type { Meta, StoryObj } from '@storybook/react-vite'
import { appColumn } from '../stories/decorators'
import { facts } from '../stories/fixtures'
import { SourceList } from './SourceList'

const meta = {
  title: 'Components/SourceList',
  component: SourceList,
  decorators: [appColumn],
  args: { sources: facts.manySources.sources },
} satisfies Meta<typeof SourceList>

export default meta
type Story = StoryObj<typeof meta>

export const SeveralSources: Story = {}

export const OneSource: Story = {
  args: { sources: facts.manySources.sources.slice(0, 1) },
}

// A source that is not a valid URL is shown as written instead of crashing.
export const NotAUrl: Story = {
  args: { sources: ['Oxford English Dictionary, 3rd edition', ...facts.manySources.sources.slice(0, 1)] },
}
