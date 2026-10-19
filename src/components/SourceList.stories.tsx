import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
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

// One pill per source, each a link named by its site.
export const SeveralSources: Story = {
  play: async ({ args, canvas }) => {
    const list = canvas.getByRole('list', { name: 'Sources' })
    await expect(list.querySelectorAll('li')).toHaveLength(args.sources.length)
    const first = canvas.getAllByRole('link')[0]
    await expect(first).toHaveAttribute('href', args.sources[0])
    await expect(first).toHaveAccessibleName(new URL(args.sources[0]).hostname.replace(/^www\./, ''))
  },
}

export const OneSource: Story = {
  args: { sources: facts.manySources.sources.slice(0, 1) },
}

// A source that is not a URL is shown as plain text, not as a link that goes nowhere.
export const NotAUrl: Story = {
  args: { sources: ['Oxford English Dictionary, 3rd edition', ...facts.manySources.sources.slice(0, 1)] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Oxford English Dictionary, 3rd edition').closest('a')).toBeNull()
    await expect(canvas.getAllByRole('link')).toHaveLength(1)
  },
}
