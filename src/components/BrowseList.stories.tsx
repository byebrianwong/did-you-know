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
    showCategory: true,
    onOpen: fn(),
  },
  argTypes: { facts: { control: false }, knownIds: { control: false } },
} satisfies Meta<typeof BrowseList>

export default meta
type Story = StoryObj<typeof meta>

// All topics: each row names its topic. Known facts have a check mark.
export const AllTopics: Story = {
  play: async ({ args, canvas, userEvent }) => {
    // Sorted by title, whatever the order of the facts passed in.
    const rows = canvas.getAllByRole('listitem')
    await expect(rows[0]).toHaveTextContent('Elk vs. Moose')
    await expect(canvas.getByRole('button', { name: /Raven vs\. Crow.*Known/ })).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: /Frog vs\. Toad/ }))
    await expect(args.onOpen).toHaveBeenCalledWith('frog-toad')
  },
}

// One topic chosen: the topic name under each title is left out.
export const OneTopic: Story = {
  args: {
    facts: sampleDeck.filter((f) => f.category === 'Animals'),
    showCategory: false,
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
