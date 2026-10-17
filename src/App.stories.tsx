import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useState } from 'react'
import { expect } from 'storybook/test'
import { pageModes } from '../.storybook/modes'
import App from './App'
import { emptyProgress, memoryStore, type Progress } from './progress'
import { sampleDeck } from './stories/fixtures'

// The whole app with a deck of 7 facts in a fixed order (no shuffling).
// Progress lives in memory, so each story starts from the progress it names and
// never touches the browser's storage.
type PageProps = Omit<ComponentProps<typeof App>, 'store'> & { progress: Progress }

function AppWithProgress({ progress, ...rest }: PageProps) {
  const [store] = useState(() => memoryStore(progress))
  return <App {...rest} store={store} />
}

const [raven, frog, elk, sea, lake] = sampleDeck
const everyId = sampleDeck.map((f) => f.id)

const meta = {
  title: 'Pages/App',
  component: AppWithProgress,
  args: { facts: sampleDeck, shuffle: false, initialMode: 'learn', progress: emptyProgress },
  argTypes: { facts: { control: false }, progress: { control: false } },
  parameters: { layout: 'fullscreen', chromatic: { modes: pageModes } },
} satisfies Meta<typeof AppWithProgress>

export default meta
type Story = StoryObj<typeof meta>

// --- States -------------------------------------------------------------------

export const FirstVisit: Story = {}

export const HalfKnown: Story = {
  args: { progress: { known: [raven.id, frog.id, elk.id], seen: [raven.id, frog.id, elk.id] } },
}

// Every fact is known, so Learn shows the "done" screen.
export const AllKnown: Story = {
  args: { progress: { known: everyId, seen: everyId } },
}

export const Browse: Story = {
  args: { initialMode: 'browse', progress: { known: [raven.id, sea.id], seen: [raven.id, sea.id] } },
}

// --- Flows (interaction tests) ------------------------------------------------
// Each play function runs in Storybook's Interactions panel, in `npm test`, and
// in Chromatic, which snapshots the screen after the last step.
// Cards fade in from opacity 0, so checks on card text use toBeInTheDocument()
// rather than toBeVisible(), which would fail during the fade.

export const RevealAndKnow: Story = {
  play: async ({ canvas, userEvent, step }) => {
    const meter = canvas.getByRole('progressbar', { name: 'Facts known' })

    await step('Reveal the answer', async () => {
      await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(raven.title)
      await userEvent.click(canvas.getByRole('button', { name: 'Tell me' }))
      await expect(canvas.getByText(raven.answer)).toBeInTheDocument()
    })

    await step('"I knew that" moves on and counts the card as known', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'I knew that' }))
      await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(frog.title)
      await expect(meter).toHaveAttribute('aria-valuenow', '1')
    })
  },
}

// "New to me" puts the card back 4 cards later (RETRY_GAP in useLearnDeck.ts).
export const NewToMeComesBack: Story = {
  play: async ({ canvas, userEvent, step }) => {
    const title = () => canvas.getByRole('heading', { level: 2 })

    await step(`Mark "${raven.title}" as new`, async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Tell me' }))
      await userEvent.click(canvas.getByRole('button', { name: 'New to me · next' }))
    })

    await step('Get through the next 4 cards', async () => {
      for (const next of [frog, elk, sea, lake]) {
        await expect(title()).toHaveTextContent(next.title)
        await userEvent.click(canvas.getByRole('button', { name: 'Tell me' }))
        await userEvent.click(canvas.getByRole('button', { name: 'I knew that' }))
      }
    })

    await step('The card comes back', async () => {
      await expect(title()).toHaveTextContent(raven.title)
    })
  },
}

export const KeyboardShortcuts: Story = {
  play: async ({ canvas, userEvent, step }) => {
    await step('Space reveals the answer', async () => {
      await userEvent.keyboard(' ')
      await expect(canvas.getByText(raven.answer)).toBeInTheDocument()
    })

    await step('K marks it as known', async () => {
      await userEvent.keyboard('k')
      await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(frog.title)
      await expect(canvas.getByRole('progressbar', { name: 'Facts known' })).toHaveAttribute('aria-valuenow', '1')
    })

    await step('N moves on without marking it', async () => {
      await userEvent.keyboard(' ')
      await userEvent.keyboard('n')
      await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(elk.title)
      await expect(canvas.getByRole('progressbar', { name: 'Facts known' })).toHaveAttribute('aria-valuenow', '1')
    })
  },
}

export const FilterByTopic: Story = {
  play: async ({ canvas, userEvent, step }) => {
    await step('Choose "Weather & Space"', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Weather & Space' }))
      await expect(canvas.getByRole('button', { name: 'Weather & Space' })).toHaveAttribute('aria-pressed', 'true')
      await expect(canvas.getByRole('progressbar', { name: 'Facts known' })).toHaveAttribute('aria-valuemax', '3')
      await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(sea.title)
    })

    await step('Browse lists only that topic', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Browse' }))
      await expect(canvas.getAllByRole('listitem')).toHaveLength(3)
    })
  },
}

export const MarkKnownFromBrowse: Story = {
  args: { initialMode: 'browse' },
  play: async ({ canvas, userEvent, step }) => {
    await step(`Open "${frog.title}" and mark it as known`, async () => {
      await userEvent.click(canvas.getByRole('button', { name: new RegExp(frog.title) }))
      await userEvent.click(canvas.getByRole('button', { name: 'I know this one' }))
      await expect(canvas.getByText('✓ You marked this as known')).toBeInTheDocument()
    })

    await step('The list shows it as known', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '← All facts' }))
      await expect(canvas.getByRole('button', { name: new RegExp(`${frog.title}.*Known`) })).toBeVisible()
      await expect(canvas.getByRole('progressbar', { name: 'Facts known' })).toHaveAttribute('aria-valuenow', '1')
    })
  },
}

export const GoThroughAgain: Story = {
  args: AllKnown.args,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(`You know all ${sampleDeck.length}.`)
    await userEvent.click(canvas.getByRole('button', { name: 'Go through again' }))
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(raven.title)
    await expect(canvas.getByRole('progressbar', { name: 'Facts known' })).toHaveAttribute('aria-valuenow', '0')
  },
}
