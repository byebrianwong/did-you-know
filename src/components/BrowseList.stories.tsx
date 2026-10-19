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
    onOpen: fn(),
  },
  argTypes: { facts: { control: false }, knownIds: { control: false } },
} satisfies Meta<typeof BrowseList>

export default meta
type Story = StoryObj<typeof meta>

// All topics: a heading for each topic, then its cards. Known facts are marked.
// Cards fade in from opacity 0, so checks use toBeInTheDocument() rather than
// toBeVisible(), which would fail during the fade.
export const AllTopics: Story = {
  play: async ({ args, canvas, userEvent }) => {
    // Topics in alphabetical order, each with a count.
    const headings = canvas.getAllByRole('heading', { level: 2 })
    await expect(headings.map((h) => h.textContent)).toEqual(['Animals', 'Law & Crime', 'Weather & Space'])
    await expect(canvas.getByText('1 fact · 1 known')).toBeInTheDocument()

    // Facts sorted by title within their topic, whatever the order passed in.
    const cards = canvas.getAllByRole('listitem')
    await expect(cards[0]).toHaveTextContent('Elk vs. Moose')
    await expect(canvas.getByRole('button', { name: /^Raven vs\. Crow.*Known$/ })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: /^Frog vs\. Toad/ }))
    await expect(args.onOpen).toHaveBeenCalledWith('frog-toad')
  },
}

// One topic chosen: one heading.
export const OneTopic: Story = {
  args: {
    facts: sampleDeck.filter((f) => f.category === 'Animals'),
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
