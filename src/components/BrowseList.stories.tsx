import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { appColumn } from '../stories/decorators'
import { fact, sampleDeck } from '../stories/fixtures'
import { BrowseList } from './BrowseList'

const meta = {
  title: 'Components/BrowseList',
  component: BrowseList,
  decorators: [appColumn],
  args: {
    facts: sampleDeck,
    knownIds: new Set(['raven-crow', 'sea-ocean', 'jail-prison']),
    groupByTopic: true,
    onOpen: fn(),
  },
  argTypes: { facts: { control: false }, knownIds: { control: false } },
} satisfies Meta<typeof BrowseList>

export default meta
type Story = StoryObj<typeof meta>

// All topics: one section per topic, each with its own count. Known facts have a
// check mark.
export const AllTopics: Story = {
  play: async ({ args, canvas, userEvent }) => {
    // Topics A–Z, then facts by title, whatever the order of the facts passed in.
    const topics = canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    await expect(topics).toEqual(['Animals', 'Law & Crime', 'Weather & Space'])
    await expect(canvas.getAllByRole('listitem')[0]).toHaveTextContent('Elk vs. Moose')
    await expect(canvas.getByRole('region', { name: 'Animals' })).toHaveTextContent('1 of 3 known')
    await expect(canvas.getByRole('button', { name: /Raven vs\. Crow.*Known/ })).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: /Frog vs\. Toad/ }))
    await expect(args.onOpen).toHaveBeenCalledWith('frog-toad')
  },
}

// One topic chosen: a single list with no topic heading. The header's progress
// bar already counts this topic.
export const OneTopic: Story = {
  args: {
    facts: sampleDeck.filter((f) => f.category === 'Animals'),
    groupByTopic: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3)
  },
}

export const NoneKnown: Story = {
  args: { knownIds: new Set() },
}

export const LongTitles: Story = {
  args: {
    facts: [fact('england-britain-uk-british-isles'), fact('seltzer-club-soda-tonic-mineral-water'), fact('md-do')],
    knownIds: new Set(['md-do']),
  },
}
