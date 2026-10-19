import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { cardWidth } from '../stories/decorators'
import { facts } from '../stories/fixtures'
import { BrowseCard } from './BrowseCard'

// One card in the Browse grid. The top of the card depends on the fact's
// pictures: two photos side by side, one picture, or the topic's icon.
const meta = {
  title: 'Components/BrowseCard',
  component: BrowseCard,
  decorators: [cardWidth],
  args: { fact: facts.twoImages, known: false, onOpen: fn() },
  argTypes: { fact: { control: false } },
} satisfies Meta<typeof BrowseCard>

export default meta
type Story = StoryObj<typeof meta>

// Two photos side by side, with "vs" between them.
export const TwoPhotos: Story = {
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const { title, question } = facts.twoImages
    const card = canvas.getByRole('button', { name: `${title} ${question}` })
    await expect(canvasElement.querySelectorAll('img')).toHaveLength(2)
    await userEvent.click(card)
    await expect(args.onOpen).toHaveBeenCalled()
  },
}

// Three things compared: the first two photos are shown.
export const ThreePhotos: Story = {
  args: { fact: facts.threeImages },
}

export const OnePhoto: Story = {
  args: { fact: facts.oneImage },
}

// Maps are shown one at a time and never cropped, even when there are two.
export const Maps: Story = {
  args: { fact: facts.maps },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('img')).toHaveLength(1)
  },
}

export const Diagram: Story = {
  args: { fact: facts.diagrams },
}

// A diagram that spans the whole card in the fact itself.
export const WideDiagram: Story = {
  args: { fact: facts.wideDiagram },
}

// No pictures: the topic's icon, in the topic's colours.
export const NoPictures: Story = {
  args: { fact: facts.noImages },
}

// A topic with no icon in src/topics.ts gets a light bulb and the accent colour.
export const NewTopic: Story = {
  args: { fact: { ...facts.noImages, category: 'Music' } },
}

export const Known: Story = {
  args: { known: true },
  play: async ({ canvas }) => {
    const { title, question } = facts.twoImages
    await expect(canvas.getByRole('button', { name: `${title} ${question} Known` })).toBeInTheDocument()
  },
}

// Each "vs. <thing>" moves to the next line as one piece.
export const LongTitle: Story = {
  args: { fact: facts.longTitle },
}
